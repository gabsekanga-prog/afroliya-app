'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 0.25
const DOUBLE_TAP_SCALE = 2.5

type Props = {
  src: string
  alt: string
  /** Change pour réinitialiser le zoom (ex. index de page). */
  resetKey?: string | number
  className?: string
}

function touchDistance(touches: React.TouchList): number {
  const [a, b] = [touches[0], touches[1]]
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

export function ZoomableLightboxImage({ src, alt, resetKey, className = '' }: Props) {
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const lastTap = useRef(0)
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null)
  const touchPanStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  const reset = useCallback(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    reset()
  }, [resetKey, src, reset])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
      setScale((value) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, value + delta))
        if (next <= 1) setPan({ x: 0, y: 0 })
        return next
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const zoomIn = useCallback(() => {
    setScale((value) => Math.min(MAX_SCALE, value + ZOOM_STEP))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((value) => {
      const next = Math.max(MIN_SCALE, value - ZOOM_STEP)
      if (next <= 1) setPan({ x: 0, y: 0 })
      return next
    })
  }, [])

  const toggleZoom = useCallback(() => {
    if (scale > 1) reset()
    else setScale(DOUBLE_TAP_SCALE)
  }, [scale, reset])

  const onPointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (scale <= 1 || event.pointerType === 'touch') return
    dragging.current = true
    dragStart.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!dragging.current) return
    setPan({
      x: dragStart.current.panX + (event.clientX - dragStart.current.x),
      y: dragStart.current.panY + (event.clientY - dragStart.current.y),
    })
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      touchPanStart.current = null
      pinchStart.current = { distance: touchDistance(event.touches), scale }
      return
    }
    if (event.touches.length === 1 && scale > 1) {
      pinchStart.current = null
      touchPanStart.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      }
    }
  }

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchStart.current) {
      event.preventDefault()
      const distance = touchDistance(event.touches)
      const ratio = distance / pinchStart.current.distance
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStart.current.scale * ratio))
      setScale(next)
      if (next <= 1) setPan({ x: 0, y: 0 })
      return
    }
    if (event.touches.length === 1 && touchPanStart.current && scale > 1) {
      event.preventDefault()
      const touch = event.touches[0]
      setPan({
        x: touchPanStart.current.panX + (touch.clientX - touchPanStart.current.x),
        y: touchPanStart.current.panY + (touch.clientY - touchPanStart.current.y),
      })
    }
  }

  const onTouchEnd = () => {
    pinchStart.current = null
    touchPanStart.current = null
  }

  const onImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation()
    const now = Date.now()
    if (now - lastTap.current < 300) {
      toggleZoom()
      lastTap.current = 0
      return
    }
    lastTap.current = now
  }

  const isZoomed = scale > 1
  const controlClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/50 text-lg text-white transition hover:bg-black/70 disabled:opacity-40'

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        ref={viewportRef}
        className={`relative max-w-full touch-none overflow-hidden ${
          isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
        }`}
        style={{ maxHeight: 'min(92vh, 920px)' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-h-[min(92vh,920px)] w-auto max-w-full select-none object-contain"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={onImageClick}
          onDoubleClick={(event) => {
            event.stopPropagation()
            toggleZoom()
          }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            zoomOut()
          }}
          disabled={scale <= MIN_SCALE}
          className={controlClass}
          aria-label="Réduire le zoom"
        >
          −
        </button>
        <span className="min-w-[3.5rem] text-center text-sm text-white/85" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            zoomIn()
          }}
          disabled={scale >= MAX_SCALE}
          className={controlClass}
          aria-label="Augmenter le zoom"
        >
          +
        </button>
        {isZoomed ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              reset()
            }}
            className="rounded-full border border-white/30 bg-black/50 px-3 py-1.5 text-sm text-white transition hover:bg-black/70"
          >
            Réinitialiser
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-center text-xs text-white/60">
        {isZoomed
          ? 'Glissez pour déplacer · double-clic pour réinitialiser'
          : 'Molette, pincer ou double-clic pour zoomer'}
      </p>
    </div>
  )
}
