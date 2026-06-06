'use client'

import { useCallback, useEffect, useState } from 'react'

import { ZoomableLightboxImage } from '@/app/components/zoomable-lightbox-image'
import type { RestaurantMenuPage } from '@/lib/restaurants'
import { RESTAURANT_STATS_CLICK_LABELS } from '@/lib/restaurant-stats-events'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'
import { siteRestaurantMenuGalleryImageClass } from '@/lib/site-styles'

type Props = {
  pages: RestaurantMenuPage[]
  alt: string
  trackingRestaurantId?: string
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {direction === 'left' ? (
        <path d="M15 6l-6 6 6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  )
}

function pageLabel(alt: string, index: number, caption: string | null): string {
  const base = `Page ${index + 1} du menu — ${alt}`
  return caption ? `${base} — ${caption}` : base
}

export function RestaurantMenuGallery({ pages, alt, trackingRestaurantId }: Props) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const count = pages.length
  const current = pages[index]

  const goPrev = useCallback(() => {
    setIndex((value) => (value - 1 + count) % count)
  }, [count])

  const goNext = useCallback(() => {
    setIndex((value) => (value + 1) % count)
  }, [count])

  const openLightbox = useCallback(() => {
    if (trackingRestaurantId) {
      void trackRestaurantEvent({
        restaurantId: trackingRestaurantId,
        eventType: 'click',
        eventKey: RESTAURANT_STATS_CLICK_LABELS.viewMenu,
      })
    }
    setLightboxOpen(true)
  }, [trackingRestaurantId])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxOpen, closeLightbox, goPrev, goNext])

  if (!current) return null

  const showArrows = count > 1

  return (
    <>
      <div className="relative w-full max-w-3xl">
        <p className="mb-3 text-left text-base text-neutral-600">
          Page {index + 1} / {count}
          {current.caption ? ` — ${current.caption}` : ''}
          {' · '}
          <span className="text-neutral-500">Cliquez pour agrandir</span>
        </p>

        <button
          type="button"
          onClick={openLightbox}
          className="group block w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-left shadow-sm transition hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524] sm:px-6 sm:py-10"
          aria-label={`Agrandir la page ${index + 1} du menu`}
        >
          <img
            src={current.imageSrc}
            alt={pageLabel(alt, index, current.caption)}
            className={siteRestaurantMenuGalleryImageClass}
            loading="lazy"
            draggable={false}
          />
        </button>

        {showArrows ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Page précédente du menu"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8D5524] shadow-md transition hover:bg-[#f5e6d9]"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Page suivante du menu"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8D5524] shadow-md transition hover:bg-[#f5e6d9]"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2a1810]/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Menu — page ${index + 1} sur ${count}`}
          onClick={closeLightbox}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8D5524]/12 via-transparent to-[#edd9c4]/8"
          />
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a882]/40 bg-[#2a1810]/70 text-[#f8e9dc] transition hover:border-[#8D5524] hover:bg-[#8D5524]/30"
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>

          {showArrows ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  goPrev()
                }}
                aria-label="Page précédente"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a882]/40 bg-[#2a1810]/70 text-[#f8e9dc] transition hover:border-[#8D5524] hover:bg-[#8D5524]/30 sm:left-4"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  goNext()
                }}
                aria-label="Page suivante"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a882]/40 bg-[#2a1810]/70 text-[#f8e9dc] transition hover:border-[#8D5524] hover:bg-[#8D5524]/30 sm:right-4"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          ) : null}

          <figure className="max-w-5xl pb-28 sm:pb-24" onClick={(event) => event.stopPropagation()}>
            <ZoomableLightboxImage
              src={current.imageSrc}
              alt={pageLabel(alt, index, current.caption)}
              resetKey={index}
              controlsPlacement="fixed-bottom"
              toolbarMeta={
                <>
                  Page {index + 1} / {count}
                  {current.caption ? ` — ${current.caption}` : ''}
                </>
              }
            />
          </figure>

          {showArrows && count <= 8 ? (
            <div
              className="absolute bottom-[5.75rem] left-1/2 z-10 flex max-w-[min(100%,36rem)] -translate-x-1/2 gap-2 overflow-x-auto rounded-xl border border-[#8D5524]/25 bg-[#2a1810]/60 p-2 [scrollbar-width:none] sm:bottom-[5.25rem] [&::-webkit-scrollbar]:hidden"
              onClick={(event) => event.stopPropagation()}
            >
              {pages.map((page, thumbIndex) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setIndex(thumbIndex)}
                  aria-label={pageLabel(alt, thumbIndex, page.caption)}
                  aria-current={thumbIndex === index}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    thumbIndex === index
                      ? 'border-[#8D5524] shadow-sm shadow-[#8D5524]/30'
                      : 'border-transparent opacity-60 hover:border-[#c9a882]/50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={page.imageSrc}
                    alt=""
                    className="h-14 w-11 object-cover object-top"
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
