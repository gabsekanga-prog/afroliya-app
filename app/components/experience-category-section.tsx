'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  exploreAllHref,
  exploreAllLabel,
  type Experience,
  type ExperienceCategory,
} from '@/lib/experiences'
import {
  siteButtonPrimaryClass,
  siteHeading2Class,
} from '@/lib/site-styles'

import { ExperienceCard } from './experience-card'

type Props = {
  category: ExperienceCategory
  title: string
  items: Experience[]
}

export function ExperienceCategorySection({ category, title, items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    setCanPrev(scrollLeft > 8)
    setCanNext(scrollLeft < maxScroll - 8)
  }, [])

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    const delta = Math.min(el.clientWidth * 0.85, 340)
    el.scrollBy({ left: dir * delta, behavior: 'smooth' })
  }

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(() => updateArrows())
    ro.observe(el)
    return () => ro.disconnect()
  }, [items, updateArrows])

  return (
    <div>
      <h2 className={siteHeading2Class}>{title}</h2>

      {items.length === 0 ? (
        <p className="mt-6 text-base text-neutral-600 md:text-lg">
          Aucune expérience disponible pour le moment. Revenez bientôt.
        </p>
      ) : (
        <div className="relative mt-8">
          <button
            type="button"
            aria-label={`${title} — précédents`}
            disabled={!canPrev}
            onClick={() => scrollByDir(-1)}
            className="absolute left-0 top-[calc(50%-2rem)] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-md transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-35 sm:flex"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`${title} — suivants`}
            disabled={!canNext}
            onClick={() => scrollByDir(1)}
            className="absolute right-0 top-[calc(50%-2rem)] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-md transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-35 sm:flex"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2} aria-hidden />
          </button>

          <div className="flex justify-end gap-2 sm:hidden">
            <button
              type="button"
              aria-label={`${title} — précédents`}
              disabled={!canPrev}
              onClick={() => scrollByDir(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-sm disabled:opacity-35"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              aria-label={`${title} — suivants`}
              disabled={!canNext}
              onClick={() => scrollByDir(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-sm disabled:opacity-35"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <div
            ref={scrollRef}
            onScroll={updateArrows}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <ExperienceCard
                key={item.id}
                experience={item}
                compact
                openInNewTab={category === 'restaurants'}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-start">
        <Link
          href={exploreAllHref(category)}
          className={siteButtonPrimaryClass}
        >
          {exploreAllLabel(category)}
        </Link>
      </div>
    </div>
  )
}
