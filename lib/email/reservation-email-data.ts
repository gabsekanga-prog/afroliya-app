import type { ReservationEmailTemplateData } from '@/lib/email/sendgrid-templates'
import {
  formatReservationDateShortFr,
  formatReservationTimeFr,
  reservationManageUrl,
  type ReservationRecord,
} from '@/lib/reservations'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export function templatePlaceholder(value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : '/'
}

export async function fetchRestaurantDealLabel(restaurantId: string): Promise<string> {
  const admin = getSupabaseAdmin()
  if (!admin) return '/'

  const { data } = await admin
    .from('restaurant_deals')
    .select('title, description')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!data) return '/'

  const title = String(data.title ?? '').trim()
  const description = String(data.description ?? '').trim()

  if (title && description) return `${title} — ${description}`
  return title || description || '/'
}

async function fetchLatestReservationMessage(
  reservationId: string,
  senderType: 'restaurant' | 'client',
): Promise<string> {
  const admin = getSupabaseAdmin()
  if (!admin) return '/'

  const { data } = await admin
    .from('reservation_messages')
    .select('message')
    .eq('reservation_id', reservationId)
    .eq('sender_type', senderType)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return templatePlaceholder(data?.message ?? null)
}

export async function buildReservationEmailTemplateData(
  reservation: ReservationRecord,
  restaurantName: string,
  options?: {
    managementUrl?: string
    clientMessage?: string | null
    /** Renseigne client_message depuis reservation_messages (dernier message client). */
    includeClientMessage?: boolean
  },
): Promise<ReservationEmailTemplateData> {
  const [deal, restoMessage, clientMessage] = await Promise.all([
    fetchRestaurantDealLabel(reservation.restaurant_id),
    fetchLatestReservationMessage(reservation.id, 'restaurant'),
    options?.clientMessage !== undefined
      ? Promise.resolve(options.clientMessage)
      : options?.includeClientMessage
        ? fetchLatestReservationMessage(reservation.id, 'client').then((value) =>
            value === '/' ? null : value,
          )
        : Promise.resolve(undefined),
  ])

  const data: ReservationEmailTemplateData = {
    resto_name: restaurantName,
    client_name: reservation.client_name,
    group_size: String(reservation.group_size),
    date: formatReservationDateShortFr(reservation.booking_date),
    hour: formatReservationTimeFr(reservation.booking_time),
    deal,
    remarks: templatePlaceholder(reservation.remarks),
    restoMessage,
    managementUrl: options?.managementUrl ?? reservationManageUrl(reservation.public_code),
  }

  if (options?.clientMessage !== undefined || options?.includeClientMessage) {
    data.client_message = templatePlaceholder(
      options?.clientMessage !== undefined ? options.clientMessage : clientMessage,
    )
  }

  return data
}
