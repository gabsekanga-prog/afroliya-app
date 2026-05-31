import { getRestaurantReservationCta } from '@/lib/restaurant-reservation-cta'
import type { Restaurant } from '@/lib/restaurants'

type Props = {
  restaurant: Pick<Restaurant, 'sponsored' | 'bookingUrl' | 'telephone'>
  className?: string
  wrapperClassName?: string
}

export function RestaurantReservationLink({
  restaurant,
  className,
  wrapperClassName,
}: Props) {
  const { label, href } = getRestaurantReservationCta(restaurant)
  const link = (
    <a href={href} className={className}>
      {label}
    </a>
  )

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{link}</div>
  }

  return link
}
