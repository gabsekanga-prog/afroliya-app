import { AlertTriangle, MapPin, Utensils } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CollapsibleText } from '@/app/components/collapsible-text'
import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { RestaurantCard } from '@/app/components/restaurant-card'
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

type Params = {
  slug: string
}

/** Padding vertical et ancrage communs à toutes les sections de contenu. */
const RESTAURANT_SECTION =
  'scroll-mt-24 w-full border-t border-neutral-200/80 py-10 sm:py-12'

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
      <header className="relative z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" aria-label="Aller a la page Concept">
            <img
              src="/logo/Afroliya-logo-mini-rectangle.png"
              alt="Afroliya"
              className="h-9 w-auto sm:h-10"
            />
          </Link>
          <nav className="hidden items-center gap-2 text-lg font-normal sm:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Concept
            </Link>
            <span className="rounded-full bg-[#f5e6d9] px-4 py-2 text-[#8D5524]">
              Trouver un restaurant
            </span>
            <Link
              href="/devenir-partenaire"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Devenir partenaire
            </Link>
            <a
              href="#liens-utiles"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Liens utiles
            </a>
          </nav>

          <details className="group relative sm:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-neutral-300 bg-white text-brand transition hover:border-[#c9a882] [&::-webkit-details-marker]:hidden">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 group-open:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="hidden h-5 w-5 group-open:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
              <Link
                href="/"
                className="block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Concept
              </Link>
              <span className="mt-1 block rounded-xl bg-[#f5e6d9] px-4 py-2 text-lg font-normal text-[#8D5524]">
                Trouver un restaurant
              </span>
              <Link
                href="/devenir-partenaire"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Devenir partenaire
              </Link>
              <a
                href="#liens-utiles"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Liens utiles
              </a>
            </div>
          </details>
        </div>
      </header>

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
          <h1 className="text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] sm:text-5xl">
            {restaurant.nom}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-lg text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)]">
            {restaurant.cuisine ? (
              <span className="inline-flex items-center gap-1.5">
                <Utensils
                  className="h-4 w-4 shrink-0 text-white/80"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {restaurant.cuisine}
              </span>
            ) : null}
            {restaurant.cuisine && restaurant.adresse ? (
              <span aria-hidden className="text-white/50">
                —
              </span>
            ) : null}
            {restaurant.adresse ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  className="h-4 w-4 shrink-0 text-white/60"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {restaurant.adresse}
              </span>
            ) : null}
          </p>
          {heroRatingLine ? (
            <p className="mt-4 text-sm text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
              {heroRatingLine}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#reserver"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#8D5524] px-6 text-lg font-normal text-white shadow-lg transition hover:bg-[#74431a]"
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
              <Link href="/restaurants" className="font-medium hover:text-white hover:underline">
                Trouver un restaurant
              </Link>
              <span aria-hidden className="text-white/60">
                /
              </span>
              <span className="font-medium text-white" aria-current="page">
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
          className={`${RESTAURANT_SECTION} bg-white`}
          aria-labelledby="restaurant-photos-heading"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2
              id="restaurant-photos-heading"
              className="text-2xl font-bold text-neutral-900 sm:text-4xl"
            >
              Photos
            </h2>
            <p className="mt-2 text-lg text-neutral-600">
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
                className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
              >
                Réserver une table
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="carte"
        className={`${RESTAURANT_SECTION} bg-stone-50`}
        aria-labelledby="restaurant-carte-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-carte-heading"
            className="text-2xl font-bold text-neutral-900 sm:text-4xl"
          >
            La carte
          </h2>
          {hasMenuContent ? (
            <>
              <p className="mt-2 flex items-start gap-2 text-lg text-neutral-600">
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
                  className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
                >
                  Réserver une table
                </a>
              </div>
            </>
          ) : (
            <p className="mt-6 text-lg text-neutral-600">
              Le menu de ce restaurant sera bientôt disponible en ligne. En attendant, contactez
              l&apos;établissement ou réservez une table pour découvrir les plats du jour.
            </p>
          )}
        </div>
      </section>

      <section
        id="a-propos"
        className={`${RESTAURANT_SECTION} bg-stone-50`}
        aria-labelledby="restaurant-about-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-about-heading"
            className="text-2xl font-bold text-neutral-900 sm:text-4xl"
          >
            À propos
          </h2>
          <CollapsibleText text={restaurant.description} className="mt-6" />
          {features.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-neutral-900 sm:text-2xl">Caractéristiques</h3>
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
        className={`${RESTAURANT_SECTION} bg-white`}
        aria-labelledby="restaurant-horaires-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-horaires-heading"
            className="text-2xl font-bold text-neutral-900 sm:text-4xl"
          >
            Horaires
          </h2>
          <p className="mt-2 flex items-start gap-2 text-lg text-neutral-600">
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
            <p className="mt-6 text-lg text-neutral-600">
              Horaires non renseignés pour le moment.
            </p>
          )}
          <div className="mt-8">
            <a
              href="#reserver"
              className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Réserver une table
            </a>
          </div>
        </div>
      </section>

      <section
        id="contact-acces"
        className={`${RESTAURANT_SECTION} bg-stone-50`}
        aria-labelledby="restaurant-contact-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-contact-heading"
            className="text-2xl font-bold text-neutral-900 sm:text-4xl"
          >
            Contact et accès
          </h2>
          <RestaurantContactAccess restaurant={restaurant} />
        </div>
      </section>

      <section
        id="reserver"
        className={`${RESTAURANT_SECTION} scroll-mt-24 bg-white`}
        aria-labelledby="restaurant-reserver-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2
            id="restaurant-reserver-heading"
            className="text-2xl font-bold text-neutral-900 sm:text-4xl"
          >
            Réserver une table
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            {restaurant.bookable
              ? 'Réservez gratuitement 24h/24 — Réduisez l\'attente et les ruptures de stock'
              : 'Contactez le restaurant pour réserver votre table.'}
          </p>
          {restaurant.sponsored ? (
            <p className="mt-4 text-lg text-neutral-600">Établissement recommandé par Afroliya.</p>
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
          className={`${RESTAURANT_SECTION} bg-stone-50`}
          aria-labelledby="restaurant-discover-heading"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2
              id="restaurant-discover-heading"
              className="text-2xl font-bold text-neutral-900 sm:text-4xl"
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
