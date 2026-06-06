'use client'

import { useEffect, useRef } from 'react'

import { RESTAURANT_STATS_CLICK_LABELS } from '@/lib/restaurant-stats-events'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'

type Props = {
  restaurantId: string
  pagePath: string
}

export function RestaurantPageStatsTracker({ restaurantId, pagePath }: Props) {
  const sentRef = useRef(false)

  useEffect(() => {
    if (sentRef.current) return
    sentRef.current = true

    void trackRestaurantEvent({
      restaurantId,
      eventType: 'page_view',
      eventKey: RESTAURANT_STATS_CLICK_LABELS.pageView,
      pagePath,
    })
  }, [pagePath, restaurantId])

  return null
}
