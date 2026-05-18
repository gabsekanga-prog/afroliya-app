'use client'

import { useCallback, useEffect, useState } from 'react'
import { Images } from 'lucide-react'

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
  const preview = pages[0]

  const goPrev = useCallback(() => {
    setIndex((value) => (value - 1 + count) % count)
  }, [count])

  const goNext = useCallback(() => {
    setIndex((value) => (value + 1) % count)
  }, [count])

  const openLightbox = useCallback(() => {
    setIndex(0)
    setLightboxOpen(true)
  }, [])

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

  if (!preview || !current) return null

  const showArrows = count > 1
  const pageCountLabel = `${count} page${count !== 1 ? 's' : ''}`

  return (
    <>
      <div className="flex w-full max-w-md items-center gap-5 overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <span className="relative shrink-0">
          <img
            src={preview.imageSrc}
            alt={`Aperçu du menu — ${alt}`}
            className="h-24 w-[4.5rem] rounded-lg border border-neutral-200 object-cover object-top"
            loading="lazy"
            draggable={false}
          />
          {count > 1 ? (
            <span
              className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#8D5524] px-1.5 text-xs font-semibold text-white"
              aria-hidden
            >
              {count}
            </span>
          ) : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <Images className="h-5 w-5 shrink-0 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
            La carte en images
          </p>
          <p className="mt-1 text-sm text-neutral-600">{pageCountLabel}</p>
          <button
            type="button"
            onClick={openLightbox}
            className="mt-3 inline-flex rounded-xl bg-[#8D5524] px-5 py-2 text-base font-normal text-white transition hover:bg-[#74431a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]"
          >
            Voir
          </button>
        </div>
      </div>

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

          {showArrows && count <= 8 ? (
            <div
              className="absolute bottom-4 left-1/2 z-10 flex max-w-[min(100%,36rem)] -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/40 p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                      ? 'border-white shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
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
