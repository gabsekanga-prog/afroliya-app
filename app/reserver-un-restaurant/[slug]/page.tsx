import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/app/components/site-footer'
import { restaurants } from '../data'

type Params = {
  slug: string
}

export function generateStaticParams() {
  return restaurants.map((restaurant) => ({ slug: restaurant.slug }))
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const restaurant = restaurants.find((item) => item.slug === slug)

  if (!restaurant) {
    notFound()
  }

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
          <Link
            href="/reserver-un-restaurant"
            className="rounded-full px-4 py-2 text-lg font-normal text-[#8D5524] transition hover:bg-[#f5e6d9]"
          >
            Retour au listing
          </Link>
        </div>
      </header>

      <section className="w-full pb-8 sm:pb-20">
        <div className="relative overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.nom}
            className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/35" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6 sm:py-10">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-lg font-normal">
                ★ {restaurant.note}
              </span>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
                {restaurant.nom}
              </h1>
              <p className="mt-3 text-[#f8e9dc]">
                {restaurant.cuisine} — {restaurant.ville}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
        <div className="rounded-2xl border border-[#e8d6c8] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#8D5524] sm:text-4xl">
            À propos de ce restaurant
          </h2>
          <p className="mt-4 text-[#6d4c35]">{restaurant.description}</p>

          <div className="mt-8">
            <button className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]">
              Réserver une table
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
