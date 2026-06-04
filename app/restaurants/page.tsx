import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { SiteHeader } from '@/app/components/site-header'
import { RestaurantsListClient } from '@/app/components/restaurants-list-client'
import { buildRestaurantFilterOptions, fetchPublishedRestaurants } from '@/lib/restaurants'
import { SiteFooter } from '../components/site-footer'

export const dynamic = 'force-dynamic'

export const revalidate = 120

export default async function ReserverUnRestaurantPage() {
  const restaurants = await fetchPublishedRestaurants()
  const filterOptions = buildRestaurantFilterOptions(restaurants)

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="restaurants" />

      <RestaurantsListClient
        restaurants={restaurants}
        filterOptions={filterOptions}
        pageTitle="Restaurants afro à Bruxelles et autour"
        pageLead=""
      />

      <CommunitySignupSection />

      <SiteFooter />
    </main>
  )
}
