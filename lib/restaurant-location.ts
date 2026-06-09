import type { Restaurant } from '@/lib/restaurants'
import { formatRestaurantLocationLine } from '@/lib/restaurants'

export function formatFullRestaurantAddress(restaurant: Restaurant): string {
  const street = restaurant.adresse.trim()
  const location = formatRestaurantLocationLine(
    restaurant.codePostal,
    restaurant.commune,
    restaurant.ville,
  )
  if (street && location) return `${street}, ${location}`
  return street || location
}

export function buildRestaurantMapEmbedSrc(
  restaurant: Pick<Restaurant, 'latitude' | 'longitude'>,
  address: string,
): string | null {
  const { latitude, longitude } = restaurant
  if (latitude != null && longitude != null) {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&hl=fr&output=embed`
  }
  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&hl=fr&output=embed`
  }
  return null
}
