import Link from 'next/link'

import { RestaurantReservationLink } from '@/app/components/restaurant-reservation-link'
import type { Restaurant } from '@/lib/restaurants'
import {
  restaurantContentSectionClass,
  siteBodyClass,
  siteBodyRelaxedClass,
  siteHeading2Class,
  siteHeading3Class,
  siteStatValueClass,
  siteButtonPrimaryClass,
} from '@/lib/site-styles'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'

type Props = {
  restaurant: Pick<
    Restaurant,
    'sponsored' | 'bookingUrl' | 'telephone' | 'note' | 'googleReviewCount' | 'googleReviewsSummary' | 'lienGoogleMaps'
  >
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
        Voir tous avis
      </Link>
    </p>
  )
}

export function RestaurantReviewsSection({ restaurant }: Props) {
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
      className={`${restaurantContentSectionClass} bg-stone-100`}
      aria-labelledby="restaurant-avis-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <h2 id="restaurant-avis-heading" className={siteHeading2Class}>
          Avis
        </h2>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className={siteHeading3Class}>Note Google</h3>
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              {hasGoogleNote ? (
                <p className={`${siteStatValueClass} text-[#8D5524]`}>★ {googleNote}</p>
              ) : (
                <p className={siteBodyClass}>Note Google non renseignée.</p>
              )}
              {hasGoogleCount ? (
                <p className={`mt-3 ${siteBodyClass}`}>
                  {formatGoogleReviewCount(googleReviewCount)}
                </p>
              ) : hasGoogleNote ? (
                <p className={`mt-3 ${siteBodyClass}`}>Nombre d&apos;avis non renseigné.</p>
              ) : null}
              {googleMapsHref ? <GoogleReviewsLink href={googleMapsHref} /> : null}
            </div>
          </div>

          <div>
            <h3 className={siteHeading3Class}>Ce qu&apos;en disent les clients</h3>
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              {hasGoogleSummary ? (
                <p className={siteBodyRelaxedClass}>{googleReviewsSummary}</p>
              ) : (
                <p className={siteBodyClass}>
                  Aucun résumé d&apos;avis disponible pour le moment.
                </p>
              )}
              {googleMapsHref ? <GoogleReviewsLink href={googleMapsHref} /> : null}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <RestaurantReservationLink restaurant={restaurant} className={siteButtonPrimaryClass} />
        </div>
      </div>
    </section>
  )
}
