import { isRestaurantSponsorshipActive, type RestaurantSponsorshipFields } from '@/lib/restaurant-sponsorship'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const NON_SPONSORED_MONTHLY_RESERVATION_LIMIT = 1

const CAPACITY_TIMEZONE = 'Europe/Brussels'

const ACTIVE_RESERVATION_STATUSES = new Set(['pending', 'confirmed', 'no_show'])

export type RestaurantReservationDisplayState = 'form' | 'monthly_full'

function todayInBrussels(reference = new Date()): string {
  return reference.toLocaleDateString('en-CA', { timeZone: CAPACITY_TIMEZONE })
}

/** Bornes du mois civil en cours (Europe/Brussels), format YYYY-MM-DD. */
export function currentMonthBoundsInBrussels(reference = new Date()): {
  startDate: string
  endDateExclusive: string
} {
  const today = todayInBrussels(reference)
  const [year, month] = today.split('-').map(Number)
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  const endDateExclusive = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`
  return { startDate, endDateExclusive }
}

function isCreatedAtInBrusselsMonth(
  createdAt: string,
  startDate: string,
  endDateExclusive: string,
): boolean {
  const day = new Date(createdAt).toLocaleDateString('en-CA', { timeZone: CAPACITY_TIMEZONE })
  return day >= startDate && day < endDateExclusive
}

function formatSupabaseError(error: {
  message?: string
  code?: string
  details?: string
  hint?: string
}): string {
  return (
    [error.message, error.code, error.details, error.hint].filter(Boolean).join(' — ') ||
    'Erreur inconnue'
  )
}

export function getRestaurantReservationDisplayState(
  restaurant: RestaurantSponsorshipFields,
  monthlyReservationCount: number,
): RestaurantReservationDisplayState {
  if (isRestaurantSponsorshipActive(restaurant)) return 'form'
  if (monthlyReservationCount >= NON_SPONSORED_MONTHLY_RESERVATION_LIMIT) {
    return 'monthly_full'
  }
  return 'form'
}

export function isAfroliyaReservationAvailable(
  restaurant: RestaurantSponsorshipFields,
  monthlyReservationCount: number,
): boolean {
  return getRestaurantReservationDisplayState(restaurant, monthlyReservationCount) === 'form'
}

/** Réservations Afroliya du mois en cours (hors annulées / refusées). */
export async function fetchRestaurantMonthlyReservationCount(
  restaurantId: string,
): Promise<number> {
  const admin = getSupabaseAdmin()
  if (!admin) return 0

  const { startDate, endDateExclusive } = currentMonthBoundsInBrussels()

  const { data, error } = await admin
    .from('reservations')
    .select('status, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', `${startDate}T00:00:00`)
    .lt('created_at', `${endDateExclusive}T00:00:00`)

  if (error) {
    console.error(
      '[restaurant-reservation-capacity] count',
      formatSupabaseError(error),
    )
    return 0
  }

  return (data ?? []).filter((row) => {
    const status = String(row.status ?? '')
    if (!ACTIVE_RESERVATION_STATUSES.has(status)) return false
    const createdAt = String(row.created_at ?? '')
    if (!createdAt) return false
    return isCreatedAtInBrusselsMonth(createdAt, startDate, endDateExclusive)
  }).length
}
