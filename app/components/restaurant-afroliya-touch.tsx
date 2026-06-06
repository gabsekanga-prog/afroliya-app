import { InstagramPostVideoCard } from '@/app/components/instagram-post-video-card'
import { RestaurantTrackedNextLink } from '@/app/components/restaurant-tracked-link'
import {
  fetchInstagramThumbnailFromOEmbed,
  resolveInstagramCardThumbnail,
} from '@/lib/instagram-thumbnail'
import { normalizeInstagramPostUrl } from '@/lib/instagram-embed'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import { RESTAURANT_STATS_CLICK_LABELS } from '@/lib/restaurant-stats-events'
import { siteHeading3Class } from '@/lib/site-styles'

type Props = {
  postUrl: string
  restaurantId: string
  manualThumbnailUrl?: string
  fallbackCoverUrl?: string
  /** À l’intérieur de la boîte « Feedback de la communauté ». */
  embedded?: boolean
}

export async function RestaurantAfroliyaTouch({
  postUrl,
  restaurantId,
  manualThumbnailUrl = '',
  fallbackCoverUrl = '',
  embedded = false,
}: Props) {
  const permalink = normalizeInstagramPostUrl(postUrl)
  if (!permalink) return null

  const oEmbedThumbnail = await fetchInstagramThumbnailFromOEmbed(postUrl)
  const thumbnailUrl = resolveInstagramCardThumbnail(
    manualThumbnailUrl,
    fallbackCoverUrl,
    oEmbedThumbnail,
  )

  return (
    <div aria-labelledby="notre-visite-heading">
      <h3 id="notre-visite-heading" className={siteHeading3Class}>
        Contenu d'Afroliya
      </h3>

      <InstagramPostVideoCard
        postUrl={postUrl}
        permalink={permalink}
        thumbnailUrl={thumbnailUrl}
        compactTop={embedded}
        trackingRestaurantId={restaurantId}
      />

      <p className="mt-4">
        <RestaurantTrackedNextLink
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          restaurantId={restaurantId}
          eventKey={RESTAURANT_STATS_CLICK_LABELS.instagram}
          className={restaurantPageTextLinkClass}
        >
          Voir sur Instagram
        </RestaurantTrackedNextLink>
      </p>
    </div>
  )
}
