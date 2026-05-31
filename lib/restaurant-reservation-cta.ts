import type { Restaurant } from '@/lib/restaurants'

export type RestaurantReservationMode = 'phone' | 'partner' | 'form'

export type RestaurantReservationCta = {
  label: string
  href: '#reserver'
}

function externalHref(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function getRestaurantReservationMode(
  restaurant: Pick<Restaurant, 'sponsored' | 'bookingUrl'>,
): RestaurantReservationMode {
  if (!restaurant.sponsored) return 'phone'
  if (restaurant.bookingUrl.trim()) return 'partner'
  return 'form'
}

export function getRestaurantReservationCta(
  restaurant: Pick<Restaurant, 'sponsored' | 'bookingUrl' | 'telephone'>,
): RestaurantReservationCta {
  return {
    label: restaurant.sponsored ? 'Réserver en ligne' : 'Réserver par téléphone',
    href: '#reserver',
  }
}

export function getRestaurantPartnerBookingUrl(
  restaurant: Pick<Restaurant, 'bookingUrl'>,
): string {
  return externalHref(restaurant.bookingUrl)
}
