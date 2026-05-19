'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { formatMenuDisplayText, formatMenuPrice } from '@/lib/format-menu-text'
import type { RestaurantMenuSection } from '@/lib/restaurants'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'

const INITIAL_SECTIONS_VISIBLE = 5
const INITIAL_ITEMS_VISIBLE = 10

type Props = {
  sections: RestaurantMenuSection[]
}

function MenuItemRow({ item }: { item: RestaurantMenuSection['items'][number] }) {
  return (
    <li className="flex flex-col gap-1.5 py-4 first:pt-3 last:pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
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
  )
}

function MenuSectionItems({ items }: { items: RestaurantMenuSection['items'] }) {
  const [showAllItems, setShowAllItems] = useState(false)
  const hasMoreItems = items.length > INITIAL_ITEMS_VISIBLE
  const displayedItems =
    showAllItems || !hasMoreItems ? items : items.slice(0, INITIAL_ITEMS_VISIBLE)
  const hiddenItemCount = items.length - INITIAL_ITEMS_VISIBLE

  return (
    <>
      <ul className="divide-y divide-neutral-200 border-t border-neutral-200 bg-neutral-50/60 px-5 py-1">
        {displayedItems.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </ul>
      {hasMoreItems ? (
        <div className="border-t border-neutral-200 bg-neutral-50/60 px-5 pb-4 pt-2">
          <button
            type="button"
            onClick={() => setShowAllItems((value) => !value)}
            className={restaurantPageTextLinkClass}
            aria-expanded={showAllItems}
          >
            {showAllItems ? 'Voir moins' : `Voir plus (${hiddenItemCount})`}
          </button>
        </div>
      ) : null}
    </>
  )
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
      <MenuSectionItems items={section.items} />
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
            className={restaurantPageTextLinkClass}
            aria-expanded={showAllSections}
          >
            {showAllSections ? 'Voir moins' : `Voir plus (${hiddenSectionCount})`}
          </button>
        </div>
      ) : null}
    </div>
  )
}
