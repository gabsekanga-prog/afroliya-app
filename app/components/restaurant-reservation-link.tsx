'use client'

import { getRestaurantReservationCta } from '@/lib/restaurant-reservation-cta'
import type { Restaurant } from '@/lib/restaurants'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'

type Props = {
  restaurant: Pick<Restaurant, 'sponsored' | 'bookingUrl' | 'telephone'>
  className?: string
  wrapperClassName?: string
  trackingRestaurantId?: string
}

export function RestaurantReservationLink({
  restaurant,
  className,
  wrapperClassName,
  trackingRestaurantId,
}: Props) {
  const { label, href } = getRestaurantReservationCta(restaurant)
  const link = (
    <a
      href={href}
      className={className}
      onClick={() => {
        if (!trackingRestaurantId) return
        void trackRestaurantEvent({
          restaurantId: trackingRestaurantId,
          eventType: 'click',
          eventKey: label,
        })
      }}
    >
      {label}
    </a>
  )

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{link}</div>
  }

  return link
}
