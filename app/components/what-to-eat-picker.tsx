'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, UtensilsCrossed } from 'lucide-react'

import { FormSelect } from '@/app/components/form-fields'
import { RestaurantCard } from '@/app/components/restaurant-card'
import {
  filterRestaurants,
  pickRandomRestaurantPreferringSponsored,
  type Restaurant,
  type RestaurantFilterOptions,
} from '@/lib/restaurants'
import {
  siteBodyClass,
  siteButtonPrimaryClass,
  siteGuideIntroSectionClass,
  siteHeading1OnDarkClass,
  siteHeading2Class,
  siteSectionBgWhiteClass,
  siteSectionInnerClass,
  siteSectionMutedClass,
  siteSectionTwoColumnGridClass,
  siteSubtitleLeadOnDarkClass,
} from '@/lib/site-styles'

type Props = {
  restaurants: Restaurant[]
  filterOptions: RestaurantFilterOptions
  /** Titre principal de page (h1) au lieu d’un h2 de section. */
  pageTitle?: boolean
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null
  return items[Math.floor(Math.random() * items.length)] ?? null
}

export function WhatToEatPicker({
  restaurants,
  filterOptions,
  pageTitle = false,
}: Props) {
  const [lieu, setLieu] = useState('')
  const [cuisineKey, setCuisineKey] = useState('')
  const [picked, setPicked] = useState<Restaurant | null>(null)
  const [fallbackNotice, setFallbackNotice] = useState('')
  const [emptyMessage, setEmptyMessage] = useState('')

  function handlePick() {
    const matches = filterRestaurants(restaurants, {
      query: '',
      cuisineKey,
      lieu,
    })

    if (matches.length > 0) {
      setFallbackNotice('')
      setEmptyMessage('')
      setPicked(pickRandom(matches))
      return
    }

    if (!cuisineKey) {
      setPicked(null)
      setFallbackNotice('')
      setEmptyMessage(
        'Aucun restaurant ne correspond à ces critères. Choisissez une envie culinaire ou une autre commune.',
      )
      return
    }

    const cuisineMatches = filterRestaurants(restaurants, {
      query: '',
      cuisineKey,
      lieu: '',
    })

    if (cuisineMatches.length === 0) {
      setPicked(null)
      setFallbackNotice('')
      setEmptyMessage(
        'Aucun restaurant ne correspond à cette envie culinaire pour le moment.',
      )
      return
    }

    setEmptyMessage('')
    setFallbackNotice(
      lieu
        ? 'Aucun restaurant dans cette commune pour cette envie. Voici une adresse ailleurs à Bruxelles :'
        : 'Voici une adresse pour votre envie culinaire :',
    )
    setPicked(pickRandomRestaurantPreferringSponsored(cuisineMatches))
  }

  const pickerFormFields = (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-base font-semibold text-neutral-900">
            Quelle commune ?
          </span>
          <FormSelect
            value={lieu}
            onChange={(e) => {
              setLieu(e.target.value)
              setPicked(null)
              setFallbackNotice('')
              setEmptyMessage('')
            }}
            aria-label="Commune"
          >
            <option value="">Toutes les communes</option>
            {filterOptions.lieux.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </FormSelect>
        </label>

        <label className="block">
          <span className="mb-2 block text-base font-semibold text-neutral-900">
            Quelle envie ?
          </span>
          <FormSelect
            value={cuisineKey}
            onChange={(e) => {
              setCuisineKey(e.target.value)
              setPicked(null)
              setFallbackNotice('')
              setEmptyMessage('')
            }}
            aria-label="Type de cuisine"
          >
            <option value="">Toutes les envies</option>
            {filterOptions.cuisines.map((cuisine) => (
              <option key={cuisine.key} value={cuisine.key}>
                {cuisine.label}
              </option>
            ))}
          </FormSelect>
        </label>
      </div>

      <button
        type="button"
        onClick={handlePick}
        className={`mt-6 ${siteButtonPrimaryClass}`}
      >
        On mange quoi ?
      </button>

      {emptyMessage ? (
        <p className="mt-6 text-base text-neutral-700" role="status">
          {emptyMessage}{' '}
          <Link href="/restaurants" className="font-semibold text-[#8D5524] hover:underline">
            Voir tous les restaurants
          </Link>
        </p>
      ) : null}
    </>
  )

  const pickerResult = (
    <>
      {fallbackNotice ? (
        <p className="text-base text-neutral-700" role="status">
          {fallbackNotice}
        </p>
      ) : null}

      {picked ? (
        <div className={`max-w-sm ${fallbackNotice ? 'mt-4' : ''}`}>
          <p className="mb-4 text-lg font-semibold text-neutral-900">
            Notre suggestion pour vous :
          </p>
          <RestaurantCard restaurant={picked} />
          <Link href="/restaurants" className={`mt-4 inline-flex ${siteButtonPrimaryClass}`}>
            Voir tous les restaurants
          </Link>
        </div>
      ) : null}
    </>
  )

  const pickerFormStacked = (
    <>
      {pickerFormFields}
      {picked || fallbackNotice ? <div className="mt-8">{pickerResult}</div> : null}
    </>
  )

  if (pageTitle) {
    return (
      <>
        <section className={siteGuideIntroSectionClass}>
          <div className={siteSectionInnerClass}>
            <div className="flex flex-col items-start text-left">
              <UtensilsCrossed
                className="h-16 w-16 text-[#f8e9dc] sm:h-20 sm:w-20"
                strokeWidth={1.5}
                aria-hidden
              />
              <h1 className={`mt-4 ${siteHeading1OnDarkClass}`}>On mange quoi ?</h1>
              <p className={siteSubtitleLeadOnDarkClass}>
                Obtenez une suggestion express selon votre commune et votre envie.
              </p>
            </div>
          </div>
        </section>

        <section
          className={`w-full ${siteSectionBgWhiteClass} pb-12 pt-6 sm:pb-16 sm:pt-8`}
        >
          <div className={`${siteSectionInnerClass} text-left`}>
            <div className={`${siteSectionTwoColumnGridClass} lg:items-start`}>
              <div className="min-w-0">{pickerFormFields}</div>
              <div className="min-w-0 lg:pt-0">{pickerResult}</div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <section className={siteSectionMutedClass}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex items-start gap-3">
          <Sparkles
            className="mt-1 h-7 w-7 shrink-0 text-[#8D5524]"
            strokeWidth={1.5}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <h2 className={siteHeading2Class}>On mange quoi ?</h2>
            <p className={`mt-3 ${siteBodyClass}`}>
            Votre suggestion express de resto selon votre commune et votre envie.
            </p>
          </div>
        </div>

        <div className="mt-8">{pickerFormStacked}</div>
      </div>
    </section>
  )
}
