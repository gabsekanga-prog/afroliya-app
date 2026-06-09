'use client'

import { useCallback, useEffect, useState } from 'react'
import { Play } from 'lucide-react'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM17.75 6a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.75 6z" />
    </svg>
  )
}

import { InstagramPostEmbed } from '@/app/components/instagram-post-embed'
import { RESTAURANT_STATS_CLICK_LABELS } from '@/lib/restaurant-stats-events'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'
import {
  siteRestaurantPhotoGalleryImageClass,
  siteRestaurantPhotoGallerySlideButtonClass,
  siteRestaurantPhotoGallerySlideClass,
} from '@/lib/site-styles'

type Props = {
  postUrl: string
  permalink: string
  thumbnailUrl: string | null
  compactTop?: boolean
  trackingRestaurantId?: string
}

export function InstagramPostVideoCard({
  postUrl,
  permalink,
  thumbnailUrl,
  compactTop = false,
  trackingRestaurantId,
}: Props) {
  const [open, setOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(thumbnailUrl)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    setPreviewUrl(thumbnailUrl)
  }, [thumbnailUrl])

  useEffect(() => {
    if (previewUrl) return

    let cancelled = false

    async function loadRemoteThumbnail() {
      try {
        const response = await fetch(
          `/api/instagram-thumbnail?url=${encodeURIComponent(postUrl)}`,
        )
        if (!response.ok || cancelled) return

        const data = (await response.json()) as { thumbnailUrl?: string | null }
        const remote = data.thumbnailUrl?.trim()
        if (remote && !cancelled) {
          setPreviewUrl(remote)
        }
      } catch {
        // garde le placeholder
      }
    }

    void loadRemoteThumbnail()

    return () => {
      cancelled = true
    }
  }, [postUrl, previewUrl])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (trackingRestaurantId) {
            void trackRestaurantEvent({
              restaurantId: trackingRestaurantId,
              eventType: 'click',
              eventKey: RESTAURANT_STATS_CLICK_LABELS.instagram,
            })
          }
          setOpen(true)
        }}
        className={`relative block shrink-0 text-left ${compactTop ? 'mt-4 w-full max-w-[220px] overflow-hidden rounded-2xl border border-neutral-200 bg-stone-100 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]' : `mt-6 ${siteRestaurantPhotoGallerySlideClass} ${siteRestaurantPhotoGallerySlideButtonClass}`}`}
        aria-label="Lire la vidéo Afroliya sur Instagram"
      >
        <div className="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Aperçu de notre passage sur Instagram"
              className={
                compactTop
                  ? 'h-[200px] w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:aspect-[4/5] sm:h-auto sm:max-h-[280px]'
                  : siteRestaurantPhotoGalleryImageClass
              }
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className={
                compactTop
                  ? 'h-[200px] w-full bg-gradient-to-br from-[#8D5524]/25 via-[#f8f1ea] to-stone-200 sm:aspect-[4/5] sm:h-auto sm:max-h-[280px]'
                  : `${siteRestaurantPhotoGalleryImageClass} bg-gradient-to-br from-[#8D5524]/25 via-[#f8f1ea] to-stone-200`
              }
              aria-hidden
            />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/75 via-[#2a1810]/20 to-transparent"
            aria-hidden
          />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#8D5524] shadow-lg transition group-hover:scale-105">
              <Play className="h-7 w-7 fill-current" aria-hidden />
            </span>
          </span>

          <span className="absolute bottom-0 left-0 right-0 p-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white drop-shadow-sm">
              <InstagramIcon className="h-4 w-4 shrink-0" />
              Instagram
            </span>
            <span className="mt-1 block text-xs text-white/90">Appuyer pour lire</span>
          </span>
        </div>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/80 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Vidéo Instagram Afroliya"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-neutral-900/60 text-white transition hover:bg-neutral-900/90"
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>

          <div
            className="max-h-[min(90vh,900px)] w-full max-w-[540px] overflow-y-auto rounded-2xl bg-white p-3 shadow-xl sm:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <InstagramPostEmbed postUrl={postUrl} />
            <p className="mt-3 text-center text-sm text-neutral-600">
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#8D5524] underline-offset-2 hover:underline"
                onClick={() => {
                  if (!trackingRestaurantId) return
                  void trackRestaurantEvent({
                    restaurantId: trackingRestaurantId,
                    eventType: 'click',
                    eventKey: RESTAURANT_STATS_CLICK_LABELS.instagram,
                  })
                }}
              >
                Ouvrir sur Instagram
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
