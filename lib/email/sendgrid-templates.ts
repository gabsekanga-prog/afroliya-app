/** IDs des dynamic templates SendGrid (dashboard SendGrid → Email API → Dynamic Templates). */
export const SENDGRID_TEMPLATE_IDS = {
  /** 1 — Demande de réservation (client) */
  reservationRequestClient: 'd-5e88ffd5fb634c308ddc3b4e2018230c',
  /** 2 — Nouvelle réservation (restaurant) */
  reservationNewRestaurant: 'd-748baf8981884074a85b6a94cf064c55',
  /** 3 — Confirmation réservation (client) */
  reservationConfirmedClient: 'd-c08e22f40e9a4d2586aad7b7c4d5c1a7',
  /** 4 & 6 — Annulation (restaurant) : par le client ou avec message client */
  reservationCancelledRestaurant: 'd-9b78fba699f3431bbeec38a727001d14',
  /** 5 — Annulation / refus par le restaurant (client) */
  reservationCancelledByRestaurantClient: 'd-a2392e8edc19464eb5565687f1e6620d',
  /** 7 — E-mail simple (code de validation, etc.) */
  simpleMessage: 'd-5d1c466ab87e44ab99c4d374665b9447',
  /** 8 — Notification site vers admins */
  adminSiteNotification: 'd-fb74736a2aee467b924f2362bebaa0fd',
} as const

export type ReservationEmailTemplateData = {
  resto_name: string
  client_name: string
  group_size: string
  date: string
  hour: string
  deal: string
  remarks: string
  restoMessage: string
  managementUrl?: string
  client_message?: string
}

export type SimpleMessageTemplateData = {
  intro: string
  important: string
  subject: string
}

export type AdminSiteNotificationTemplateData = {
  message: string
  subject: string
}

export const DEFAULT_ADMIN_NOTIFICATION_EMAILS = [
  'contact@afroliya.be',
  'gabsekanga@gmail.com',
] as const
