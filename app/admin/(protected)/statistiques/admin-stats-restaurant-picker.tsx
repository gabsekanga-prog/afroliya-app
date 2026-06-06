'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { RestaurantStatsPickerOption } from '@/lib/restaurant-relations-admin'

import { buildAdminStatsHref } from './admin-stats-params'

type Props = {
  restaurants: RestaurantStatsPickerOption[]
  selectedRestaurantId: string | null
  initialQuery: string
  statsDays: 7 | 30
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase()
}

function matchesRestaurant(
  restaurant: RestaurantStatsPickerOption,
  query: string,
): boolean {
  if (!query) return true
  const haystack = [restaurant.name, restaurant.city, restaurant.commune ?? '']
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

export function AdminStatsRestaurantPicker({
  restaurants,
  selectedRestaurantId,
  initialQuery,
  statsDays,
}: Props) {
  const [query, setQuery] = useState(initialQuery)
  const normalizedQuery = normalizeSearch(query)

  const filtered = useMemo(
    () => restaurants.filter((restaurant) => matchesRestaurant(restaurant, normalizedQuery)),
    [restaurants, normalizedQuery],
  )

  const allHref = buildAdminStatsHref({ statsDays, q: query })

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900">Restaurant</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Recherchez et sélectionnez un restaurant pour voir ses statistiques détaillées.
      </p>

      <label className="mt-4 block">
        <span className="sr-only">Rechercher un restaurant</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nom, ville ou commune…"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 outline-none transition focus:border-[#8D5524] focus:ring-2 focus:ring-[#8D5524]/20"
        />
      </label>

      <div className="mt-3">
        <Link
          href={allHref}
          className={
            selectedRestaurantId
              ? 'inline-flex rounded-xl border border-neutral-200 bg-stone-50 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:border-[#c9a882]/60 hover:bg-white'
              : 'inline-flex rounded-xl bg-[#8D5524] px-4 py-2 text-sm font-semibold text-white'
          }
        >
          Tous les restaurants
        </Link>
      </div>

      <ul className="mt-4 max-h-72 space-y-1 overflow-y-auto rounded-xl border border-neutral-200 bg-stone-50 p-2">
        {filtered.length ? (
          filtered.map((restaurant) => {
            const isSelected = restaurant.id === selectedRestaurantId
            const location = [restaurant.city, restaurant.commune].filter(Boolean).join(' · ')
            const href = buildAdminStatsHref({
              statsDays,
              restaurantId: restaurant.id,
              q: query,
            })

            return (
              <li key={restaurant.id}>
                <Link
                  href={href}
                  className={
                    isSelected
                      ? 'flex items-center justify-between gap-3 rounded-lg bg-[#8D5524] px-3 py-2.5 text-white'
                      : 'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-neutral-900 transition hover:bg-white'
                  }
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{restaurant.name}</span>
                    {location ? (
                      <span
                        className={
                          isSelected
                            ? 'block truncate text-xs text-white/85'
                            : 'block truncate text-xs text-neutral-500'
                        }
                      >
                        {location}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={
                      isSelected
                        ? 'shrink-0 text-right text-xs font-semibold text-white/90'
                        : 'shrink-0 text-right text-xs text-neutral-600'
                    }
                  >
                    {restaurant.pageViews} vues
                    <br />
                    {restaurant.totalClicks} clics
                  </span>
                </Link>
              </li>
            )
          })
        ) : (
          <li className="px-3 py-4 text-center text-sm text-neutral-600">
            Aucun restaurant ne correspond à votre recherche.
          </li>
        )}
      </ul>
    </div>
  )
}
