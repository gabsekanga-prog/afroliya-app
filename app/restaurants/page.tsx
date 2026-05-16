import Link from 'next/link'

import { FormSelect, formInputClassName } from '@/app/components/form-fields'
import { fetchPublishedRestaurants } from '@/lib/restaurants'
import { SiteFooter } from '../components/site-footer'

export const dynamic = 'force-dynamic'

export default async function ReserverUnRestaurantPage() {
  const restaurants = await fetchPublishedRestaurants()
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
            <p className="mt-3 text-neutral-600 text-lg">
              Découvrez des adresses — Réservez 24h/24 — Réduisez les imprévus
            </p>
          </div>

          <div className="mt-7 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_170px]">
              <input
                type="text"
                placeholder="Rechercher par nom"
                className={formInputClassName}
              />
              <button className="rounded-xl bg-[#8D5524] px-4 py-2.5 font-normal text-white transition hover:bg-[#74431a]">
                Rechercher
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <FormSelect>
                <option>Cuisines</option>
                <option>Cuisine congolaise</option>
                <option>Cuisine sénégalaise</option>
                <option>Cuisine camerounaise</option>
                <option>Cuisine éthiopienne</option>
              </FormSelect>

              <FormSelect>
                <option>Lieux</option>
                <option>Bruxelles</option>
                <option>Ixelles</option>
                <option>Saint-Gilles</option>
                <option>Etterbeek</option>
              </FormSelect>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-stone-100 py-12 sm:pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
              Restaurants populaires
            </h2>
            <a
              href="#"
              className="text-lg font-semibold text-neutral-800 hover:text-[#8D5524] hover:underline"
            >
              Voir tous les restos
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.length === 0 ? (
              <p className="col-span-full text-lg text-neutral-600">
                Aucun restaurant publié pour le moment. Revenez bientôt.
              </p>
            ) : null}
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]"
              >
                <img
                  src={restaurant.image}
                  alt=""
                  className="h-44 w-full object-cover"
                />
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-neutral-900">{restaurant.nom}</h3>
                    <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-sm font-semibold text-neutral-800">
                      ★ {restaurant.note}
                    </span>
                  </div>
                  <p className="text-lg text-neutral-600">{restaurant.cuisine}</p>
                  <p className="text-lg text-neutral-600">{restaurant.ville}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
