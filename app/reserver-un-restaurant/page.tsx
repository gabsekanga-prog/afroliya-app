import Link from 'next/link'
import { SiteFooter } from '../components/site-footer'
import { restaurants } from './data'

export default function ReserverUnRestaurantPage() {
  return (
    <main className="min-h-screen bg-[#f8f1ea] text-[#2f1d12]">
      <header className="relative z-50 border-b border-[#e8d6c8] bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" aria-label="Aller a la page Concept">
            <img
              src="/logo/Afroliya-logo-mini-rectangle.png"
              alt="Afroliya"
              className="h-8 w-auto sm:h-9"
            />
          </Link>
          <nav className="hidden items-center gap-2 text-lg font-normal sm:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-[#8D5524] transition hover:bg-[#f5e6d9]"
            >
              Concept
            </Link>
            <span className="rounded-full bg-[#f5e6d9] px-4 py-2 text-[#8D5524]">
              Reserver un restaurant
            </span>
            <Link
              href="/devenir-partenaire"
              className="rounded-full px-4 py-2 text-[#8D5524] transition hover:bg-[#f5e6d9]"
            >
              Devenir partenaire
            </Link>
          </nav>

          <details className="group relative sm:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-[#d9c2ae] bg-white text-[#8D5524] [&::-webkit-details-marker]:hidden">
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
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#e8d6c8] bg-white p-2 shadow-lg">
              <Link
                href="/"
                className="block rounded-xl px-4 py-2 text-lg font-normal text-[#8D5524] transition hover:bg-[#f5e6d9]"
              >
                Concept
              </Link>
              <span className="mt-1 block rounded-xl bg-[#f5e6d9] px-4 py-2 text-lg font-normal text-[#8D5524]">
                Reserver un restaurant
              </span>
              <Link
                href="/devenir-partenaire"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-[#8D5524] transition hover:bg-[#f5e6d9]"
              >
                Devenir partenaire
              </Link>
            </div>
          </details>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-12">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold leading-tight text-[#8D5524] sm:text-4xl">
            Réservez un restaurant africain à Bruxelles et autour
          </h1>
          <p className="mt-3 text-[#6d4c35]">
            Bloquez votre table 24h/24 — Évitez les imprévus — Maximisez le
            plaisir
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-[#e5cfbf] bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_170px]">
            <input
              type="text"
              placeholder="Rechercher par nom"
              className="w-full rounded-xl border border-[#dcc4b1] px-4 py-2.5 font-normal outline-none transition focus:border-[#8D5524] focus:ring-2 focus:ring-[#8D5524]/20"
            />
            <button className="rounded-xl bg-[#8D5524] px-4 py-2.5 font-normal text-white transition hover:bg-[#74431a]">
              Rechercher
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <select className="w-full appearance-none rounded-xl border border-[#dcc4b1] bg-white px-4 py-2.5 pr-14 font-normal outline-none transition focus:border-[#8D5524] focus:ring-2 focus:ring-[#8D5524]/20">
                <option>Cuisines</option>
                <option>Cuisine congolaise</option>
                <option>Cuisine sénégalaise</option>
                <option>Cuisine camerounaise</option>
                <option>Cuisine éthiopienne</option>
              </select>
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D5524]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </div>

            <div className="relative">
              <select className="w-full appearance-none rounded-xl border border-[#dcc4b1] bg-white px-4 py-2.5 pr-14 font-normal outline-none transition focus:border-[#8D5524] focus:ring-2 focus:ring-[#8D5524]/20">
                <option>Lieux</option>
                <option>Bruxelles</option>
                <option>Ixelles</option>
                <option>Saint-Gilles</option>
                <option>Etterbeek</option>
              </select>
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D5524]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#8D5524] sm:text-2xl">
            Restaurants populaires
          </h2>
          <a href="#" className="text-lg font-semibold text-[#8D5524] hover:underline">
            Voir tous les restos
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              className="overflow-hidden rounded-2xl border border-[#e5cfbf] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <img
                src={restaurant.image}
                alt={restaurant.nom}
                className="h-44 w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-[#2f1d12]">{restaurant.nom}</h3>
                  <span className="rounded-full bg-[#f5e6d9] px-2.5 py-1 text-xs font-semibold text-[#8D5524]">
                    ★ {restaurant.note}
                  </span>
                </div>
                <p className="text-lg text-[#6d4c35]">{restaurant.cuisine}</p>
                <p className="text-lg text-[#6d4c35]">{restaurant.ville}</p>
                <p className="text-lg text-[#4b3322]">{restaurant.description}</p>
                <Link
                  href={`/reserver-un-restaurant/${restaurant.slug}`}
                  className="mt-2 inline-flex w-full rounded-xl bg-[#8D5524] px-4 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
                >
                  Voir le restaurant
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
