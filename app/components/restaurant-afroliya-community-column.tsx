import { RestaurantAfroliyaTouch } from '@/app/components/restaurant-afroliya-touch'
import { RestaurantCommunityReactions } from '@/app/components/restaurant-community-reactions'
import type { RestaurantCommunityStats } from '@/lib/restaurant-community'
import { siteHeading3Class } from '@/lib/site-styles'

const communityBoxClass =
  'rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-md shadow-neutral-900/[0.06] sm:p-8'

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

      <div className={`mt-6 ${communityBoxClass}`} id="communaute-reactions">
        {showNotreVisite ? (
          <RestaurantAfroliyaTouch
            postUrl={afroliyaInstagramPostUrl}
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
