import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CollapsibleText } from '@/app/components/collapsible-text'
import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { RestaurantCard } from '@/app/components/restaurant-card'
import { RestaurantCuisineLocation } from '@/app/components/restaurant-cuisine-location'
import { RestaurantMenuAccordion } from '@/app/components/restaurant-menu-accordion'
import { RestaurantMenuGallery } from '@/app/components/restaurant-menu-gallery'
import { RestaurantContactAccess } from '@/app/components/restaurant-contact-access'
import { RestaurantOpeningHours } from '@/app/components/restaurant-opening-hours'
import { RestaurantPhotoGallery } from '@/app/components/restaurant-photo-gallery'
import {
  RestaurantQuickActions,
  type QuickActionItem,
} from '@/app/components/restaurant-quick-actions'
import { SiteFooter } from '@/app/components/site-footer'
import {
  fetchPublishedRestaurantSlugs,
  fetchRandomSponsoredRestaurants,
  fetchRestaurantBySlug,
  fetchRestaurantFeatures,
  fetchRestaurantMenuPages,
  fetchRestaurantMenuSections,
  fetchRestaurantOpeningHours,
  formatRestaurantHeroRatingLine,
} from '@/lib/restaurants'
import { restaurantPageBreadcrumbLinkClass } from '@/lib/restaurant-page-link'
import { SiteHeader } from '@/app/components/site-header'
import {
  restaurantContentSectionClass,
  siteBodyClass,
  siteButtonPrimaryClass,
  siteHeading1OnDarkClass,
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

  const menuSections = await fetchRestaurantMenuSections(restaurant.id)
  const menuPages = await fetchRestaurantMenuPages(restaurant.id)
  const hasTextMenu = menuSections.some((section) => section.items.length > 0)
  const hasMenuPhotos = menuPages.length > 0
  const hasMenuContent = hasTextMenu || hasMenuPhotos
  const features = await fetchRestaurantFeatures(restaurant.id)
  const openingHours = await fetchRestaurantOpeningHours(restaurant.id)
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
  const quickActions: QuickActionItem[] = [
    { id: 'carte', label: 'La carte', href: '#carte' },
    ...(showPhotoGallery
      ? [{ id: 'photos', label: 'Photos', href: '#photos' }]
      : []),
    { id: 'apropos', label: 'À propos', href: '#a-propos' },
    { id: 'horaires', label: 'Horaires', href: '#horaires' },
    { id: 'contact', label: 'Contact et accès', href: '#contact-acces' },
    { id: 'reserver', label: 'Réserver une table', href: '#reserver' },
  ]

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="restaurants" />

      <section className="relative w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={`Photo de couverture — ${restaurant.nom}`}
          className="h-[min(70vh,720px)] w-full object-cover"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[min(55%,420px)] bg-gradient-to-t from-black/75 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-20 sm:px-6 sm:pb-12">
          <h1 className={siteHeading1OnDarkClass}>
            {restaurant.nom}
          </h1>
          <RestaurantCuisineLocation
            restaurant={restaurant}
            className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 ${siteHeroMetaOnDarkClass}`}
            cuisineIconClassName="h-4 w-4 shrink-0 text-white/80"
            locationIconClassName="h-4 w-4 shrink-0 text-white/60"
            separatorClassName="text-white/50"
          />
          {heroRatingLine ? (
            <p className="mt-4 text-sm text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
              {heroRatingLine}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#reserver"
              className={`${siteButtonPrimaryClass} h-12 shadow-lg`}
            >
              Réserver une table
            </a>
            <RestaurantQuickActions actions={quickActions} />
          </div>
          <div className="mt-8 border-t border-white/55 pt-5 sm:mt-10">
            <nav
              aria-label="Fil d'Ariane"
              className="flex flex-wrap items-center gap-x-2 text-sm text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]"
            >
              <Link href="/restaurants" className={restaurantPageBreadcrumbLinkClass}>
                Trouver un restaurant
              </Link>
              <span aria-hidden className="text-white/60">
                /
              </span>
              <span className="text-sm font-medium text-white" aria-current="page">
                {restaurant.nom}
              </span>
            </nav>
          </div>
          </div>
        </div>
      </section>

      {showPhotoGallery ? (
        <section
          id="photos"
          className={`${restaurantContentSectionClass} bg-white`}
          aria-labelledby="restaurant-photos-heading"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
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
              <a
                href="#reserver"
                className={siteButtonPrimaryClass}
              >
                Réserver une table
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="carte"
        className={`${restaurantContentSectionClass} bg-stone-50`}
        aria-labelledby="restaurant-carte-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-carte-heading"
            className={siteHeading2Class}
          >
            La carte
          </h2>
          {hasMenuContent ? (
            <>
              <p className={`mt-2 flex items-start gap-2 ${siteBodyClass}`}>
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
                <div className="mt-6">
                  <RestaurantMenuGallery pages={menuPages} alt={restaurant.nom} />
                </div>
              ) : null}
              {hasTextMenu ? (
                <div className={hasMenuPhotos ? 'mt-10' : 'mt-6'}>
                  <RestaurantMenuAccordion sections={menuSections} />
                </div>
              ) : null}
              <div className="mt-8">
                <a
                  href="#reserver"
                  className={siteButtonPrimaryClass}
                >
                  Réserver une table
                </a>
              </div>
            </>
          ) : (
            <p className={`mt-6 ${siteBodyClass}`}>
              Le menu de ce restaurant sera bientôt disponible en ligne. En attendant, contactez
              l&apos;établissement ou réservez une table pour découvrir les plats du jour.
            </p>
          )}
        </div>
      </section>

      <section
        id="a-propos"
        className={`${restaurantContentSectionClass} bg-stone-50`}
        aria-labelledby="restaurant-about-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
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
                    className="rounded-md border border-neutral-200 bg-white px-3 py-1 text-base text-neutral-700"
                  >
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section
        id="horaires"
        className={`${restaurantContentSectionClass} bg-white`}
        aria-labelledby="restaurant-horaires-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-horaires-heading"
            className={siteHeading2Class}
          >
            Horaires
          </h2>
          <p className={`mt-2 flex items-start gap-2 ${siteBodyClass}`}>
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
            <p className={`mt-6 ${siteBodyClass}`}>
              Horaires non renseignés pour le moment.
            </p>
          )}
          <div className="mt-8">
            <a
              href="#reserver"
              className={siteButtonPrimaryClass}
            >
              Réserver une table
            </a>
          </div>
        </div>
      </section>

      <section
        id="contact-acces"
        className={`${restaurantContentSectionClass} bg-stone-50`}
        aria-labelledby="restaurant-contact-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
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
        className={`${restaurantContentSectionClass} scroll-mt-24 bg-white`}
        aria-labelledby="restaurant-reserver-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-reserver-heading"
            className={siteHeading2Class}
          >
            Réserver une table
          </h2>
          <p className={`mt-2 ${siteBodyClass}`}>
            {restaurant.bookable
              ? 'Réservez gratuitement 24h/24 — Réduisez l\'attente et les ruptures de stock'
              : 'Contactez le restaurant pour réserver votre table.'}
          </p>
          {restaurant.sponsored ? (
            <p className={`mt-4 ${siteBodyClass}`}>Établissement recommandé par Afroliya.</p>
          ) : null}
          <div
            className="mt-8 min-h-[12rem] rounded-xl border border-dashed border-neutral-300 bg-neutral-50/80"
            aria-label="Widget de réservation à venir"
          />
        </div>
      </section>

      <CommunitySignupSection />

      {sponsoredSuggestions.length > 0 ? (
        <section
          className={`${restaurantContentSectionClass} bg-stone-50`}
          aria-labelledby="restaurant-discover-heading"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2
              id="restaurant-discover-heading"
              className={siteHeading2Class}
            >
              D&apos;autres restaurants à découvrir
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsoredSuggestions.map((item) => (
                <RestaurantCard key={item.id} restaurant={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  )
}
