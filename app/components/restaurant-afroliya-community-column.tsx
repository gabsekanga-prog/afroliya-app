import { RestaurantCommunityReactions } from '@/app/components/restaurant-community-reactions'
import type { RestaurantCommunityStats } from '@/lib/restaurant-community'
import { restaurantDetailPanelClass, siteHeading3Class } from '@/lib/site-styles'

type Props = {
  restaurantId: string
  initialStats: RestaurantCommunityStats
}

export function RestaurantAfroliyaCommunityColumn({
  restaurantId,
  initialStats,
}: Props) {
  return (
    <div className="min-w-0">
      <h3 className={siteHeading3Class}>Retours de la communauté</h3>

      <div className={`mt-6 ${restaurantDetailPanelClass}`} id="communaute-reactions">
        <RestaurantCommunityReactions
          restaurantId={restaurantId}
          initialStats={initialStats}
        />
      </div>
    </div>
  )
}
