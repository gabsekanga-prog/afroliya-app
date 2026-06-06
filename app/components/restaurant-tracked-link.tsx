'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'

type TrackProps = {
  restaurantId: string
  eventKey: string
}

function trackClick(restaurantId: string, eventKey: string) {
  void trackRestaurantEvent({
    restaurantId,
    eventType: 'click',
    eventKey,
  })
}

export function RestaurantTrackedLink({
  restaurantId,
  eventKey,
  onClick,
  ...props
}: ComponentProps<'a'> & TrackProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackClick(restaurantId, eventKey)
        onClick?.(event)
      }}
    />
  )
}

export function RestaurantTrackedNextLink({
  restaurantId,
  eventKey,
  onClick,
  ...props
}: ComponentProps<typeof Link> & TrackProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackClick(restaurantId, eventKey)
        onClick?.(event)
      }}
    />
  )
}
