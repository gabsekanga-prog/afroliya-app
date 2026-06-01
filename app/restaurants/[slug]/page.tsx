import { AlertTriangle } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { CollapsibleText } from '@/app/components/collapsible-text'
import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { RestaurantCard } from '@/app/components/restaurant-card'
import { RestaurantCuisineLocation } from '@/app/components/restaurant-cuisine-location'
import { RestaurantMenuGallery } from '@/app/components/restaurant-menu-gallery'
import { RestaurantContactAccess } from '@/app/components/restaurant-contact-access'
import { RestaurantOpeningHours } from '@/app/components/restaurant-opening-hours'
import { RestaurantPhotoGallery } from '@/app/components/restaurant-photo-gallery'
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
  formatRestaurantHeroRatingLine,
} from '@/lib/restaurants'
import { fetchRestaurantCommunityStats } from '@/lib/restaurant-community'
import { getRestaurantReservationCta } from '@/lib/restaurant-reservation-cta'
import {
  detailPageSectionInnerClass,
  restaurantContentSectionClass,
  restaurantDetailChipClass,
  siteBodyClass,
  siteButtonOnDarkClass,
  siteButtonPrimaryClass,
  siteHeading2Class,
  siteHeading3Class,
  siteHeroMetaOnDarkClass,
} from '@/lib/site-styles'

type Params = {
  slug: string
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await fetchPublishedRestaurantSlugs()
  return slugs.map((slug) => ({ slug }))
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
  const sponsoredSuggestions = await fetchRandomSponsoredRestaurants(restaurant.id, 3)

  const coverImage = restaurant.image
  const otherImages = restaurant.images.slice(1)
  const galleryImages = [...otherImages, coverImage]
  const coverGalleryIndex = galleryImages.length - 1
  const showPhotoGallery = otherImages.length > 0
  const heroRatingLine = formatRestaurantHeroRatingLine(
    restaurant.note,
    restaurant.googleReviewCount,
    restaurant.tarif,
  )
  const reservationCta = getRestaurantReservationCta(restaurant)
  const quickActions: QuickActionItem[] = [
    ...(showPhotoGallery
      ? [{ id: 'photos', label: 'Photos', href: '#photos' }]
      : []),
    { id: 'carte', label: 'La carte', href: '#carte' },
    { id: 'apropos', label: 'À propos', href: '#a-propos' },
    { id: 'avis', label: 'Avis et retours', href: '#avis' },
    { id: 'horaires', label: 'Horaires', href: '#horaires' },
    { id: 'contact', label: 'Contact et accès', href: '#contact-acces' },
    {
      id: 'reserver',
      label: reservationCta.label,
      href: reservationCta.href,
    },
  ]

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />

      <MarketingSplitHero
        imageSrc={restaurant.image}
        imageAlt={`Photo de couverture — ${restaurant.nom}`}
        title={restaurant.nom}
        imagePriority
        breadcrumb={
          <ExperienceBreadcrumb
            tone="onDark"
            parent={{ label: 'Restaurants', href: '/restaurants' }}
            currentLabel={restaurant.nom}
          />
        }
        intro={
          <div className="mt-5 space-y-3 sm:mt-6">
            <RestaurantCuisineLocation
              restaurant={restaurant}
              className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-bold text-white/95 ${siteHeroMetaOnDarkClass}`}
              cuisineIconClassName="h-3.5 w-3.5 shrink-0 text-white/80"
              locationIconClassName="h-3.5 w-3.5 shrink-0 text-white/80"
              separatorClassName="text-white/60"
            />
            {heroRatingLine ? (
              <p className={`text-white/90 ${siteHeroMetaOnDarkClass}`}>
                {heroRatingLine}
              </p>
            ) : null}
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <RestaurantReservationLink
            restaurant={restaurant}
            className={`${siteButtonOnDarkClass} h-12`}
          />
          <RestaurantQuickActions actions={quickActions} tone="onDark" />
        </div>
      </MarketingSplitHero>

      {showPhotoGallery ? (
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
              Photos
            </h2>
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
              />
            </div>
            <div className="mt-8">
              <RestaurantReservationLink
                restaurant={restaurant}
                className={siteButtonPrimaryClass}
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
                  Informations purement indicatives. Plats et prix susceptibles de changer.
                </span>
              </p>
              {hasMenuPhotos ? (
                <div className="mt-8">
                  <RestaurantMenuGallery pages={menuPages} alt={restaurant.nom} />
                </div>
              ) : null}
              <div className="mt-8">
                <RestaurantReservationLink
                  restaurant={restaurant}
                  className={siteButtonPrimaryClass}
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
                  restaurant={restaurant}
                  className={siteButtonPrimaryClass}
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
          <div className="mt-8">
            <RestaurantReservationLink
              restaurant={restaurant}
              className={siteButtonPrimaryClass}
            />
          </div>
        </div>
      </section>

      <RestaurantReviewsSection
        restaurant={restaurant}
        communityStats={communityStats}
      />

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
            <span>Informations purement indicatives. Réservez pour être sûr(e).</span>
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
              restaurant={restaurant}
              className={siteButtonPrimaryClass}
            />
          </div>
        </div>
      </section>

      <section
        id="contact-acces"
        className={restaurantContentSectionClass}
        aria-labelledby="restaurant-contact-heading"
      >
        <div className={detailPageSectionInnerClass}>
          <h2
            id="restaurant-contact-heading"
            className={siteHeading2Class}
          >
            Contact et accès
          </h2>
          <RestaurantContactAccess restaurant={restaurant} />
        </div>
      </section>

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
