import { MapPin, Utensils } from 'lucide-react'

import type { Restaurant } from '@/lib/restaurants'
import { formatRestaurantLocationLine } from '@/lib/restaurants'

type Props = {
  restaurant: Pick<Restaurant, 'cuisine' | 'codePostal' | 'commune' | 'ville'>
  /** Cuisine puis code postal, commune et ville sur deux lignes (cartes liste). */
  layout?: 'inline' | 'stacked'
  className?: string
  cuisineIconClassName?: string
  locationIconClassName?: string
  separatorClassName?: string
}

export function RestaurantCuisineLocation({
  restaurant,
  layout = 'inline',
  className = 'flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-lg text-neutral-600',
  cuisineIconClassName = 'h-4 w-4 shrink-0 text-neutral-500',
  locationIconClassName = 'h-4 w-4 shrink-0 text-neutral-500',
  separatorClassName = 'text-neutral-400',
}: Props) {
  const location = formatRestaurantLocationLine(
    restaurant.codePostal,
    restaurant.commune,
    restaurant.ville,
  )

  if (!restaurant.cuisine && !location) return null

  if (layout === 'stacked') {
    return (
      <div className="space-y-1.5 text-lg text-neutral-600">
        {restaurant.cuisine ? (
          <p className="flex items-center gap-1.5">
            <Utensils className={cuisineIconClassName} strokeWidth={1.75} aria-hidden />
            <span>{restaurant.cuisine}</span>
          </p>
        ) : null}
        {location ? (
          <p className="flex items-center gap-1.5">
            <MapPin className={locationIconClassName} strokeWidth={1.75} aria-hidden />
            <span>{location}</span>
          </p>
        ) : null}
      </div>
    )
  }

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
