'use client'

import { useEffect, useRef, useState } from 'react'

import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import { siteBodyClass } from '@/lib/site-styles'

type Props = {
  text: string
  /** Nombre de lignes visibles lorsque le texte est replié (défaut : 2). */
  collapsedLines?: number
  className?: string
}

export function CollapsibleText({ text, collapsedLines = 2, className = '' }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const contentRef = useRef<HTMLParagraphElement>(null)

  const trimmed = text.trim()

  const clampClass =
    collapsedLines === 2
      ? 'line-clamp-2'
      : collapsedLines === 3
        ? 'line-clamp-3'
        : collapsedLines === 4
          ? 'line-clamp-4'
          : 'line-clamp-2'

  useEffect(() => {
    if (!trimmed || expanded) return

    const el = contentRef.current
    if (!el) return

    const measure = () => {
      setShowToggle(el.scrollHeight > el.clientHeight + 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [trimmed, expanded, clampClass])

  if (!trimmed) return null

  return (
    <div className={className}>
      <p
        ref={contentRef}
        id="restaurant-presentation-text"
        className={`${siteBodyClass} ${expanded ? '' : clampClass}`}
      >
        {trimmed}
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={`mt-2 ${restaurantPageTextLinkClass}`}
          aria-expanded={expanded}
          aria-controls="restaurant-presentation-text"
        >
          {expanded ? 'Réduire' : 'Lire la suite'}
        </button>
      ) : null}
    </div>
  )
}
