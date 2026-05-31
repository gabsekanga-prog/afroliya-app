import type { RestaurantOpeningHoursDay } from '@/lib/restaurants'

const BOOKING_INTERVAL_MINUTES = 30
const LAST_SEATING_BUFFER_MINUTES = 30
const MINUTES_PER_DAY = 24 * 60
export const BOOKING_HORIZON_DAYS = 60

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}

function minutesToTime(minutes: number): string {
  const normalized = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const hours = Math.floor(normalized / 60)
  const mins = normalized % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function formatIsoDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

type OpeningSlot = { openTime: string; closeTime: string }

type OpeningSlotRow = {
  day: number
  open_time: string | null
  close_time: string | null
  sort_order: number | null
}

const OPENING_DAY_LABELS: Record<number, string> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
}

const OPENING_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const

function formatOpeningTime(value: string | null | undefined): string {
  if (!value) return ''
  const raw = String(value).trim()
  if (/^\d{2}:\d{2}:\d{2}/.test(raw)) return raw.slice(0, 5)
  if (/^\d{1,2}:\d{2}/.test(raw)) {
    const [hours, minutes] = raw.split(':')
    return `${hours.padStart(2, '0')}:${minutes}`
  }
  return raw
}

export function isOvernightOpeningSlot(openTime: string, closeTime: string): boolean {
  return timeToMinutes(closeTime) <= timeToMinutes(openTime)
}

export function formatOpeningSlotLabel(openTime: string, closeTime: string): string {
  if (isOvernightOpeningSlot(openTime, closeTime)) {
    return `${openTime} – ${closeTime} (+1)`
  }
  return `${openTime} – ${closeTime}`
}

function resolveBookingDateTime(
  isoDate: string,
  time: string,
  schedules: OpeningSlot[],
): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const timeMin = timeToMinutes(time)

  for (const slot of schedules) {
    if (!isOvernightOpeningSlot(slot.openTime, slot.closeTime)) continue
    const open = timeToMinutes(slot.openTime)
    const lastBookable = timeToMinutes(slot.closeTime) - LAST_SEATING_BUFFER_MINUTES
    if (timeMin <= lastBookable && timeMin < open) {
      return new Date(year, month - 1, day + 1, hours, minutes || 0, 0, 0)
    }
  }

  return new Date(year, month - 1, day, hours, minutes || 0, 0, 0)
}

function isBookingTimePast(isoDate: string, time: string, schedules: OpeningSlot[]): boolean {
  return resolveBookingDateTime(isoDate, time, schedules).getTime() <= Date.now()
}

function generateBookingTimesForSlot(slot: OpeningSlot): string[] {
  const open = timeToMinutes(slot.openTime)
  const close = timeToMinutes(slot.closeTime)
  const times: string[] = []

  if (isOvernightOpeningSlot(slot.openTime, slot.closeTime)) {
    const lastEveningSlot = MINUTES_PER_DAY - BOOKING_INTERVAL_MINUTES
    for (let minutes = open; minutes <= lastEveningSlot; minutes += BOOKING_INTERVAL_MINUTES) {
      times.push(minutesToTime(minutes))
    }

    const lastBookable = close - LAST_SEATING_BUFFER_MINUTES
    for (let minutes = 0; minutes <= lastBookable; minutes += BOOKING_INTERVAL_MINUTES) {
      times.push(minutesToTime(minutes))
    }

    return times
  }

  const lastBookable = close - LAST_SEATING_BUFFER_MINUTES
  for (let minutes = open; minutes <= lastBookable; minutes += BOOKING_INTERVAL_MINUTES) {
    times.push(minutesToTime(minutes))
  }

  return times
}

function sortBookingTimes(times: string[], schedules: OpeningSlot[]): string[] {
  function timelinePosition(time: string): number {
    const minutes = timeToMinutes(time)
    for (const slot of schedules) {
      if (!isOvernightOpeningSlot(slot.openTime, slot.closeTime)) continue
      const open = timeToMinutes(slot.openTime)
      const lastBookable = timeToMinutes(slot.closeTime) - LAST_SEATING_BUFFER_MINUTES
      if (minutes <= lastBookable && minutes < open) {
        return minutes + MINUTES_PER_DAY
      }
    }
    return minutes
  }

  return [...times].sort((a, b) => timelinePosition(a) - timelinePosition(b))
}

export function isOvernightContinuationTime(
  openingHours: RestaurantOpeningHoursDay[],
  isoDate: string,
  time: string,
): boolean {
  const timeMin = timeToMinutes(time)
  for (const slot of getOpeningDaySchedule(openingHours, isoDate)) {
    if (!isOvernightOpeningSlot(slot.openTime, slot.closeTime)) continue
    const open = timeToMinutes(slot.openTime)
    const lastBookable = timeToMinutes(slot.closeTime) - LAST_SEATING_BUFFER_MINUTES
    if (timeMin <= lastBookable && timeMin < open) {
      return true
    }
  }
  return false
}

export function formatBookingTimeLabel(
  openingHours: RestaurantOpeningHoursDay[],
  isoDate: string,
  time: string,
): string {
  const label = time.replace(':', 'h')
  if (isOvernightContinuationTime(openingHours, isoDate, time)) {
    return `${label} (+1)`
  }
  return label
}

export function parseRestaurantOpeningSlots(rows: OpeningSlotRow[]): RestaurantOpeningHoursDay[] {
  const byDay = new Map<number, { openTime: string; closeTime: string; sortOrder: number }[]>()

  for (const row of rows) {
    if (typeof row.day !== 'number' || row.day < 0 || row.day > 6) continue
    const openTime = formatOpeningTime(row.open_time)
    const closeTime = formatOpeningTime(row.close_time)
    if (!openTime || !closeTime) continue
    const slots = byDay.get(row.day) ?? []
    slots.push({
      openTime,
      closeTime,
      sortOrder: Number(row.sort_order) || slots.length,
    })
    byDay.set(row.day, slots)
  }

  if (byDay.size === 0) return []

  return OPENING_DAY_ORDER.map((day) => {
    const slots = byDay.get(day) ?? []
    slots.sort((a, b) => a.sortOrder - b.sortOrder)
    return {
      day,
      dayLabel: OPENING_DAY_LABELS[day] ?? `Jour ${day}`,
      slots: slots.map(({ openTime, closeTime }) => ({ openTime, closeTime })),
    }
  })
}

export function getJsDayFromIsoDate(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

export function getOpeningDaySchedule(
  openingHours: RestaurantOpeningHoursDay[],
  isoDate: string,
): OpeningSlot[] {
  const day = getJsDayFromIsoDate(isoDate)
  const entry = openingHours.find((row) => row.day === day)
  return entry?.slots.filter((slot) => slot.openTime && slot.closeTime) ?? []
}

export function isRestaurantOpenOnDate(
  openingHours: RestaurantOpeningHoursDay[],
  isoDate: string,
): boolean {
  return getOpeningDaySchedule(openingHours, isoDate).length > 0
}

export function buildBookingTimeOptionsForDate(
  openingHours: RestaurantOpeningHoursDay[],
  isoDate: string,
): string[] {
  const schedules = getOpeningDaySchedule(openingHours, isoDate)
  if (schedules.length === 0) return []

  const times = new Set<string>()

  for (const slot of schedules) {
    for (const time of generateBookingTimesForSlot(slot)) {
      if (!isBookingTimePast(isoDate, time, schedules)) {
        times.add(time)
      }
    }
  }

  return sortBookingTimes([...times], schedules)
}

export function buildBookableDates(openingHours: RestaurantOpeningHoursDay[]): {
  value: string
  label: string
}[] {
  const openDays = new Set(
    openingHours.filter((day) => day.slots.length > 0).map((day) => day.day),
  )
  if (openDays.size === 0) return []

  const results: { value: string; label: string }[] = []
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  for (let offset = 0; offset <= BOOKING_HORIZON_DAYS; offset++) {
    const date = new Date(start)
    date.setDate(start.getDate() + offset)
    if (!openDays.has(date.getDay())) continue

    const isoDate = formatIsoDateLocal(date)
    const timeOptions = buildBookingTimeOptionsForDate(openingHours, isoDate)
    if (timeOptions.length === 0) continue

    results.push({
      value: isoDate,
      label: date.toLocaleDateString('fr-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    })
  }

  return results
}

export function getBookingDateBounds(): { min: string; max: string } {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + BOOKING_HORIZON_DAYS)
  return { min: formatIsoDateLocal(start), max: formatIsoDateLocal(end) }
}

export function isBookableBookingDate(
  openingHours: RestaurantOpeningHoursDay[],
  isoDate: string,
): boolean {
  if (!isoDate.trim()) return false
  if (!openingHours.some((day) => day.slots.length > 0)) return true
  if (!isRestaurantOpenOnDate(openingHours, isoDate)) return false
  return buildBookingTimeOptionsForDate(openingHours, isoDate).length > 0
}

export function validateBookingAgainstOpeningHours(
  openingHours: RestaurantOpeningHoursDay[],
  bookingDate: string,
  bookingTime: string,
): { ok: true } | { ok: false; error: string } {
  if (!openingHours.some((day) => day.slots.length > 0)) {
    return { ok: true }
  }

  if (!isRestaurantOpenOnDate(openingHours, bookingDate)) {
    return { ok: false, error: 'Le restaurant est fermé à cette date.' }
  }

  const normalizedTime = bookingTime.trim().slice(0, 5)
  const allowedTimes = buildBookingTimeOptionsForDate(openingHours, bookingDate)
  if (!allowedTimes.includes(normalizedTime)) {
    return { ok: false, error: 'Créneau hors horaires d’ouverture du restaurant.' }
  }

  return { ok: true }
}
