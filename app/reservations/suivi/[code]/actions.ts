'use server'

import { revalidatePath } from 'next/cache'

import { sendAdminSiteNotification } from '@/lib/email/sendgrid'
import { notifyRestaurantReservationCancelledByClient } from '@/lib/reservation-notifications'
import {
  formatReservationDateFr,
  formatReservationTimeFr,
  isReservationLinkExpiredFromRecord,
  reservationClientUrl,
  reservationLinkExpiredMessage,
  reservationManageUrl,
  type ReservationRecord,
  type ReservationStatus,
} from '@/lib/reservations'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const CODE_RE = /^[A-Za-z0-9]{8}$/

const CANCELLABLE_STATUSES: ReservationStatus[] = ['pending', 'confirmed']

export async function cancelReservationByClientAction(
  publicCode: string,
  clientMessage?: string,
): Promise<{ error?: string; ok?: boolean; status?: ReservationStatus }> {
  const code = publicCode.trim()
  if (!CODE_RE.test(code)) {
    return { error: 'Lien invalide.' }
  }

  const message = String(clientMessage ?? '').trim()
  if (message.length < 10) {
    return { error: 'Indiquez un motif d’annulation (au moins 10 caractères).' }
  }
  if (message.length > 500) {
    return { error: 'Motif trop long (500 caractères max.).' }
  }

  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'Service indisponible.' }

  const { data: reservation, error } = await admin
    .from('reservations')
    .select('*')
    .eq('public_code', code)
    .maybeSingle()

  if (error || !reservation) {
    return { error: 'Réservation introuvable.' }
  }

  const row = reservation as ReservationRecord

  if (isReservationLinkExpiredFromRecord(row)) {
    return { error: reservationLinkExpiredMessage }
  }

  if (!CANCELLABLE_STATUSES.includes(row.status)) {
    return { error: 'Cette réservation ne peut plus être annulée.', status: row.status }
  }

  const { error: messageError } = await admin.from('reservation_messages').insert({
    reservation_id: row.id,
    sender_type: 'client',
    message,
  })

  if (messageError) {
    return { error: messageError.message }
  }

  const { error: updateError } = await admin
    .from('reservations')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', row.id)
    .in('status', CANCELLABLE_STATUSES)

  if (updateError) {
    return { error: updateError.message }
  }

  const updated = { ...row, status: 'cancelled' as const }

  const { data: restaurant } = await admin
    .from('restaurants')
    .select('name, email, whatsapp_phone')
    .eq('id', row.restaurant_id)
    .maybeSingle()

  try {
    await notifyRestaurantReservationCancelledByClient(
      updated,
      {
        name: restaurant?.name ?? 'Restaurant',
        email: restaurant?.email ?? null,
        whatsappPhone: restaurant?.whatsapp_phone ?? null,
      },
      message,
    )
  } catch (notifyError) {
    console.error('[reservation-suivi] notify cancel', notifyError)
  }

  revalidatePath(`/reservations/suivi/${code}`)
  revalidatePath(`/reservations/gestion/${code}`)
  return { ok: true, status: 'cancelled' }
}

export async function reportReservationProblemAction(
  publicCode: string,
  problemDescription: string,
  reporter: 'client' | 'restaurant' = 'client',
): Promise<{ error?: string; ok?: boolean }> {
  const code = publicCode.trim()
  if (!CODE_RE.test(code)) {
    return { error: 'Lien invalide.' }
  }

  const description = String(problemDescription ?? '').trim()
  if (description.length < 10) {
    return { error: 'Décrivez le problème en au moins 10 caractères.' }
  }
  if (description.length > 1000) {
    return { error: 'Message trop long (1000 caractères max.).' }
  }

  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'Service indisponible.' }

  const { data: reservation, error } = await admin
    .from('reservations')
    .select('*')
    .eq('public_code', code)
    .maybeSingle()

  if (error || !reservation) {
    return { error: 'Réservation introuvable.' }
  }

  const row = reservation as ReservationRecord

  if (isReservationLinkExpiredFromRecord(row)) {
    return { error: reservationLinkExpiredMessage }
  }

  const { data: restaurant } = await admin
    .from('restaurants')
    .select('name, slug')
    .eq('id', row.restaurant_id)
    .maybeSingle()

  const restaurantName = restaurant?.name ?? 'Restaurant'
  const date = formatReservationDateFr(row.booking_date)
  const time = formatReservationTimeFr(row.booking_time)
  const clientUrl = reservationClientUrl(code)
  const manageUrl = reservationManageUrl(code)

  const reservationInfo = [
    `Code : ${code}`,
    `Restaurant : ${restaurantName}`,
    restaurant?.slug ? `Fiche : /restaurants/${restaurant.slug}` : null,
    `Client : ${row.client_name} (${row.client_email})`,
    row.client_phone ? `Téléphone client : ${row.client_phone}` : null,
    `Date : ${date} à ${time}`,
    `Personnes : ${row.group_size}`,
    `Statut : ${row.status}`,
    row.remarks ? `Remarques : ${row.remarks}` : null,
    `Suivi client : ${clientUrl}`,
    `Gestion resto : ${manageUrl}`,
  ]
    .filter(Boolean)
    .join('\n\n')

  const reporterLabel = reporter === 'restaurant' ? 'Restaurant' : 'Client'

  const message = [
    `Signalement ${reporterLabel.toLowerCase()} — réservation Afroliya`,
    '',
    `Signalé par : ${reporterLabel}`,
    '',
    `Message :`,
    '',
    description,
    '',
    'Informations de la réservation :',
    '',
    reservationInfo,
  ].join('\n')

  try {
    await sendAdminSiteNotification({
      subject: `[Afroliya] Problème réservation (${reporterLabel}) — ${restaurantName}`,
      message,
    })
  } catch (notifyError) {
    console.error('[reservation-suivi] report', notifyError)
    return { error: 'Envoi du signalement impossible. Réessayez plus tard.' }
  }

  return { ok: true }
}
