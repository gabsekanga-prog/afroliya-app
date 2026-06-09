import { NextResponse } from 'next/server'

import { syncSendGridContactFromFullName } from '@/lib/email/sendgrid-contacts'
import { notifyNewReservation } from '@/lib/reservation-notifications'
import {
  parseRestaurantOpeningSlots,
  validateBookingAgainstOpeningHours,
} from '@/lib/reservation-opening-hours'
import {
  computePublicCodeExpiresAt,
  generateReservationPublicCode,
  validateCreateReservationPayload,
  type ReservationRecord,
} from '@/lib/reservations'
import {
  fetchRestaurantMonthlyReservationCount,
  isAfroliyaReservationAvailable,
  NON_SPONSORED_MONTHLY_RESERVATION_LIMIT,
} from '@/lib/restaurant-reservation-capacity'
import { isRestaurantSponsorshipActive } from '@/lib/restaurant-sponsorship'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type RouteContext = { params: Promise<{ restaurantId: string }> }

export async function POST(request: Request, context: RouteContext) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Service indisponible.' }, { status: 503 })
  }

  const { restaurantId } = await context.params
  if (!UUID_RE.test(restaurantId)) {
    return NextResponse.json({ error: 'Restaurant invalide.' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const parsed = validateCreateReservationPayload({
    bookingDate: String(body.bookingDate ?? ''),
    bookingTime: String(body.bookingTime ?? ''),
    groupSize: Number(body.groupSize),
    clientName: String(body.clientName ?? ''),
    clientEmail: String(body.clientEmail ?? ''),
    clientPhone: String(body.clientPhone ?? ''),
    remarks: String(body.remarks ?? ''),
  })

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { data: openingRows } = await admin
    .from('restaurant_opening_slots')
    .select('day, open_time, close_time, sort_order')
    .eq('restaurant_id', restaurantId)

  const openingHours = parseRestaurantOpeningSlots((openingRows ?? []) as Parameters<
    typeof parseRestaurantOpeningSlots
  >[0])

  const hoursCheck = validateBookingAgainstOpeningHours(
    openingHours,
    parsed.data.bookingDate,
    parsed.data.bookingTime,
  )
  if (!hoursCheck.ok) {
    return NextResponse.json({ error: hoursCheck.error }, { status: 400 })
  }

  const { data: verified } = await admin
    .from('verified_client_emails')
    .select('email')
    .eq('email', parsed.data.clientEmail)
    .maybeSingle()

  if (!verified) {
    return NextResponse.json(
      { error: 'Veuillez valider votre adresse e-mail avant de confirmer.' },
      { status: 403 },
    )
  }

  const { data: restaurant, error: restaurantError } = await admin
    .from('restaurants')
    .select(
      'id, name, email, whatsapp_phone, active, sponsored, booking_url, sponsorship_start_date, sponsorship_end_date',
    )
    .eq('id', restaurantId)
    .eq('active', true)
    .maybeSingle()

  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: 'Restaurant introuvable.' }, { status: 404 })
  }

  const sponsorshipFields = {
    sponsored: restaurant.sponsored === true,
    sponsorshipStartDate: restaurant.sponsorship_start_date,
    sponsorshipEndDate: restaurant.sponsorship_end_date,
  }

  if (!isRestaurantSponsorshipActive(sponsorshipFields)) {
    const monthlyCount = await fetchRestaurantMonthlyReservationCount(restaurantId)
    if (!isAfroliyaReservationAvailable(sponsorshipFields, monthlyCount)) {
      return NextResponse.json(
        {
          error:
            monthlyCount >= NON_SPONSORED_MONTHLY_RESERVATION_LIMIT
              ? 'Complet ce mois-ci sur Afroliya.'
              : 'Réservation en ligne indisponible pour ce restaurant.',
        },
        { status: 403 },
      )
    }
  }

  let publicCode = generateReservationPublicCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: inserted, error: insertError } = await admin
      .from('reservations')
      .insert({
        restaurant_id: restaurantId,
        client_name: parsed.data.clientName,
        client_email: parsed.data.clientEmail,
        client_phone: parsed.data.clientPhone ?? null,
        booking_date: parsed.data.bookingDate,
        booking_time: `${parsed.data.bookingTime}:00`,
        group_size: parsed.data.groupSize,
        remarks: parsed.data.remarks ?? null,
        status: 'pending',
        public_code: publicCode,
        public_code_expires_at: computePublicCodeExpiresAt(
          parsed.data.bookingDate,
          parsed.data.bookingTime,
        ),
      })
      .select('*')
      .single()

    if (!insertError && inserted) {
      const reservation = inserted as ReservationRecord

      try {
        await notifyNewReservation(reservation, {
          name: restaurant.name,
          email: restaurant.email,
          whatsappPhone: restaurant.whatsapp_phone,
        })
      } catch (notifyError) {
        console.error('[reservations] notifications', notifyError)
      }

      syncSendGridContactFromFullName({
        email: parsed.data.clientEmail,
        fullName: parsed.data.clientName,
        phone: parsed.data.clientPhone,
        source: 'reservation',
      })

      return NextResponse.json({ ok: true, publicCode: reservation.public_code })
    }

    if (insertError?.message.toLowerCase().includes('public_code')) {
      publicCode = generateReservationPublicCode()
      continue
    }

    console.error('[reservations] insert', insertError?.message)
    return NextResponse.json({ error: 'Création impossible.' }, { status: 500 })
  }

  return NextResponse.json({ error: 'Création impossible.' }, { status: 500 })
}
