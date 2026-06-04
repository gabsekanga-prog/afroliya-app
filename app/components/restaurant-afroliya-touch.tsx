import Link from 'next/link'

import { InstagramPostVideoCard } from '@/app/components/instagram-post-video-card'
import {
  fetchInstagramThumbnailFromOEmbed,
  resolveInstagramCardThumbnail,
} from '@/lib/instagram-thumbnail'
import { normalizeInstagramPostUrl } from '@/lib/instagram-embed'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import { siteHeading3Class } from '@/lib/site-styles'

type Props = {
  postUrl: string
  manualThumbnailUrl?: string
  fallbackCoverUrl?: string
  /** À l’intérieur de la boîte « Feedback de la communauté ». */
  embedded?: boolean
}

export async function RestaurantAfroliyaTouch({
  postUrl,
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
      />

      <p className="mt-4">
        <Link
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className={restaurantPageTextLinkClass}
        >
          Voir sur Instagram
        </Link>
      </p>
    </div>
  )
}
