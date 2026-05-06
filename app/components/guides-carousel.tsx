'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Guide } from '@/lib/guides'

type Props = {
  guides: Guide[]
}

export function GuidesCarousel({ guides }: Props) {
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
    const delta = Math.min(el.clientWidth * 0.85, 380)
    el.scrollBy({ left: dir * delta, behavior: 'smooth' })
  }

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(() => updateArrows())
    ro.observe(el)
    return () => ro.disconnect()
  }, [guides, updateArrows])

  return (
    <div className="relative mt-10">
      <button
        type="button"
        aria-label="Guides précédents"
        disabled={!canPrev}
        onClick={() => scrollByDir(-1)}
        className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-md transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-35 sm:flex"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Guides suivants"
        disabled={!canNext}
        onClick={() => scrollByDir(1)}
        className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-md transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-35 sm:flex"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2} aria-hidden />
      </button>

      <div className="flex justify-end gap-2 sm:hidden">
        <button
          type="button"
          aria-label="Guides précédents"
          disabled={!canPrev}
          onClick={() => scrollByDir(-1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-sm disabled:opacity-35"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Guides suivants"
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
        className="-mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mt-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group relative flex h-[220px] w-[min(100vw-5rem,340px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-200/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[260px] sm:w-[380px]"
          >
            <img
              src={guide.imageSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/95 via-[#2a1810]/45 to-transparent"
              aria-hidden
            />
            <div className="relative mt-auto flex w-full flex-col justify-end p-5 sm:p-6">
              <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
                {guide.title}
              </h3>
              <span className="mt-3 inline-flex text-base font-semibold text-[#f8e9dc] underline-offset-4 group-hover:underline">
                Lire le guide
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
