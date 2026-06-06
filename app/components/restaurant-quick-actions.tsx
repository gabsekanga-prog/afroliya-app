'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'

import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'

export type QuickActionItem = {
  id: string
  label: string
  href: string
  external?: boolean
}

type Props = {
  actions: QuickActionItem[]
  tone?: 'default' | 'onDark'
  trackingRestaurantId?: string
}

const PANEL_WIDTH = 256
const GAP = 4

const iconClass = 'h-4 w-4 shrink-0 text-neutral-400 transition group-hover:text-[#8D5524]'

function QuickActionIcon({ id }: { id: string }) {
  switch (id) {
    case 'carte':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      )
    case 'photos':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10.5" r="1.5" />
          <path d="M21 16l-5.5-5.5L6 19" />
        </svg>
      )
    case 'apropos':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M3 21h18M5 21V8l7-4 7 4v13" />
          <path d="M9 21v-6h6v6" />
        </svg>
      )
    case 'horaires':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )
    case 'contact':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      )
    case 'avis':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
        </svg>
      )
    case 'reserver':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 11h16" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      )
  }
}

function computePanelPosition(button: HTMLButtonElement): {
  top: number
  left: number
  minWidth: number
} {
  const rect = button.getBoundingClientRect()
  const viewportPadding = 16

  let left = rect.left
  const minWidth = Math.max(PANEL_WIDTH, rect.width)

  if (left + minWidth > window.innerWidth - viewportPadding) {
    left = window.innerWidth - minWidth - viewportPadding
  }
  if (left < viewportPadding) {
    left = viewportPadding
  }

  return {
    top: rect.bottom + GAP,
    left,
    minWidth,
  }
}

export function RestaurantQuickActions({
  actions,
  tone = 'default',
  trackingRestaurantId,
}: Props) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{
    top: number
    left: number
    minWidth: number
  } | null>(null)
  const [mounted, setMounted] = useState(false)
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

  function openMenu() {
    const button = buttonRef.current
    if (!button) return
    setPosition(computePanelPosition(button))
    setOpen(true)
  }

  function toggle() {
    if (open) setOpen(false)
    else openMenu()
  }

  function close() {
    setOpen(false)
  }

  void tone

  const triggerClass =
    'inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 text-lg font-normal text-neutral-900 shadow-sm transition hover:border-[#c9a882] hover:bg-[#faf6f2]'

  const chevronClass = `h-4 w-4 shrink-0 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`

  const panel =
    open && position && mounted ? (
      <div
        ref={panelRef}
        role="menu"
        aria-labelledby="quick-actions-title"
        style={{
          top: position.top,
          left: position.left,
          minWidth: position.minWidth,
          width: PANEL_WIDTH,
        }}
        className="fixed z-[200] overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <p id="quick-actions-title" className="text-lg font-bold text-neutral-900">
            Raccourcis
          </p>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Fermer"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex max-h-[min(70vh,24rem)] flex-col overflow-y-auto p-1.5">
          {actions.map((action) => (
            <li key={action.id}>
              <a
                href={action.href}
                role="menuitem"
                onClick={() => {
                  close()
                  if (!trackingRestaurantId) return
                  void trackRestaurantEvent({
                    restaurantId: trackingRestaurantId,
                    eventType: 'click',
                    eventKey: action.label,
                  })
                }}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 ${restaurantPageTextLinkClass}`}
                {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <QuickActionIcon id={action.id} />
                <span>{action.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    ) : null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className={triggerClass}
      >
        Raccourcis
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={chevronClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {mounted && panel ? createPortal(panel, document.body) : null}
    </>
  )
}
