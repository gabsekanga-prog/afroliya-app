import type { Metadata } from 'next'

import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import { WhatToEatPicker } from '@/app/components/what-to-eat-picker'
import {
  buildRestaurantFilterOptions,
  fetchPublishedRestaurants,
} from '@/lib/restaurants'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'On mange quoi ?',
  description:
    'Choisissez votre commune et votre envie culinaire : Afroliya vous propose un restaurant afro au hasard à Bruxelles.',
}

export default async function OnMangeQuoiPage() {
  const restaurants = await fetchPublishedRestaurants()
  const filterOptions = buildRestaurantFilterOptions(restaurants)

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />
      <WhatToEatPicker
        restaurants={restaurants}
        filterOptions={filterOptions}
        pageTitle
      />
      <SiteFooter />
    </main>
  )
}
