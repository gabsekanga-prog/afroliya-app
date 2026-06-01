import Link from 'next/link'
import { Star } from 'lucide-react'

import { RestaurantAfroliyaCommunityColumn } from '@/app/components/restaurant-afroliya-community-column'
import { RestaurantReservationLink } from '@/app/components/restaurant-reservation-link'
import type { Restaurant } from '@/lib/restaurants'
import type { RestaurantCommunityStats } from '@/lib/restaurant-community'
import {
  restaurantContentSectionClass,
  restaurantDetailPanelClass,
  detailPageSectionInnerClass,
  siteBodyClass,
  siteBodyRelaxedClass,
  siteHeading2Class,
  siteHeading3Class,
  siteSectionTwoColumnGridClass,
  siteStatValueClass,
  siteButtonPrimaryClass,
} from '@/lib/site-styles'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'

type Props = {
  restaurant: Pick<
    Restaurant,
    | 'id'
    | 'sponsored'
    | 'bookingUrl'
    | 'telephone'
    | 'note'
    | 'googleReviewCount'
    | 'googleReviewsSummary'
    | 'lienGoogleMaps'
    | 'afroliyaInstagramPostUrl'
    | 'afroliyaInstagramThumbnailUrl'
    | 'image'
  >
  communityStats: RestaurantCommunityStats
}

function externalHref(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function formatGoogleReviewCount(count: number): string {
  return count === 1 ? '1 avis sur Google' : `${count} avis sur Google`
}

function GoogleReviewsLink({ href }: { href: string }) {
  return (
    <p className="mt-6">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={restaurantPageTextLinkClass}
      >
        Voir tous les avis
      </Link>
    </p>
  )
}

export async function RestaurantReviewsSection({
  restaurant,
  communityStats,
}: Props) {
  const googleNote = restaurant.note
  const googleReviewCount = restaurant.googleReviewCount
  const googleReviewsSummary = restaurant.googleReviewsSummary
  const googleMapsLink = restaurant.lienGoogleMaps
  const hasGoogleNote = googleNote.trim() && googleNote !== '—'
  const hasGoogleCount = googleReviewCount != null && googleReviewCount > 0
  const hasGoogleSummary = googleReviewsSummary.trim().length > 0
  const googleMapsHref = externalHref(googleMapsLink)

  return (
    <section
      id="avis"
      className={restaurantContentSectionClass}
      aria-labelledby="restaurant-avis-heading"
    >
      <div className={detailPageSectionInnerClass}>
        <h2 id="restaurant-avis-heading" className={siteHeading2Class}>
          Avis et retours
        </h2>

        <div className={`mt-8 ${siteSectionTwoColumnGridClass} lg:items-start`}>
          <div className="min-w-0 max-w-lg">
            <RestaurantAfroliyaCommunityColumn
              restaurantId={restaurant.id}
              initialStats={communityStats}
              afroliyaInstagramPostUrl={restaurant.afroliyaInstagramPostUrl}
              afroliyaInstagramThumbnailUrl={restaurant.afroliyaInstagramThumbnailUrl}
              restaurantCoverImageUrl={restaurant.image}
            />
          </div>

          <div className="min-w-0">
            <h3 className={siteHeading3Class}>Avis Google</h3>

            <div className={`mt-6 ${restaurantDetailPanelClass}`}>
              {hasGoogleNote ? (
                <p
                  className={`flex flex-wrap items-center gap-2 ${siteStatValueClass} text-[#8D5524]`}
                >
                  <Star
                    className="h-8 w-8 shrink-0 fill-[#8D5524] text-[#8D5524] lg:h-9 lg:w-9"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span>
                    {googleNote}
                    <span className="text-neutral-700"> / 5</span>
                    {hasGoogleCount ? (
                      <span className={`${siteBodyClass} font-normal`}>
                        {' '}
                        ({formatGoogleReviewCount(googleReviewCount)})
                      </span>
                    ) : null}
                  </span>
                </p>
              ) : (
                <p className={siteBodyClass}>Note Google non renseignée.</p>
              )}

              {hasGoogleSummary ? (
                <p className={`mt-6 ${siteBodyRelaxedClass}`}>{googleReviewsSummary}</p>
              ) : (
                <p className={`mt-6 ${siteBodyClass}`}>
                  Aucun résumé d&apos;avis disponible pour le moment.
                </p>
              )}

              {googleMapsHref ? <GoogleReviewsLink href={googleMapsHref} /> : null}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <RestaurantReservationLink restaurant={restaurant} className={siteButtonPrimaryClass} />
        </div>
      </div>
    </section>
  )
}
