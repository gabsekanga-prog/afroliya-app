import type { RestaurantStatsPeriodDays } from '@/lib/restaurant-relations-admin'

export function buildAdminStatsHref({
  statsDays = 7,
  restaurantId,
  q,
}: {
  statsDays?: RestaurantStatsPeriodDays
  restaurantId?: string | null
  q?: string
}): string {
  const params = new URLSearchParams()
  if (statsDays === 30) params.set('statsDays', '30')
  if (restaurantId) params.set('restaurantId', restaurantId)
  if (q?.trim()) params.set('q', q.trim())
  const query = params.toString()
  return `/admin/statistiques${query ? `?${query}` : ''}`
}
