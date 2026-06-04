'use client'

import { formatOpeningSlotLabel } from '@/lib/reservation-opening-hours'
import type { RestaurantOpeningHoursDay } from '@/lib/restaurants'

type Props = {
  days: RestaurantOpeningHoursDay[]
}

function DayRow({
  dayHours,
  isToday,
}: {
  dayHours: RestaurantOpeningHoursDay
  isToday: boolean
}) {
  const isClosed = dayHours.slots.length === 0
  const hoursText = isClosed
    ? 'Fermé'
    : dayHours.slots.map((slot) => formatOpeningSlotLabel(slot.openTime, slot.closeTime)).join(' · ')

  return (
    <li
      className={`flex flex-row flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:gap-x-3 ${
        isToday ? 'border-l-2 border-[#8D5524] pl-3' : ''
      }`}
      aria-current={isToday ? 'date' : undefined}
    >
      <span
        className={`shrink-0 font-bold min-w-[5.75rem] sm:min-w-[7.5rem] ${
          isToday ? 'text-[#8D5524]' : 'text-neutral-900'
        }`}
      >
        {dayHours.dayLabel}
      </span>
      <span
        className={
          isToday
            ? 'font-medium text-[#8D5524]'
            : isClosed
              ? 'text-neutral-500'
              : 'text-neutral-700'
        }
      >
        {hoursText}
      </span>
    </li>
  )
}

export function RestaurantOpeningHours({ days }: Props) {
  const today = new Date().getDay()
  const midpoint = Math.ceil(days.length / 2)
  const columns = [days.slice(0, midpoint), days.slice(midpoint)]

  return (
    <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
      {columns.map((column, columnIndex) => (
        <ul key={columnIndex} className="space-y-3 text-base md:text-lg">
          {column.map((dayHours) => (
            <DayRow key={dayHours.day} dayHours={dayHours} isToday={dayHours.day === today} />
          ))}
        </ul>
      ))}
    </div>
  )
}
