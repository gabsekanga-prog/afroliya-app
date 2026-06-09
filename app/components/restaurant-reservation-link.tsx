'use client'

import { getRestaurantReservationCta } from '@/lib/restaurant-reservation-cta'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'

type Props = {
  className?: string
  wrapperClassName?: string
  trackingRestaurantId?: string
}

export function RestaurantReservationLink({
  className,
  wrapperClassName,
  trackingRestaurantId,
}: Props) {
  const { label, href } = getRestaurantReservationCta()
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
