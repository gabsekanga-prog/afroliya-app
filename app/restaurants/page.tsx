import Link from 'next/link'
import { SiteHeader } from '@/app/components/site-header'
import { siteBodyClass, siteHeading1PageClass } from '@/lib/site-styles'

import { RestaurantsListClient } from '@/app/components/restaurants-list-client'
import { buildRestaurantFilterOptions, fetchPublishedRestaurants } from '@/lib/restaurants'
import { SiteFooter } from '../components/site-footer'

export const dynamic = 'force-dynamic'

export default async function ReserverUnRestaurantPage() {
  const restaurants = await fetchPublishedRestaurants()
  const filterOptions = buildRestaurantFilterOptions(restaurants)

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="restaurants" />

      <section className="w-full bg-[#f8f1ea] py-8 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <h1 className={siteHeading1PageClass}>
              Restaurants africains à Bruxelles et autour
            </h1>
            <p className={`mt-3 ${siteBodyClass}`}>
            Découvrez des adresses — Réservez 24h/24 — Réduisez l'attente et les ruptures de stock
            </p>
          </div>

          <RestaurantsListClient restaurants={restaurants} filterOptions={filterOptions} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
