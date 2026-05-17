import Link from 'next/link'

import { RestaurantsListClient } from '@/app/components/restaurants-list-client'
import { buildRestaurantFilterOptions, fetchPublishedRestaurants } from '@/lib/restaurants'
import { SiteFooter } from '../components/site-footer'

export const dynamic = 'force-dynamic'

export default async function ReserverUnRestaurantPage() {
  const restaurants = await fetchPublishedRestaurants()
  const filterOptions = buildRestaurantFilterOptions(restaurants)

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

      <section className="w-full bg-[#f8f1ea] py-8 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold leading-tight text-neutral-900 sm:text-4xl">
              Restaurants africains à Bruxelles et autour
            </h1>
            <p className="mt-3 text-lg text-neutral-600">
              Découvrez des adresses — Réservez 24h/24 — Réduisez les imprévus
            </p>
          </div>

          <RestaurantsListClient restaurants={restaurants} filterOptions={filterOptions} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
