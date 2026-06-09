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

type Props = {
  restaurant: Pick<
    Restaurant,
    | 'id'
    | 'sponsored'
    | 'bookingUrl'
    | 'telephone'
    | 'sponsorshipStartDate'
    | 'sponsorshipEndDate'
    | 'note'
    | 'googleReviewCount'
    | 'googleReviewsSummary'
  >
  communityStats: RestaurantCommunityStats
}

function formatGoogleReviewCount(count: number): string {
  return count === 1 ? '1 avis sur Google' : `${count} avis sur Google`
}

export async function RestaurantReviewsSection({
  restaurant,
  communityStats,
}: Props) {
  const googleNote = restaurant.note
  const googleReviewCount = restaurant.googleReviewCount
  const googleReviewsSummary = restaurant.googleReviewsSummary
  const hasGoogleNote = googleNote.trim() && googleNote !== '—'
  const hasGoogleCount = googleReviewCount != null && googleReviewCount > 0
  const hasGoogleSummary = googleReviewsSummary.trim().length > 0

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
            </div>
          </div>
        </div>

        <div className="mt-10">
          <RestaurantReservationLink
            trackingRestaurantId={restaurant.id}
            className={siteButtonPrimaryClass}
          />
        </div>
      </div>
    </section>
  )
}
