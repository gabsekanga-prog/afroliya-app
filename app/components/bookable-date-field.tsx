'use client'

import { Calendar, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { BookableDateCalendar } from '@/app/components/bookable-date-calendar'
import { formInputClassName } from '@/app/components/form-fields'
import type { RestaurantOpeningHoursDay } from '@/lib/restaurants'

type Props = {
  openingHours: RestaurantOpeningHoursDay[]
  value: string
  onChange: (isoDate: string) => void
  disabled?: boolean
}

const GAP = 8
const VIEWPORT_PADDING = 16
const PANEL_MIN_WIDTH = 320
const PANEL_ESTIMATED_HEIGHT = 380

function formatBookingDateLabel(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const label = new Date(year, month - 1, day).toLocaleDateString('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function computePanelPosition(button: HTMLButtonElement): {
  top: number
  left: number
  width: number
} {
  const rect = button.getBoundingClientRect()
  const width = Math.max(PANEL_MIN_WIDTH, rect.width)

  let left = rect.left
  if (left + width > window.innerWidth - VIEWPORT_PADDING) {
    left = window.innerWidth - width - VIEWPORT_PADDING
  }
  if (left < VIEWPORT_PADDING) {
    left = VIEWPORT_PADDING
  }

  let top = rect.bottom + GAP
  if (top + PANEL_ESTIMATED_HEIGHT > window.innerHeight - VIEWPORT_PADDING) {
    const aboveTop = rect.top - GAP - PANEL_ESTIMATED_HEIGHT
    if (aboveTop >= VIEWPORT_PADDING) {
      top = aboveTop
    }
  }

  return { top, left, width }
}

export function BookableDateField({ openingHours, value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const titleId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    const button = buttonRef.current
    if (!button) return
    setPosition(computePanelPosition(button))
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    updatePosition()

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (buttonRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    function handleReposition() {
      updatePosition()
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open, updatePosition])

  function openPicker() {
    const button = buttonRef.current
    if (!button || disabled) return
    setPosition(computePanelPosition(button))
    setOpen(true)
  }

  function togglePicker() {
    if (open) setOpen(false)
    else openPicker()
  }

  function handleSelect(isoDate: string) {
    onChange(isoDate)
    setOpen(false)
  }

  const panel =
    open && position && mounted ? (
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
        }}
        className="fixed z-[200] rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl sm:p-5"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 id={titleId} className="text-lg font-bold text-neutral-900">
            Choisir une date
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <BookableDateCalendar
          openingHours={openingHours}
          value={value}
          onChange={handleSelect}
          embedded
        />
      </div>
    ) : null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={togglePicker}
        className={`${formInputClassName} flex w-full items-center justify-between gap-3 text-left font-normal disabled:cursor-not-allowed disabled:opacity-60`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? 'text-neutral-900' : 'text-neutral-500'}>
          {value ? formatBookingDateLabel(value) : 'Choisir une date'}
        </span>
        <Calendar className="h-5 w-5 shrink-0 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
      </button>

      {mounted && panel ? createPortal(panel, document.body) : null}
    </>
  )
}
