'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  siteBodyClass,
  siteHeading1OnDarkClass,
  siteHeading2Class,
  sitePageHeroSectionClass,
  siteSectionBgWhiteClass,
  siteSubtitleLeadOnDarkClass,
} from '@/lib/site-styles'

import { ExperienceBreadcrumb } from '@/app/components/experience-breadcrumb'
import { FormSelect, formInputClassName } from '@/app/components/form-fields'
import { ExperienceCard } from '@/app/components/experience-card'
import {
  EXPERIENCES_LIST_PAGE_SIZE,
  filterExperiences,
  type Experience,
  type ExperienceFilterOptions,
} from '@/lib/experiences'

type Props = {
  experiences: Experience[]
  filterOptions: ExperienceFilterOptions
  pageTitle: string
  pageLead: string
  emptyMessage: string
  listHeading: string
  searchPlaceholder: string
  breadcrumbLabel: string
  resultLabel?: string
}

export function ExperiencesListClient({
  experiences,
  filterOptions,
  pageTitle,
  pageLead,
  emptyMessage,
  listHeading,
  searchPlaceholder,
  breadcrumbLabel,
  resultLabel = 'résultat',
}: Props) {
  const [query, setQuery] = useState('')
  const [typeKey, setTypeKey] = useState('')
  const [lieu, setLieu] = useState('')
  const [visibleCount, setVisibleCount] = useState(EXPERIENCES_LIST_PAGE_SIZE)

  const filtered = useMemo(() => {
    const list = filterExperiences(experiences, { query, typeKey, lieu })
    const rank = new Map(experiences.map((item, index) => [item.id, index]))
    return [...list].sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0))
  }, [experiences, query, typeKey, lieu])

  useEffect(() => {
    setVisibleCount(EXPERIENCES_LIST_PAGE_SIZE)
  }, [query, typeKey, lieu])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const hasActiveFilters = Boolean(query.trim() || typeKey || lieu)

  function resetFilters() {
    setQuery('')
    setTypeKey('')
    setLieu('')
  }

  const resultLabelPlural = `${resultLabel}${filtered.length !== 1 ? 's' : ''}`

  return (
    <>
      <section className={sitePageHeroSectionClass}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <ExperienceBreadcrumb currentLabel={breadcrumbLabel} tone="onDark" />
            <h1 className={siteHeading1OnDarkClass}>{pageTitle}</h1>
            <p className={siteSubtitleLeadOnDarkClass}>{pageLead}</p>
          </div>

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <form
              className="grid gap-3 md:grid-cols-[1fr_170px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="sr-only" htmlFor="experience-search">
                Rechercher
              </label>
              <input
                id="experience-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
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
                value={typeKey}
                onChange={(e) => setTypeKey(e.target.value)}
                aria-label="Filtrer par type"
              >
                <option value="">Tous les types</option>
                {filterOptions.types.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
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
                ? `${filtered.length} ${resultLabelPlural}`
                : listHeading}
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
            {experiences.length === 0 ? (
              <p className="col-span-full text-base text-neutral-600 md:text-lg">
                {emptyMessage}
              </p>
            ) : filtered.length === 0 ? (
              <p className="col-span-full text-base text-neutral-600 md:text-lg">
                Aucun résultat ne correspond à votre recherche. Essayez d&apos;autres
                critères.
              </p>
            ) : (
              visible.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))
            )}
          </div>

          {hasMore ? (
            <div className="mt-10 flex flex-col items-center gap-2 sm:mt-12">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) => count + EXPERIENCES_LIST_PAGE_SIZE)
                }
                className="rounded-xl border border-neutral-300 bg-white px-6 py-3 text-base font-normal text-neutral-900 transition hover:border-[#c9a882] hover:bg-[#faf6f2] md:text-lg"
              >
                Charger plus
              </button>
              <p className={siteBodyClass}>
                {visibleCount} sur {filtered.length} affichés
              </p>
            </div>
          ) : filtered.length > EXPERIENCES_LIST_PAGE_SIZE ? (
            <p className={`mt-8 text-center ${siteBodyClass}`}>
              {filtered.length} expériences affichées
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
