export type RestaurantSponsorshipFields = {
  sponsored: boolean
  sponsorshipStartDate?: string | null
  sponsorshipEndDate?: string | null
}

const SPONSORSHIP_TIMEZONE = 'Europe/Brussels'

/** Date du jour (YYYY-MM-DD) en fuseau Europe/Brussels. */
export function todayInBrussels(reference = new Date()): string {
  return reference.toLocaleDateString('en-CA', { timeZone: SPONSORSHIP_TIMEZONE })
}

/** Sponsorisation effective : case cochée et date du jour dans la période renseignée. */
export function isRestaurantSponsorshipActive(
  restaurant: RestaurantSponsorshipFields,
  referenceDate?: string,
): boolean {
  if (!restaurant.sponsored) return false

  const today = referenceDate ?? todayInBrussels()

  const start = (restaurant.sponsorshipStartDate ?? '').trim()
  if (start && today < start) return false

  const end = (restaurant.sponsorshipEndDate ?? '').trim()
  if (end && today > end) return false

  return true
}
