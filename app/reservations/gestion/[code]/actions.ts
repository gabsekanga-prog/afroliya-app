'use server'

import { revalidatePath } from 'next/cache'

import { notifyReservationStatusChange } from '@/lib/reservation-notifications'
import type { ReservationRecord, ReservationStatus } from '@/lib/reservations'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const CODE_RE = /^[A-Za-z0-9]{8}$/

export async function updateReservationStatusAction(
  publicCode: string,
  nextStatus: 'confirmed' | 'declined',
): Promise<{ error?: string; ok?: boolean; status?: ReservationStatus }> {
  const code = publicCode.trim()
  if (!CODE_RE.test(code)) {
    return { error: 'Code invalide.' }
  }

  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'Service indisponible.' }

  const { data: reservation, error } = await admin
    .from('reservations')
    .select('*')
    .eq('public_code', code)
    .maybeSingle()

  if (error || !reservation) {
    return { error: 'Demande introuvable.' }
  }

  const row = reservation as ReservationRecord

  if (new Date(row.public_code_expires_at).getTime() < Date.now()) {
    return { error: 'Ce lien a expiré.' }
  }

  if (row.status !== 'pending') {
    return { error: 'Cette demande a déjà été traitée.', status: row.status }
  }

  const { data: restaurant } = await admin
    .from('restaurants')
    .select('name, email, whatsapp_phone')
    .eq('id', row.restaurant_id)
    .maybeSingle()

  const { error: updateError } = await admin
    .from('reservations')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', row.id)
    .eq('status', 'pending')

  if (updateError) {
    return { error: updateError.message }
  }

  const updated = { ...row, status: nextStatus }

  try {
    await notifyReservationStatusChange(
      updated,
      {
        name: restaurant?.name ?? 'Restaurant',
        email: restaurant?.email ?? null,
        whatsappPhone: restaurant?.whatsapp_phone ?? null,
      },
      nextStatus,
    )
  } catch (notifyError) {
    console.error('[reservation-action] notify', notifyError)
  }

  revalidatePath(`/reservations/gestion/${code}`)
  return { ok: true, status: nextStatus }
}
