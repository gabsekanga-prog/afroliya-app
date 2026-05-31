import { MapPin, Utensils } from 'lucide-react'

import type { Restaurant } from '@/lib/restaurants'
import { formatRestaurantLocationLine } from '@/lib/restaurants'

type Props = {
  restaurant: Pick<Restaurant, 'cuisine' | 'codePostal' | 'commune' | 'ville'>
  className?: string
  cuisineIconClassName?: string
  locationIconClassName?: string
  separatorClassName?: string
}

export function RestaurantCuisineLocation({
  restaurant,
  className = 'flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-base text-neutral-600',
  cuisineIconClassName = 'h-3.5 w-3.5 shrink-0 text-neutral-500',
  locationIconClassName = 'h-3.5 w-3.5 shrink-0 text-neutral-500',
  separatorClassName = 'text-neutral-400',
}: Props) {
  const location = formatRestaurantLocationLine(
    restaurant.codePostal,
    restaurant.commune,
    restaurant.ville,
  )

  if (!restaurant.cuisine && !location) return null

  return (
    <p className={className}>
      {restaurant.cuisine ? (
        <span className="inline-flex items-center gap-1">
          <Utensils className={cuisineIconClassName} strokeWidth={1.75} aria-hidden />
          {restaurant.cuisine}
        </span>
      ) : null}
      {restaurant.cuisine && location ? (
        <span aria-hidden className={separatorClassName}>
          —
        </span>
      ) : null}
      {location ? (
        <span className="inline-flex items-center gap-1">
          <MapPin className={locationIconClassName} strokeWidth={1.75} aria-hidden />
          {location}
        </span>
      ) : null}
    </p>
  )
}
