import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { CollapsibleText } from '@/app/components/collapsible-text'
import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { RestaurantCard } from '@/app/components/restaurant-card'
import { RestaurantCuisineLocation } from '@/app/components/restaurant-cuisine-location'
import { RestaurantMenuGallery } from '@/app/components/restaurant-menu-gallery'
import { RestaurantInfoAccordion } from '@/app/components/restaurant-info-accordion'
import { RestaurantLocation } from '@/app/components/restaurant-location'
import { RestaurantOpeningHours } from '@/app/components/restaurant-opening-hours'
import { RestaurantAfroliyaTouch } from '@/app/components/restaurant-afroliya-touch'
import { RestaurantPhotoGallery } from '@/app/components/restaurant-photo-gallery'
import { RestaurantPageStatsTracker } from '@/app/components/restaurant-page-stats-tracker'
import { RestaurantReviewsSection } from '@/app/components/restaurant-reviews-section'
import { RestaurantReservationLink } from '@/app/components/restaurant-reservation-link'
import { RestaurantReservationContent } from '@/app/components/restaurant-reservation-content'
import {
  RestaurantQuickActions,
  type QuickActionItem,
} from '@/app/components/restaurant-quick-actions'
import { ExperienceBreadcrumb } from '@/app/components/experience-breadcrumb'
import { MarketingSplitHero } from '@/app/components/marketing-split-hero'
import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import {
  fetchPublishedRestaurantSlugs,
  fetchRandomSponsoredRestaurants,
  fetchRestaurantBySlug,
  fetchRestaurantFeatures,
  fetchRestaurantMenuPages,
  fetchRestaurantOpeningHours,
} from '@/lib/restaurants'
import { buildRestaurantPageMetadata } from '@/lib/site-metadata'
import { fetchRestaurantCommunityStats } from '@/lib/restaurant-community'
import { fetchRestaurantMonthlyReservationCount } from '@/lib/restaurant-reservation-capacity'
import { getRestaurantReservationCta } from '@/lib/restaurant-reservation-cta'
import {
  detailPageSectionInnerClass,
  restaurantContentSectionClass,
  restaurantDetailChipClass,
  siteBodyClass,
  siteBodySemiboldClass,
  siteButtonPrimaryClass,
  siteHeading2Class,
  siteHeading3Class,
} from '@/lib/site-styles'

type Params = {
  slug: string
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await fetchPublishedRestaurantSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const restaurant = await fetchRestaurantBySlug(slug)
  if (!restaurant) {
    return { title: 'Restaurant introuvable' }
  }
  return buildRestaurantPageMetadata(restaurant)
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const restaurant = await fetchRestaurantBySlug(slug)

  if (!restaurant) {
    notFound()
  }

  if (slug !== restaurant.slug) {
    redirect(`/restaurants/${restaurant.slug}`)
  }

  const menuPages = await fetchRestaurantMenuPages(restaurant.id)
  const hasMenuPhotos = menuPages.length > 0
  const hasMenuContent = hasMenuPhotos
  const features = await fetchRestaurantFeatures(restaurant.id)
  const openingHours = await fetchRestaurantOpeningHours(restaurant.id)
  const communityStats = await fetchRestaurantCommunityStats(restaurant.id)
  const monthlyReservationCount = await fetchRestaurantMonthlyReservationCount(restaurant.id)
  const sponsoredSuggestions = await fetchRandomSponsoredRestaurants(restaurant.id, 3)

  const coverImage = restaurant.image
  const otherImages = restaurant.images.slice(1)
  const galleryImages = [...otherImages, coverImage]
  const coverGalleryIndex = galleryImages.length - 1
  const showPhotoGallery = otherImages.length > 0
  const hasAfroliyaContent = Boolean(restaurant.afroliyaInstagramPostUrl.trim())
  const showPhotosSection = showPhotoGallery || hasAfroliyaContent
  const heroNote =
    restaurant.note.trim() && restaurant.note !== '—' ? restaurant.note : ''
  const heroTarif = restaurant.tarif.trim()
  const heroGoogleReviewCount =
    restaurant.googleReviewCount != null && restaurant.googleReviewCount > 0
      ? restaurant.googleReviewCount
      : null
  const reservationCta = getRestaurantReservationCta()
  const quickActions: QuickActionItem[] = [
    ...(showPhotosSection
      ? [{ id: 'photos', label: 'Photos', href: '#photos' }]
      : []),
    { id: 'carte', label: 'La carte', href: '#carte' },
    { id: 'apropos', label: 'À propos', href: '#a-propos' },
    { id: 'localisation', label: 'Localisation', href: '#localisation' },
    { id: 'horaires', label: 'Horaires', href: '#horaires' },
    { id: 'avis', label: 'Avis et retours', href: '#avis' },
    { id: 'contact', label: 'Contact', href: '#contact' },
    {
      id: 'reserver',
      label: reservationCta.label,
      href: reservationCta.href,
    },
  ]

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />
      <RestaurantPageStatsTracker
        restaurantId={restaurant.id}
        pagePath={`/restaurants/${restaurant.slug}`}
      />

      <MarketingSplitHero
        imageSrc={restaurant.image}
        imageAlt={`Photo de couverture — ${restaurant.nom}`}
        title={restaurant.nom}
        imagePriority
        breadcrumb={
          <ExperienceBreadcrumb
            parent={{ label: 'Restaurants', href: '/restaurants' }}
            currentLabel={restaurant.nom}
          />
        }
        intro={
          <div className="mt-5 space-y-3 sm:mt-6">
            <RestaurantCuisineLocation
              restaurant={restaurant}
              className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-neutral-800 ${siteBodySemiboldClass}`}
            />
            {heroNote || heroTarif ? (
              <ul className="list-disc space-y-1 pl-5 text-lg text-neutral-600">
                {heroNote ? (
                  <li>
                    {heroNote}
                    {heroGoogleReviewCount != null
                      ? ` (+${heroGoogleReviewCount} avis Google)`
                      : ''}
                  </li>
                ) : null}
                {heroTarif ? <li>{heroTarif}</li> : null}
              </ul>
            ) : null}
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <RestaurantReservationLink
            className={`${siteButtonPrimaryClass} h-12`}
            trackingRestaurantId={restaurant.id}
          />
          <RestaurantQuickActions actions={quickActions} trackingRestaurantId={restaurant.id} />
        </div>
      </MarketingSplitHero>

      {showPhotosSection ? (
        <section
          id="photos"
          className={restaurantContentSectionClass}
          aria-labelledby="restaurant-photos-heading"
        >
          <div className={detailPageSectionInnerClass}>
            <h2
              id="restaurant-photos-heading"
              className={siteHeading2Class}
            >
              Photos et vidéos
            </h2>
            {showPhotoGallery ? (
              <>
                <p className={`mt-2 ${siteBodyClass}`}>
                  {galleryImages.length === 1
                    ? '1 photo'
                    : `${galleryImages.length} photos — Défilez pour voir plus. Cliquez pour agrandir.`}
                </p>
                <div className="mt-6">
                  <RestaurantPhotoGallery
                    images={galleryImages}
                    alt={restaurant.nom}
                    coverIndex={coverGalleryIndex}
                    trackingRestaurantId={restaurant.id}
                  />
                </div>
              </>
            ) : null}
            {hasAfroliyaContent ? (
              <div className={showPhotoGallery ? 'mt-10' : 'mt-6'}>
                <RestaurantAfroliyaTouch
                  postUrl={restaurant.afroliyaInstagramPostUrl}
                  restaurantId={restaurant.id}
                  manualThumbnailUrl={restaurant.afroliyaInstagramThumbnailUrl}
                  fallbackCoverUrl={restaurant.image}
                />
              </div>
            ) : null}
            <div className="mt-8">
              <RestaurantReservationLink
                className={siteButtonPrimaryClass}
                trackingRestaurantId={restaurant.id}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="carte"
        className={restaurantContentSectionClass}
        aria-labelledby="restaurant-carte-heading"
      >
        <div className={detailPageSectionInnerClass}>
          <h2
            id="restaurant-carte-heading"
            className={siteHeading2Class}
          >
            La carte
          </h2>
          {hasMenuContent ? (
            <>
              <p className={`mt-3 flex items-start gap-2 ${siteBodyClass}`}>
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-600/75"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>
                Purement indicatif. Plats et prix susceptibles de changer.
                </span>
              </p>
              {hasMenuPhotos ? (
                <div className="mt-8">
                  <RestaurantMenuGallery
                    pages={menuPages}
                    alt={restaurant.nom}
                    trackingRestaurantId={restaurant.id}
                  />
                </div>
              ) : null}
              <div className="mt-8">
                <RestaurantReservationLink
                  className={siteButtonPrimaryClass}
                  trackingRestaurantId={restaurant.id}
                />
              </div>
            </>
          ) : (
            <>
              <p className={`mt-8 ${siteBodyClass}`}>
                Le menu de ce restaurant sera bientôt disponible en ligne. En attendant, contactez
                l&apos;établissement ou réservez une table pour découvrir les plats du jour.
              </p>
              <div className="mt-8">
                <RestaurantReservationLink
                  className={siteButtonPrimaryClass}
                  trackingRestaurantId={restaurant.id}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section
        id="a-propos"
        className={restaurantContentSectionClass}
        aria-labelledby="restaurant-about-heading"
      >
        <div className={detailPageSectionInnerClass}>
          <h2
            id="restaurant-about-heading"
            className={siteHeading2Class}
          >
            À propos
          </h2>
          <CollapsibleText text={restaurant.description} className="mt-6" />
          {features.length > 0 ? (
            <div className="mt-10">
              <h3 className={siteHeading3Class}>Caractéristiques</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {features.map((feature) => (
                  <li
                    key={feature.key}
                    className={restaurantDetailChipClass}
                  >
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div id="contact" className="mt-10 scroll-mt-24">
            <h3 className={siteHeading3Class}>Autres informations</h3>
            <div className="mt-4">
              <RestaurantInfoAccordion restaurant={restaurant} />
            </div>
          </div>
        </div>
      </section>

      <section
        id="localisation"
        className={`${restaurantContentSectionClass} scroll-mt-24`}
        aria-labelledby="restaurant-localisation-heading"
      >
        <div className={detailPageSectionInnerClass}>
          <h2
            id="restaurant-localisation-heading"
            className={siteHeading2Class}
          >
            Localisation
          </h2>
          <RestaurantLocation restaurant={restaurant} />
          <div className="mt-8">
            <RestaurantReservationLink
              className={siteButtonPrimaryClass}
              trackingRestaurantId={restaurant.id}
            />
          </div>
        </div>
      </section>

      <section
        id="horaires"
        className={restaurantContentSectionClass}
        aria-labelledby="restaurant-horaires-heading"
      >
        <div className={detailPageSectionInnerClass}>
          <h2
            id="restaurant-horaires-heading"
            className={siteHeading2Class}
          >
            Horaires
          </h2>
          <p className={`mt-3 flex items-start gap-2 ${siteBodyClass}`}>
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600/75"
              strokeWidth={2}
              aria-hidden
            />
            <span>Purement indicatif. Réservez pour être sûr(e).</span>
          </p>
          {openingHours.length > 0 ? (
            <RestaurantOpeningHours days={openingHours} />
          ) : (
            <p className={`mt-8 ${siteBodyClass}`}>
              Horaires non renseignés pour le moment.
            </p>
          )}
          <div className="mt-8">
            <RestaurantReservationLink
              className={siteButtonPrimaryClass}
              trackingRestaurantId={restaurant.id}
            />
          </div>
        </div>
      </section>

      <RestaurantReviewsSection
        restaurant={restaurant}
        communityStats={communityStats}
      />

      <section
        id="reserver"
        className={`${restaurantContentSectionClass} scroll-mt-24`}
        aria-labelledby="restaurant-reserver-heading"
      >
        <div className={detailPageSectionInnerClass}>
          <h2
            id="restaurant-reserver-heading"
            className={siteHeading2Class}
          >
            {reservationCta.label}
          </h2>
          <RestaurantReservationContent
            restaurant={restaurant}
            openingHours={openingHours}
            reservationVoteCount={communityStats.reservationVoteCount}
            monthlyReservationCount={monthlyReservationCount}
          />
        </div>
      </section>

      {sponsoredSuggestions.length > 0 ? (
        <section
          className={restaurantContentSectionClass}
          aria-labelledby="restaurant-discover-heading"
        >
          <div className={detailPageSectionInnerClass}>
            <h2
              id="restaurant-discover-heading"
              className={siteHeading2Class}
            >
              D&apos;autres restaurants recommandés
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsoredSuggestions.map((item) => (
                <RestaurantCard key={item.id} restaurant={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CommunitySignupSection />

      <SiteFooter />
    </main>
  )
}
