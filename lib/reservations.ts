export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'no_show'

export type ReservationRecord = {
  id: string
  restaurant_id: string
  client_name: string
  client_email: string
  client_phone: string | null
  booking_date: string
  booking_time: string
  group_size: number
  remarks: string | null
  status: ReservationStatus
  public_code: string
  public_code_expires_at: string
  created_at: string
}

export type CreateReservationPayload = {
  bookingDate: string
  bookingTime: string
  groupSize: number
  clientName: string
  clientEmail: string
  clientPhone?: string
  remarks?: string
}

const PUBLIC_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'

export function generateReservationPublicCode(): string {
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += PUBLIC_CODE_CHARS[Math.floor(Math.random() * PUBLIC_CODE_CHARS.length)]!
  }
  return code
}

export function formatReservationDateFr(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatReservationTimeFr(time: string): string {
  const raw = time.trim()
  if (/^\d{2}:\d{2}/.test(raw)) return raw.slice(0, 5)
  return raw
}

export function validateCreateReservationPayload(
  payload: Partial<CreateReservationPayload>,
): { ok: true; data: CreateReservationPayload } | { ok: false; error: string } {
  const bookingDate = String(payload.bookingDate ?? '').trim()
  const bookingTime = String(payload.bookingTime ?? '').trim()
  const groupSize = Number(payload.groupSize)
  const clientName = String(payload.clientName ?? '').trim()
  const clientEmail = String(payload.clientEmail ?? '').trim().toLowerCase()
  const clientPhone = String(payload.clientPhone ?? '').trim()
  const remarks = String(payload.remarks ?? '').trim()

  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
    return { ok: false, error: 'Date invalide.' }
  }

  const parsedDate = new Date(`${bookingDate}T12:00:00`)
  if (Number.isNaN(parsedDate.getTime())) {
    return { ok: false, error: 'Date invalide.' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (parsedDate < today) {
    return { ok: false, error: 'La date doit être aujourd’hui ou ultérieure.' }
  }

  if (!/^\d{2}:\d{2}$/.test(bookingTime)) {
    return { ok: false, error: 'Heure invalide.' }
  }

  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 30) {
    return { ok: false, error: 'Nombre de personnes invalide (1 à 30).' }
  }

  if (clientName.length < 2) {
    return { ok: false, error: 'Nom requis.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return { ok: false, error: 'E-mail invalide.' }
  }

  if (remarks.length > 500) {
    return { ok: false, error: 'Remarques trop longues (500 caractères max.).' }
  }

  return {
    ok: true,
    data: {
      bookingDate,
      bookingTime,
      groupSize,
      clientName,
      clientEmail,
      clientPhone: clientPhone || undefined,
      remarks: remarks || undefined,
    },
  }
}

export function generateEmailVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function getSiteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export function reservationManageUrl(publicCode: string): string {
  return `${getSiteBaseUrl()}/reservations/gestion/${publicCode}`
}
