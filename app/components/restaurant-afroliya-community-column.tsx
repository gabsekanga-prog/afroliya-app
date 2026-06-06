import { RestaurantAfroliyaTouch } from '@/app/components/restaurant-afroliya-touch'
import { RestaurantCommunityReactions } from '@/app/components/restaurant-community-reactions'
import type { RestaurantCommunityStats } from '@/lib/restaurant-community'
import { restaurantDetailPanelClass, siteHeading3Class } from '@/lib/site-styles'

type Props = {
  restaurantId: string
  initialStats: RestaurantCommunityStats
  afroliyaInstagramPostUrl: string
  afroliyaInstagramThumbnailUrl?: string
  restaurantCoverImageUrl?: string
}

export async function RestaurantAfroliyaCommunityColumn({
  restaurantId,
  initialStats,
  afroliyaInstagramPostUrl,
  afroliyaInstagramThumbnailUrl = '',
  restaurantCoverImageUrl = '',
}: Props) {
  const showNotreVisite = Boolean(afroliyaInstagramPostUrl.trim())

  return (
    <div className="min-w-0">
      <h3 className={siteHeading3Class}>La touche Afroliya</h3>

      <div className={`mt-6 ${restaurantDetailPanelClass}`} id="communaute-reactions">
        {showNotreVisite ? (
          <RestaurantAfroliyaTouch
            postUrl={afroliyaInstagramPostUrl}
            restaurantId={restaurantId}
            manualThumbnailUrl={afroliyaInstagramThumbnailUrl}
            fallbackCoverUrl={restaurantCoverImageUrl}
            embedded
          />
        ) : null}

        <div
          className={
            showNotreVisite ? 'mt-8 border-t border-neutral-200 pt-8' : undefined
          }
        >
          <RestaurantCommunityReactions
            restaurantId={restaurantId}
            initialStats={initialStats}
          />
        </div>
      </div>
    </div>
  )
}
