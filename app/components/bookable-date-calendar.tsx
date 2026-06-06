'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  buildBookableDates,
  formatIsoDateLocal,
  getBookingDateBounds,
} from '@/lib/reservation-opening-hours'
import type { RestaurantOpeningHoursDay } from '@/lib/restaurants'

type Props = {
  openingHours: RestaurantOpeningHoursDay[]
  value: string
  onChange: (isoDate: string) => void
  embedded?: boolean
}

const WEEKDAY_LABELS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function buildMonthGrid(viewMonth: Date): Date[] {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const leadingEmpty = (firstOfMonth.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - leadingEmpty)
  const cells: Date[] = []

  for (let index = 0; index < 42; index++) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    cells.push(date)
  }

  return cells
}

function formatDayAriaLabel(date: Date): string {
  return date.toLocaleDateString('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function BookableDateCalendar({
  openingHours,
  value,
  onChange,
  embedded = false,
}: Props) {
  const hasOpeningHours = openingHours.some((day) => day.slots.length > 0)
  const bookableDates = useMemo(() => buildBookableDates(openingHours), [openingHours])
  const bookableSet = useMemo(() => new Set(bookableDates.map((entry) => entry.value)), [bookableDates])
  const { min, max } = useMemo(() => getBookingDateBounds(), [])
  const todayIso = useMemo(() => formatIsoDateLocal(new Date()), [])

  const initialViewMonth = useMemo(() => {
    if (value) return startOfMonth(parseIsoDate(value))
    if (bookableDates[0]) return startOfMonth(parseIsoDate(bookableDates[0].value))
    return startOfMonth(new Date())
  }, [value, bookableDates])

  const [viewMonth, setViewMonth] = useState(initialViewMonth)

  useEffect(() => {
    if (value) {
      setViewMonth(startOfMonth(parseIsoDate(value)))
    }
  }, [value])

  const monthLabel = viewMonth.toLocaleDateString('fr-BE', {
    month: 'long',
    year: 'numeric',
  })

  const grid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth])

  function isDayBookable(isoDate: string): boolean {
    if (isoDate < min || isoDate > max) return false
    if (!hasOpeningHours) return true
    return bookableSet.has(isoDate)
  }

  function canGoToPreviousMonth(): boolean {
    const previousMonthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0)
    return formatIsoDateLocal(previousMonthEnd) >= min
  }

  function canGoToNextMonth(): boolean {
    const nextMonthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
    return formatIsoDateLocal(nextMonthStart) <= max
  }

  return (
    <div className={embedded ? undefined : 'rounded-xl border border-neutral-300 bg-white p-4'}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
          }
          disabled={!canGoToPreviousMonth()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <p className="text-lg font-semibold capitalize text-neutral-900">{monthLabel}</p>
        <button
          type="button"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
          }
          disabled={!canGoToNextMonth()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Choisir une date de réservation">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="pb-1 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500"
            role="columnheader"
          >
            {label}
          </div>
        ))}

        {grid.map((date) => {
          const isoDate = formatIsoDateLocal(date)
          const inMonth = isSameMonth(date, viewMonth)
          const bookable = isDayBookable(isoDate)
          const selected = value === isoDate
          const isToday = isoDate === todayIso

          return (
            <button
              key={isoDate}
              type="button"
              role="gridcell"
              disabled={!bookable}
              aria-label={formatDayAriaLabel(date)}
              aria-selected={selected}
              aria-current={isToday ? 'date' : undefined}
              onClick={() => onChange(isoDate)}
              className={[
                'flex h-10 w-full items-center justify-center rounded-lg text-base font-medium transition',
                !inMonth ? 'text-neutral-300' : '',
                inMonth && !bookable ? 'cursor-not-allowed text-neutral-300' : '',
                inMonth && bookable && !selected
                  ? 'text-neutral-900 hover:bg-[#f8f1ea] hover:text-[#8D5524]'
                  : '',
                !inMonth && bookable && !selected
                  ? 'text-neutral-500 hover:bg-[#f8f1ea] hover:text-[#8D5524]'
                  : '',
                selected ? 'bg-[#8D5524] text-white hover:bg-[#74431a]' : '',
                isToday && !selected && bookable ? 'ring-1 ring-[#8D5524]/40 ring-inset' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {hasOpeningHours ? (
        <p className="mt-3 text-base text-neutral-500">
          Seuls les jours d’ouverture avec des créneaux disponibles sont sélectionnables.
        </p>
      ) : null}
    </div>
  )
}
