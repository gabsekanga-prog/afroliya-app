'use client'

type RestaurantStatEventType = 'page_view' | 'click'

type TrackRestaurantEventInput = {
  restaurantId: string
  eventType: RestaurantStatEventType
  eventKey: string
  pagePath?: string
}

export async function trackRestaurantEvent({
  restaurantId,
  eventType,
  eventKey,
  pagePath,
}: TrackRestaurantEventInput) {
  const payload = JSON.stringify({
    restaurant_id: restaurantId,
    event_type: eventType,
    event_key: eventKey,
    page_path: pagePath ?? window.location.pathname,
  })

  try {
    await fetch('/api/restaurant-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    })
  } catch {
    // Le tracking ne doit jamais casser l'UX.
  }
}
