'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { RESTAURANT_STATS_CLICK_LABELS } from '@/lib/restaurant-stats-events'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'
import { siteRestaurantPhotoGalleryImageClass } from '@/lib/site-styles'

type Props = {
  images: string[]
  alt: string
  /** Index de la photo de couverture (affichée en dernier dans `images`). */
  coverIndex?: number
  trackingRestaurantId?: string
}

/** Moins de vignettes visibles = cartes plus larges (~1 mobile, ~2 PC). */
const SLIDE_CLASS =
  'w-[calc(100%-0.5rem)] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/1.45)] md:w-[calc((100%-1.25rem)/1.85)] lg:w-[calc((100%-1.25rem)/2.1)]'

const TRACK_GAP_PX = 16

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

function photoAlt(alt: string, index: number, coverIndex: number | undefined): string {
  if (coverIndex != null && index === coverIndex) {
    return `Photo de couverture — ${alt}`
  }
  return `${alt} — photo ${index + 1}`
}

export function RestaurantPhotoGallery({
  images,
  alt,
  coverIndex,
  trackingRestaurantId,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const count = images.length

  const scrollBySlide = useCallback((direction: -1 | 1) => {
    const track = trackRef.current
    if (!track || count === 0) return
    const slide = track.children[0] as HTMLElement | undefined
    if (!slide) return

    const step = slide.offsetWidth + TRACK_GAP_PX
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
    const edgeThreshold = 8
    const atStart = track.scrollLeft <= edgeThreshold
    const atEnd = track.scrollLeft >= maxScroll - edgeThreshold

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    if (direction === -1 && atStart) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' })
      return
    }

    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [count])

  const goPrev = useCallback(() => {
    if (lightboxIndex != null) {
      setLightboxIndex((lightboxIndex - 1 + count) % count)
      return
    }
    scrollBySlide(-1)
  }, [count, lightboxIndex, scrollBySlide])

  const goNext = useCallback(() => {
    if (lightboxIndex != null) {
      setLightboxIndex((lightboxIndex + 1) % count)
      return
    }
    scrollBySlide(1)
  }, [count, lightboxIndex, scrollBySlide])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  useEffect(() => {
    if (lightboxIndex == null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxIndex, closeLightbox, goPrev, goNext])

  if (count === 0) return null

  const showArrows = count > 1

  return (
    <>
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="region"
          aria-label={`Galerie photos — ${alt}`}
        >
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => {
                if (trackingRestaurantId) {
                  void trackRestaurantEvent({
                    restaurantId: trackingRestaurantId,
                    eventType: 'click',
                    eventKey: RESTAURANT_STATS_CLICK_LABELS.viewPhotos,
                  })
                }
                setLightboxIndex(index)
              }}
              className={`${SLIDE_CLASS} group overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 text-left shadow-sm transition hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]`}
            >
              <img
                src={src}
                alt={photoAlt(alt, index, coverIndex)}
                className={siteRestaurantPhotoGalleryImageClass}
                loading="lazy"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {showArrows ? (
          <>
            <button
              type="button"
              onClick={() => goPrev()}
              aria-label="Photo précédente"
              className="absolute -left-1 top-[calc(50%-1.125rem)] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8D5524] shadow-md transition hover:bg-[#f5e6d9] sm:-left-3"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => goNext()}
              aria-label="Photo suivante"
              className="absolute -right-1 top-[calc(50%-1.125rem)] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8D5524] shadow-md transition hover:bg-[#f5e6d9] sm:-right-3"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}
      </div>

      {lightboxIndex != null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightboxIndex + 1} sur ${count} — ${alt}`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:bg-black/70"
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
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                aria-label="Photo précédente"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:bg-black/70 sm:left-4"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                aria-label="Photo suivante"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:bg-black/70 sm:right-4"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          ) : null}

          <figure
            className="relative max-h-[min(90vh,900px)] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex]}
              alt={photoAlt(alt, lightboxIndex, coverIndex)}
              className="max-h-[min(90vh,900px)] w-auto max-w-full object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {lightboxIndex + 1} / {count}
              {coverIndex != null && lightboxIndex === coverIndex ? ' — couverture' : ''}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  )
}
