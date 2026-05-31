'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  siteBodyClass,
  siteHeading1PageClass,
  siteHeading2Class,
  siteSectionBgCreamClass,
  siteSectionBgWhiteClass,
  siteSubtitleLeadClass,
} from '@/lib/site-styles'

import { ExperienceBreadcrumb } from '@/app/components/experience-breadcrumb'
import { FormSelect, formInputClassName } from '@/app/components/form-fields'
import { RestaurantCard } from '@/app/components/restaurant-card'
import {
  filterRestaurants,
  type Restaurant,
  type RestaurantFilterOptions,
} from '@/lib/restaurants'

const RESTAURANTS_PAGE_SIZE = 12

type Props = {
  restaurants: Restaurant[]
  filterOptions: RestaurantFilterOptions
  pageTitle: string
  pageLead: string
}

export function RestaurantsListClient({
  restaurants,
  filterOptions,
  pageTitle,
  pageLead,
}: Props) {
  const [query, setQuery] = useState('')
  const [cuisineKey, setCuisineKey] = useState('')
  const [lieu, setLieu] = useState('')
  const [visibleCount, setVisibleCount] = useState(RESTAURANTS_PAGE_SIZE)

  const filtered = useMemo(() => {
    const list = filterRestaurants(restaurants, { query, cuisineKey, lieu })
    const rank = new Map(restaurants.map((r, index) => [r.id, index]))
    return [...list].sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0))
  }, [restaurants, query, cuisineKey, lieu])

  useEffect(() => {
    setVisibleCount(RESTAURANTS_PAGE_SIZE)
  }, [query, cuisineKey, lieu])

  const visibleRestaurants = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const hasActiveFilters = Boolean(query.trim() || cuisineKey || lieu)

  function resetFilters() {
    setQuery('')
    setCuisineKey('')
    setLieu('')
  }

  return (
    <>
      <section className={`w-full ${siteSectionBgCreamClass} py-8 sm:py-12`}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <ExperienceBreadcrumb currentLabel="Restaurants" />
            <h1 className={siteHeading1PageClass}>{pageTitle}</h1>
            <p className={siteSubtitleLeadClass}>{pageLead}</p>
          </div>

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <form
              className="grid gap-3 md:grid-cols-[1fr_170px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="sr-only" htmlFor="restaurant-search">
                Rechercher par nom
              </label>
              <input
                id="restaurant-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par nom, cuisine, commune…"
                className={formInputClassName}
              />
              <button
                type="submit"
                className="rounded-xl bg-[#8D5524] px-4 py-2.5 font-normal text-white transition hover:bg-[#74431a]"
              >
                Rechercher
              </button>
            </form>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <FormSelect
                value={cuisineKey}
                onChange={(e) => setCuisineKey(e.target.value)}
                aria-label="Filtrer par cuisine"
              >
                <option value="">Toutes les cuisines</option>
                {filterOptions.cuisines.map((cuisine) => (
                  <option key={cuisine.key} value={cuisine.key}>
                    {cuisine.label}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                aria-label="Filtrer par lieu"
              >
                <option value="">Tous les lieux</option>
                {filterOptions.lieux.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
        </div>
      </section>

      <section className={`w-full ${siteSectionBgWhiteClass} py-12 sm:pb-20`}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className={siteHeading2Class}>
              {hasActiveFilters
                ? `${filtered.length} restaurant${filtered.length !== 1 ? 's' : ''}`
                : 'Restaurants recommandés'}
            </h2>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-lg font-semibold text-neutral-800 hover:text-[#8D5524] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.length === 0 ? (
              <p className="col-span-full text-base text-neutral-600 md:text-lg">
                Aucun restaurant publié pour le moment. Revenez bientôt.
              </p>
            ) : filtered.length === 0 ? (
              <p className="col-span-full text-base text-neutral-600 md:text-lg">
                Aucun restaurant ne correspond à votre recherche. Essayez d&apos;autres critères.
              </p>
            ) : (
              visibleRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} openInNewTab />
              ))
            )}
          </div>

          {hasMore ? (
            <div className="mt-10 flex flex-col items-center gap-2 sm:mt-12">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) => count + RESTAURANTS_PAGE_SIZE)
                }
                className="rounded-xl border border-neutral-300 bg-white px-6 py-3 text-base font-normal text-neutral-900 transition hover:border-[#c9a882] hover:bg-[#faf6f2] md:text-lg"
              >
                Charger plus
              </button>
              <p className={siteBodyClass}>
                {visibleCount} sur {filtered.length} affichés
              </p>
            </div>
          ) : filtered.length > RESTAURANTS_PAGE_SIZE ? (
            <p className={`mt-8 text-center ${siteBodyClass}`}>
              {filtered.length} restaurants affichés
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
