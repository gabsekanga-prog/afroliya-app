import { notFound } from 'next/navigation'

import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { siteBodyClass, siteHeading1Class } from '@/lib/site-styles'

import { ReservationManagePanel } from './reservation-manage-panel'

const CODE_RE = /^[A-Za-z0-9]{8}$/

type Params = { code: string }

export default async function ReservationManagePage({
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
      'client_name, client_email, client_phone, booking_date, booking_time, group_size, remarks, status, public_code_expires_at, restaurant_id',
    )
    .eq('public_code', code)
    .maybeSingle()

  if (!reservation) notFound()

  const { data: restaurant } = await admin
    .from('restaurants')
    .select('name')
    .eq('id', reservation.restaurant_id)
    .maybeSingle()

  const expired =
    new Date(String(reservation.public_code_expires_at)).getTime() < Date.now()

  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className={siteHeading1Class}>Gérer la réservation</h1>
        <p className={`mt-3 ${siteBodyClass}`}>
          Acceptez ou refusez cette demande. Le client sera informé par e-mail.
        </p>
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <ReservationManagePanel
            publicCode={code}
            restaurantName={restaurant?.name ?? 'Restaurant'}
            reservation={{
              client_name: reservation.client_name,
              client_email: reservation.client_email,
              client_phone: reservation.client_phone,
              booking_date: reservation.booking_date,
              booking_time: reservation.booking_time,
              group_size: Number(reservation.group_size),
              remarks: reservation.remarks,
              status: reservation.status,
            }}
            expired={expired}
          />
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
