'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { formatMenuDisplayText, formatMenuPrice } from '@/lib/format-menu-text'
import type { RestaurantMenuSection } from '@/lib/restaurants'

const INITIAL_SECTIONS_VISIBLE = 5

type Props = {
  sections: RestaurantMenuSection[]
}

function MenuSectionDetails({ section }: { section: RestaurantMenuSection }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-bold text-neutral-900 transition hover:bg-neutral-50 [&::-webkit-details-marker]:hidden">
        <span>{formatMenuDisplayText(section.name) ?? section.name}</span>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-neutral-500 transition group-open:rotate-180"
          strokeWidth={2}
          aria-hidden
        />
      </summary>
      <ul className="divide-y divide-neutral-200 border-t border-neutral-200 bg-neutral-50/60 px-5 py-1">
        {section.items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-1.5 py-4 first:pt-3 last:pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-900">
                {formatMenuDisplayText(item.name) ?? item.name}
              </p>
              {item.description ? (
                <p className="mt-1 text-sm font-normal leading-snug text-neutral-500">
                  {formatMenuDisplayText(item.description) ?? item.description}
                </p>
              ) : null}
            </div>
            {item.price ? (
              <p className="shrink-0 text-base font-semibold text-[#8D5524] sm:text-right">
                {formatMenuPrice(item.price) ?? item.price}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </details>
  )
}

export function RestaurantMenuAccordion({ sections }: Props) {
  const [showAllSections, setShowAllSections] = useState(false)

  const visible = sections.filter((section) => section.items.length > 0)
  if (visible.length === 0) return null

  const hasMoreSections = visible.length > INITIAL_SECTIONS_VISIBLE
  const displayedSections =
    showAllSections || !hasMoreSections
      ? visible
      : visible.slice(0, INITIAL_SECTIONS_VISIBLE)
  const hiddenSectionCount = visible.length - INITIAL_SECTIONS_VISIBLE

  return (
    <div className="mt-6">
      <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {displayedSections.map((section) => (
          <MenuSectionDetails key={section.id} section={section} />
        ))}
      </div>

      {hasMoreSections ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAllSections((value) => !value)}
            className="text-lg font-semibold text-[#8D5524] underline-offset-2 hover:underline"
            aria-expanded={showAllSections}
          >
            {showAllSections
              ? 'Voir moins de sections'
              : `Voir ${hiddenSectionCount} autre${hiddenSectionCount !== 1 ? 's' : ''} section${hiddenSectionCount !== 1 ? 's' : ''}`}
          </button>
        </div>
      ) : null}
    </div>
  )
}
