'use client'

import { ListChecks } from 'lucide-react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'

import { siteButtonPrimaryClass } from '@/lib/site-styles'

const PANEL_WIDTH = 248
const GAP = 4

export const reservationMenuItemClass =
  'block w-full rounded-lg px-2.5 py-2 text-left text-base text-neutral-900 transition hover:bg-[#faf6f2] hover:text-[#8D5524]'

export const reservationMenuItemDestructiveClass =
  'block w-full rounded-lg px-2.5 py-2 text-left text-base text-red-800 transition hover:bg-red-50 hover:text-red-900'

export const reservationMenuItemDisabledClass =
  'block w-full rounded-lg px-2.5 py-2 text-left text-base text-neutral-400'

export type ReservationMenuEntry =
  | {
      kind: 'link'
      id: string
      label: string
      href: string
      external?: boolean
      disabled?: boolean
    }
  | {
      kind: 'button'
      id: string
      label: string
      onClick: () => void
      disabled?: boolean
      destructive?: boolean
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

type Props = {
  entries: ReservationMenuEntry[]
}

export function ReservationActionsDropdown({ entries }: Props) {
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

  function close() {
    setOpen(false)
  }

  function toggle() {
    if (open) setOpen(false)
    else {
      const button = buttonRef.current
      if (!button) return
      setPosition(computePanelPosition(button))
      setOpen(true)
    }
  }

  function runButtonAction(entry: Extract<ReservationMenuEntry, { kind: 'button' }>) {
    if (entry.disabled) return
    close()
    entry.onClick()
  }

  const panel =
    open && position && mounted ? (
      <div
        ref={panelRef}
        role="menu"
        aria-labelledby="reservation-actions-title"
        style={{
          top: position.top,
          left: position.left,
          minWidth: position.minWidth,
          width: PANEL_WIDTH,
        }}
        className="fixed z-[200] overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
          <p id="reservation-actions-title" className="text-base font-semibold text-neutral-900">
            Prendre une action
          </p>
          <button
            type="button"
            onClick={close}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
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

        <ul className="flex max-h-[min(70vh,20rem)] flex-col overflow-y-auto p-1">
          {entries.map((entry) => (
            <li key={entry.id}>
              {entry.kind === 'link' ? (
                entry.disabled ? (
                  <span role="menuitem" aria-disabled="true" className={reservationMenuItemDisabledClass}>
                    {entry.label}
                  </span>
                ) : entry.external ? (
                  <a
                    href={entry.href}
                    role="menuitem"
                    onClick={close}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={reservationMenuItemClass}
                  >
                    {entry.label}
                  </a>
                ) : (
                  <Link href={entry.href} role="menuitem" onClick={close} className={reservationMenuItemClass}>
                    {entry.label}
                  </Link>
                )
              ) : entry.disabled ? (
                <span role="menuitem" aria-disabled="true" className={reservationMenuItemDisabledClass}>
                  {entry.label}
                </span>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => runButtonAction(entry)}
                  className={
                    entry.destructive ? reservationMenuItemDestructiveClass : reservationMenuItemClass
                  }
                >
                  {entry.label}
                </button>
              )}
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
        className={`inline-flex gap-2 ${siteButtonPrimaryClass}`}
      >
        <ListChecks className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
        Prendre une action
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
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
