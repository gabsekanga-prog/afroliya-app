'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronDown, MapPin, Salad, Search, Utensils } from 'lucide-react'

import {
  siteBodyClass,
  siteCardOnMutedClass,
  siteHeading1OnDarkClass,
  siteHeading2Class,
  sitePageHeroSectionClass,
  restaurantsListContentInnerClass,
  restaurantsListContentSectionClass,
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

const sidebarTitleClass = 'text-lg font-semibold text-neutral-800'

const sidebarLabelClass = `flex flex-col gap-2 ${sidebarTitleClass}`

const sidebarFieldClass = `${formInputClassName} text-lg`

const inspirationLinkClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-lg font-normal text-neutral-900 shadow-sm transition hover:border-[#c9a882] hover:bg-[#faf6f2]'

const filterSelectIconClass =
  'pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-neutral-500'

const filterSelectClass = 'pl-11 text-lg'

type Props = {
  restaurants: Restaurant[]
  filterOptions: RestaurantFilterOptions
  pageTitle: string
}

export function RestaurantsListClient({
  restaurants,
  filterOptions,
  pageTitle,
}: Props) {
  const [query, setQuery] = useState('')
  const [cuisineKey, setCuisineKey] = useState('')
  const [lieu, setLieu] = useState('')
  const [visibleCount, setVisibleCount] = useState(RESTAURANTS_PAGE_SIZE)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isMobileFiltersLayout, setIsMobileFiltersLayout] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')

    function sync() {
      setIsMobileFiltersLayout(media.matches)
      if (!media.matches) {
        setFiltersOpen(false)
      }
    }

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

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
  const accordionFilterCount = Number(Boolean(cuisineKey)) + Number(Boolean(lieu))

  function resetFilters() {
    setQuery('')
    setCuisineKey('')
    setLieu('')
  }

  const filterSelects = (
    <div className="grid gap-3">
      <div className="relative">
        <Utensils className={filterSelectIconClass} strokeWidth={1.75} aria-hidden />
        <FormSelect
          className={filterSelectClass}
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
      </div>

      <div className="relative">
        <MapPin className={filterSelectIconClass} strokeWidth={1.75} aria-hidden />
        <FormSelect
          className={filterSelectClass}
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
  )

  const inspirationBlock = (
    <>
      <h3 className={sidebarTitleClass}>Besoin d&apos;inspiration ?</h3>
      <div className="mt-4 flex flex-col gap-3">
        <Link href="/guides" className={inspirationLinkClass}>
          <BookOpen className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
          Guides thématiques
        </Link>
        <Link href="/on-mange-quoi" className={inspirationLinkClass}>
          <Salad className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
          On mange quoi ?
        </Link>
      </div>
    </>
  )

  const filtersPanel = (
    <div className={`${siteCardOnMutedClass} p-5 sm:p-6`}>
      <h2 className="sr-only">Filtrer</h2>
      <label className={sidebarLabelClass}>
        Filtrer
        {filterSelects}
      </label>
      <div className="mt-6 border-t border-neutral-200 pt-6">{inspirationBlock}</div>
    </div>
  )

  const mobileFiltersPanel = (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-md shadow-neutral-900/[0.06]">
      <h2 className="sr-only">Filtrer</h2>
      <button
        type="button"
        onClick={() => setFiltersOpen((open) => !open)}
        aria-expanded={filtersOpen}
        aria-controls="restaurant-filters-panel"
        aria-label={
          accordionFilterCount > 0
            ? `Filtrer, ${accordionFilterCount} filtre${accordionFilterCount > 1 ? 's' : ''} actif${accordionFilterCount > 1 ? 's' : ''}`
            : 'Filtrer'
        }
        className={`flex w-full items-center justify-between gap-2 text-left ${
          filtersOpen ? 'px-4 py-4 sm:px-5' : 'px-4 py-2.5'
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={sidebarTitleClass}>Filtrer</span>
          {accordionFilterCount > 0 ? (
            <span
              aria-hidden
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8D5524] px-1.5 text-xs font-semibold text-white"
            >
              {accordionFilterCount}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-neutral-600 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>
      <div
        id="restaurant-filters-panel"
        className={
          filtersOpen ? 'block px-4 pb-5 pt-1 sm:px-5 sm:pb-6' : 'hidden'
        }
      >
        {filterSelects}
        <div className="mt-6 border-t border-neutral-200 pt-6">{inspirationBlock}</div>
      </div>
    </div>
  )

  return (
    <>
      <section className={sitePageHeroSectionClass}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <ExperienceBreadcrumb currentLabel="Restaurants" />
            <h1 className={siteHeading1OnDarkClass}>{pageTitle}</h1>
            <form
              className="mt-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="sr-only" htmlFor="restaurant-search">
                Rechercher
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  id="restaurant-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nom, cuisine, commune…"
                  className={`${sidebarFieldClass} min-w-0 flex-1`}
                />
                <button
                  type="submit"
                  aria-label="Rechercher"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#8D5524] px-3.5 text-white transition hover:bg-[#74431a]"
                >
                  <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className={restaurantsListContentSectionClass}>
        <div className={restaurantsListContentInnerClass}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              {isMobileFiltersLayout ? mobileFiltersPanel : filtersPanel}
            </aside>

            <div className="min-w-0">
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
                    className="text-lg font-normal text-neutral-800 underline underline-offset-2 hover:text-[#8D5524]"
                  >
                    Réinitialiser les filtres
                  </button>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {restaurants.length === 0 ? (
                  <p className={`col-span-full ${siteBodyClass}`}>
                    Aucun restaurant publié pour le moment. Revenez bientôt.
                  </p>
                ) : filtered.length === 0 ? (
                  <p className={`col-span-full ${siteBodyClass}`}>
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
                    className="rounded-xl border border-neutral-300 bg-white px-6 py-3 text-lg font-normal text-neutral-900 transition hover:border-[#c9a882] hover:bg-[#faf6f2]"
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
          </div>
        </div>
      </section>
    </>
  )
}
