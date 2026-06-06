import Link from 'next/link'

import type {
  RestaurantStatsDetailAdmin,
  RestaurantStatsOverviewAdmin,
  RestaurantStatsSummaryAdmin,
} from '@/lib/restaurant-relations-admin'

import { buildAdminStatsHref } from './admin-stats-params'

type Props = {
  overview: RestaurantStatsOverviewAdmin
  selectedRestaurant: RestaurantStatsDetailAdmin | null
  searchQuery?: string
}

function BarsChart({
  values,
  labels,
  max,
  barClassName,
}: {
  values: number[]
  labels: string[]
  max: number
  barClassName: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex h-28 items-end gap-1">
        {values.map((value, idx) => {
          const heightPct = max > 0 ? (value / max) * 100 : 0
          return (
            <div key={`${idx}-${labels[idx]}`} className="flex min-w-0 flex-1 items-end justify-center">
              <div
                style={{ height: `${value === 0 ? 0 : heightPct}%` }}
                className={`w-full rounded-t ${barClassName}`}
              />
            </div>
          )
        })}
      </div>

      <div className="flex gap-1 text-[11px] text-neutral-500">
        {labels.map((label, idx) => (
          <div key={`${idx}-${label}`} className="flex-1 truncate text-center">
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDateTimeFr(value: string | null): string {
  if (!value) return 'Aucune donnée'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-BE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function PeriodToggle({
  stats,
  restaurantId,
  searchQuery,
}: {
  stats: RestaurantStatsSummaryAdmin
  restaurantId?: string | null
  searchQuery?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={buildAdminStatsHref({ statsDays: 7, restaurantId, q: searchQuery })}
        className={
          stats.periodDays === 7
            ? 'inline-flex rounded-xl bg-[#8D5524] px-4 py-2 text-sm font-semibold text-white'
            : 'inline-flex rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:border-[#c9a882]/60 hover:bg-stone-50'
        }
      >
        7 jours
      </Link>
      <Link
        href={buildAdminStatsHref({ statsDays: 30, restaurantId, q: searchQuery })}
        className={
          stats.periodDays === 30
            ? 'inline-flex rounded-xl bg-[#8D5524] px-4 py-2 text-sm font-semibold text-white'
            : 'inline-flex rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:border-[#c9a882]/60 hover:bg-stone-50'
        }
      >
        30 jours
      </Link>
    </div>
  )
}

function StatsSummarySection({
  stats,
  title,
  restaurantId,
  searchQuery,
  showAllClicks = false,
}: {
  stats: RestaurantStatsSummaryAdmin
  title: string
  restaurantId?: string | null
  searchQuery?: string
  showAllClicks?: boolean
}) {
  const daily = stats.daily ?? []
  const maxViews = Math.max(...daily.map((d) => d.pageViews), 1)
  const maxClicks = Math.max(...daily.map((d) => d.clicks), 1)

  const compactLabels =
    stats.periodDays === 7
      ? daily.map((d) => d.label)
      : daily.map((d, idx) => {
          const len = daily.length
          if (idx === 0 || idx === Math.floor(len / 2) || idx === len - 1) return d.label
          return ''
        })

  const viewsValues = daily.map((d) => d.pageViews)
  const clicksValues = daily.map((d) => d.clicks)
  const clickItems = showAllClicks ? stats.clicksByKey : stats.clicksByKey.slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        <PeriodToggle stats={stats} restaurantId={restaurantId} searchQuery={searchQuery} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Vues page</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.pageViews}</p>
        </article>
        <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Clics</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.totalClicks}</p>
        </article>
        <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Dernier événement</p>
          <p className="mt-1 text-sm font-semibold text-neutral-800">
            {formatDateTimeFr(stats.latestEventAt)}
          </p>
        </article>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-900">
          Évolution ({stats.periodDays} jours)
        </h3>

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Vues page</p>
            <div className="mt-2">
              <BarsChart
                values={viewsValues}
                labels={compactLabels}
                max={maxViews}
                barClassName="bg-neutral-200"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900">Clics</p>
            <div className="mt-2">
              <BarsChart
                values={clicksValues}
                labels={compactLabels}
                max={maxClicks}
                barClassName="bg-[#c9a882]/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-900">
          {showAllClicks ? 'Clics par action' : 'Top clics par action'}
        </h3>
        {clickItems.length ? (
          <ul className="mt-3 space-y-2">
            {clickItems.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-stone-50 px-3 py-2"
              >
                <span className="text-sm font-semibold text-neutral-800">{item.key}</span>
                <span className="text-sm text-neutral-600">{item.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-base text-neutral-600">
            Aucun clic enregistré sur la période.
          </p>
        )}
      </div>
    </div>
  )
}

export function AdminStatsPanel({
  overview,
  selectedRestaurant,
  searchQuery = '',
}: Props) {
  if (selectedRestaurant) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-lg text-neutral-600">
            Fiche :{' '}
            <Link
              href={`/admin/restaurants/${selectedRestaurant.restaurantId}`}
              className="font-semibold text-brand hover:underline"
            >
              {selectedRestaurant.restaurantName}
            </Link>
          </p>
        </div>

        <StatsSummarySection
          stats={selectedRestaurant}
          title={selectedRestaurant.restaurantName}
          restaurantId={selectedRestaurant.restaurantId}
          searchQuery={searchQuery}
          showAllClicks
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StatsSummarySection
        stats={overview}
        title="Tous les restaurants"
        searchQuery={searchQuery}
        showAllClicks={false}
      />

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Par restaurant</h2>
        {overview.byRestaurant.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-base">
              <thead className="border-b border-neutral-200 text-sm text-neutral-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Restaurant</th>
                  <th className="px-3 py-2 font-semibold">Vues</th>
                  <th className="px-3 py-2 font-semibold">Clics</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overview.byRestaurant.map((row) => (
                  <tr key={row.restaurantId} className="border-b border-neutral-100 last:border-0">
                    <td className="px-3 py-2 font-semibold text-neutral-900">
                      {row.restaurantName}
                    </td>
                    <td className="px-3 py-2 text-neutral-700">{row.pageViews}</td>
                    <td className="px-3 py-2 text-neutral-700">{row.totalClicks}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={buildAdminStatsHref({
                          statsDays: overview.periodDays,
                          restaurantId: row.restaurantId,
                          q: searchQuery,
                        })}
                        className="font-semibold text-brand hover:underline"
                      >
                        Voir le détail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-base text-neutral-600">
            Aucune activité enregistrée sur la période.
          </p>
        )}
      </div>
    </div>
  )
}
