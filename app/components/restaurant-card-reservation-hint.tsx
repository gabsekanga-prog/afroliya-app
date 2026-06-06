import { CalendarCheck, Phone } from 'lucide-react'

import type { Restaurant } from '@/lib/restaurants'
import {
  getRestaurantReservationChannelLabel,
  getRestaurantReservationMode,
} from '@/lib/restaurant-reservation-cta'

type Props = {
  restaurant: Pick<Restaurant, 'sponsored' | 'bookingUrl'>
}

export function RestaurantCardReservationHint({ restaurant }: Props) {
  const mode = getRestaurantReservationMode(restaurant)
  const label = getRestaurantReservationChannelLabel(restaurant)
  const Icon = mode === 'phone' ? Phone : CalendarCheck

  return (
    <p className="inline-flex items-center gap-1.5 text-base font-medium text-neutral-600">
      <Icon
        className="h-3.5 w-3.5 shrink-0 text-neutral-500"
        strokeWidth={1.75}
        aria-hidden
      />
      {label}
    </p>
  )
}
