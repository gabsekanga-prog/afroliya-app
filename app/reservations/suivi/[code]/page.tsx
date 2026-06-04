import { notFound } from 'next/navigation'

import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { isReservationLinkExpired } from '@/lib/reservations'
import { siteHeading1Class } from '@/lib/site-styles'

import { restaurantSlugFromName } from '@/lib/restaurant-slug'

import { ReservationSecureLinkNotice } from '@/app/reservations/reservation-secure-link-notice'

import { ReservationClientPanel } from './reservation-client-panel'

const CODE_RE = /^[A-Za-z0-9]{8}$/

type Params = { code: string }

export default async function ReservationClientPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { code } = await params
  if (!CODE_RE.test(code)) notFound()

  const admin = getSupabaseAdmin()
  if (!admin) notFound()

  const { data: reservation } = await admin
    .from('reservations')
    .select(
      'client_name, booking_date, booking_time, group_size, remarks, status, restaurant_id',
    )
    .eq('public_code', code)
    .maybeSingle()

  if (!reservation) notFound()

  const { data: restaurant } = await admin
    .from('restaurants')
    .select('name, slug, phone, address, google_maps_link')
    .eq('id', reservation.restaurant_id)
    .maybeSingle()

  const restaurantName = restaurant?.name ?? 'Restaurant'
  const restaurantSlug =
    (restaurant?.slug ?? '').trim() || restaurantSlugFromName(restaurantName)

  const expired = isReservationLinkExpired(
    String(reservation.booking_date),
    String(reservation.booking_time),
  )

  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className={siteHeading1Class}>Votre réservation</h1>
        <p className="mt-2 text-lg text-neutral-800">
          <span className="font-semibold">Nom : </span>
          {reservation.client_name}
        </p>
        <ReservationClientPanel
            publicCode={code}
            restaurantName={restaurantName}
            restaurant={{
              slug: restaurantSlug,
              phone: restaurant?.phone ?? null,
              address: restaurant?.address ?? null,
              googleMapsLink: restaurant?.google_maps_link ?? null,
            }}
            reservation={{
              client_name: reservation.client_name,
              booking_date: reservation.booking_date,
              booking_time: reservation.booking_time,
              group_size: Number(reservation.group_size),
              remarks: reservation.remarks,
              status: reservation.status,
            }}
            expired={expired}
          />
        <ReservationSecureLinkNotice expired={expired} />
      </div>
      <SiteFooter />
    </main>
  )
}
