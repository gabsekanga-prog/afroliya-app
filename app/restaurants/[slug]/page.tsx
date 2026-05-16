import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/app/components/site-footer'
import { fetchPublishedRestaurantSlugs, fetchRestaurantBySlug } from '@/lib/restaurants'

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

      <section className="w-full bg-[#2a1810] pb-0">
        <div className="relative overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.nom}
            className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/35" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6 sm:py-10">
              <nav
                aria-label="Fil d'Ariane"
                className="flex flex-wrap items-center gap-x-2 text-lg text-[#f8e9dc]"
              >
                <Link href="/restaurants" className="hover:text-white hover:underline">
                  Trouver un restaurant
                </Link>
                <span aria-hidden className="text-white/50">
                  /
                </span>
                <span className="text-white/90" aria-current="page">
                  {restaurant.nom}
                </span>
              </nav>
              <span className="mt-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-lg font-normal">
                ★ {restaurant.note}
              </span>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
                {restaurant.nom}
              </h1>
              <p className="mt-3 text-lg text-[#f8e9dc]">
                {restaurant.cuisine} — {restaurant.ville}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-stone-100 py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
              À propos de ce restaurant
            </h2>
            <p className="mt-4 text-neutral-600">{restaurant.description}</p>

            <div className="mt-8">
              <button className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]">
                Réserver une table
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
