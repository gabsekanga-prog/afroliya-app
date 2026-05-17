'use client'

import { useCallback, useEffect, useState } from 'react'

import { ZoomableLightboxImage } from '@/app/components/zoomable-lightbox-image'
import type { RestaurantMenuPage } from '@/lib/restaurants'

type Props = {
  pages: RestaurantMenuPage[]
  alt: string
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

export function RestaurantMenuGallery({ pages, alt }: Props) {
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
      <div className="relative max-w-2xl">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 text-left shadow-sm transition hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]"
          aria-label={`Agrandir — ${pageLabel(alt, index, current.caption)}`}
        >
          <img
            src={current.imageSrc}
            alt={pageLabel(alt, index, current.caption)}
            className="mx-auto max-h-[min(75vh,720px)] w-full object-contain"
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
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8D5524] shadow-md transition hover:bg-[#f5e6d9] sm:left-3"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Page suivante du menu"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8D5524] shadow-md transition hover:bg-[#f5e6d9] sm:right-3"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-neutral-600">
          Page {index + 1} / {count}
          {current.caption ? ` · ${current.caption}` : ''}
        </p>
        {showArrows ? (
          <button
            type="button"
            onClick={goNext}
            className="text-sm font-medium text-[#8D5524] underline-offset-2 hover:underline"
          >
            Page suivante
          </button>
        ) : null}
      </div>

      {showArrows && count <= 8 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pages.map((page, thumbIndex) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setIndex(thumbIndex)}
              aria-label={pageLabel(alt, thumbIndex, page.caption)}
              aria-current={thumbIndex === index}
              className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                thumbIndex === index
                  ? 'border-[#8D5524] shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={page.imageSrc}
                alt=""
                className="h-16 w-12 object-cover object-top"
                loading="lazy"
                draggable={false}
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Menu — page ${index + 1} sur ${count}`}
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
                onClick={(event) => {
                  event.stopPropagation()
                  goPrev()
                }}
                aria-label="Page précédente"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:bg-black/70 sm:left-4"
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
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:bg-black/70 sm:right-4"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          ) : null}

          <figure className="max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <ZoomableLightboxImage
              src={current.imageSrc}
              alt={pageLabel(alt, index, current.caption)}
              resetKey={index}
            />
            <figcaption className="mt-2 text-center text-sm text-white/85">
              Page {index + 1} / {count}
              {current.caption ? ` — ${current.caption}` : ''}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  )
}
