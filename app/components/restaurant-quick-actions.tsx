'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'

export type QuickActionItem = {
  id: string
  label: string
  href: string
}

type Props = {
  actions: QuickActionItem[]
}

const PANEL_WIDTH = 256
const GAP = 8

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
    case 'infos':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      )
    case 'savoir':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      )
    case 'apropos':
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M3 21h18M5 21V8l7-4 7 4v13" />
          <path d="M9 21v-6h6v6" />
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

export function RestaurantQuickActions({ actions }: Props) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const viewportPadding = 16

    let left = rect.right + GAP
    let top = rect.top

    if (left + PANEL_WIDTH > window.innerWidth - viewportPadding) {
      left = rect.left - PANEL_WIDTH - GAP
    }

    const panelHeight = panelRef.current?.offsetHeight ?? 320
    if (top + panelHeight > window.innerHeight - viewportPadding) {
      top = Math.max(viewportPadding, window.innerHeight - panelHeight - viewportPadding)
    }

    setPosition({ top, left })
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    updatePosition()

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (buttonRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, updatePosition])

  function openMenu() {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const viewportPadding = 16

    let left = rect.right + GAP
    let top = rect.top

    if (left + PANEL_WIDTH > window.innerWidth - viewportPadding) {
      left = rect.left - PANEL_WIDTH - GAP
    }

    setPosition({ top, left })
    setOpen(true)
  }

  function toggle() {
    if (open) setOpen(false)
    else openMenu()
  }

  function close() {
    setOpen(false)
  }

  function handleActionClick() {
    close()
  }

  const panel =
    open && position && mounted
      ? createPortal(
          <div
            ref={panelRef}
            role="menu"
            aria-labelledby="quick-actions-title"
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: PANEL_WIDTH,
              zIndex: 200,
            }}
            className="rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <p id="quick-actions-title" className="text-base font-bold text-neutral-900">
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

            <ul className="flex flex-col p-1.5">
              {actions.map((action) => (
                <li key={action.id}>
                  <a
                    href={action.href}
                    role="menuitem"
                    onClick={handleActionClick}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-lg text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
                  >
                    <QuickActionIcon id={action.id} />
                    <span>{action.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/15 px-6 text-lg font-normal text-white shadow-lg backdrop-blur-sm transition hover:bg-white/25"
      >
        Raccourcis
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`h-4 w-4 shrink-0 text-white/80 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {panel}
    </>
  )
}
