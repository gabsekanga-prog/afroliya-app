import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  fetchRestaurantStatsOverviewAdmin,
  fetchRestaurantStatsSummaryAdmin,
  fetchRestaurantsForStatsPickerAdmin,
} from '@/lib/restaurant-relations-admin'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

import { AdminStatsPanel } from './admin-stats-panel'
import { AdminStatsRestaurantPicker } from './admin-stats-restaurant-picker'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function AdminStatistiquesPage({
  searchParams,
}: {
  searchParams: Promise<{ statsDays?: string; restaurantId?: string; q?: string }>
}) {
  const sp = await searchParams
  const statsDays = sp.statsDays === '30' ? 30 : 7
  const restaurantId = sp.restaurantId?.trim() ?? ''
  const searchQuery = sp.q?.trim() ?? ''

  if (restaurantId && !UUID_RE.test(restaurantId)) {
    notFound()
  }

  const [overview, restaurants, selectedRestaurant] = await Promise.all([
    fetchRestaurantStatsOverviewAdmin(statsDays),
    fetchRestaurantsForStatsPickerAdmin(),
    restaurantId
      ? fetchRestaurantStatsSummaryAdmin(restaurantId, statsDays)
      : Promise.resolve(null),
  ])

  const statsByRestaurantId = new Map(
    overview.byRestaurant.map((row) => [row.restaurantId, row]),
  )

  if (restaurantId && !selectedRestaurant) {
    notFound()
  }

  const pickerRestaurants = restaurants.map((restaurant) => {
    const counts = statsByRestaurantId.get(restaurant.id)
    return {
      ...restaurant,
      pageViews: counts?.pageViews ?? 0,
      totalClicks: counts?.totalClicks ?? 0,
    }
  })

  return (
    <div>
      <Link href="/admin" className="text-lg text-brand hover:underline">
        ← Tableau de bord
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-neutral-900">Statistiques</h1>
      <p className="mt-2 text-lg text-neutral-600">
        Vues de page et clics sur les fiches restaurants. Sélectionnez un restaurant pour le détail.
      </p>

      {!getSupabaseAdmin() ? (
        <p className="mt-8 text-lg text-neutral-600">
          Configurez la clé service Supabase pour charger les statistiques.
        </p>
      ) : (
        <div className="mt-8 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
          <AdminStatsRestaurantPicker
            restaurants={pickerRestaurants}
            selectedRestaurantId={restaurantId || null}
            initialQuery={searchQuery}
            statsDays={statsDays}
          />

          <AdminStatsPanel
            overview={overview}
            selectedRestaurant={selectedRestaurant}
            searchQuery={searchQuery}
          />
        </div>
      )}
    </div>
  )
}
