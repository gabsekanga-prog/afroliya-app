'use client'

import {
  ReservationActionsDropdown,
  type ReservationMenuEntry,
} from '@/app/reservations/reservation-actions-dropdown'
import type { ReservationRestaurantActions } from './reservation-client-actions-menu-types'

export type { ReservationRestaurantActions } from './reservation-client-actions-menu-types'

type Props = {
  restaurantPageHref: string
  directionsHref: string | null
  phoneHref: string | null
  canCancel: boolean
  onCancel: () => void
  onReportProblem: () => void
}

export function ReservationClientActionsMenu({
  restaurantPageHref,
  directionsHref,
  phoneHref,
  canCancel,
  onCancel,
  onReportProblem,
}: Props) {
  const entries: ReservationMenuEntry[] = [
    {
      kind: 'button',
      id: 'cancel',
      label: 'Annuler ma réservation',
      onClick: onCancel,
      disabled: !canCancel,
      destructive: true,
    },
    {
      kind: 'link',
      id: 'directions',
      label: 'Voir l’itinéraire',
      href: directionsHref ?? '#',
      external: true,
      disabled: !directionsHref,
    },
    {
      kind: 'link',
      id: 'call',
      label: 'Appeler le restaurant',
      href: phoneHref ?? '#',
      disabled: !phoneHref,
    },
    {
      kind: 'button',
      id: 'report',
      label: 'Signaler un problème',
      onClick: onReportProblem,
    },
    {
      kind: 'link',
      id: 'restaurant',
      label: 'Voir la fiche du restaurant',
      href: restaurantPageHref,
    },
  ]

  return <ReservationActionsDropdown entries={entries} />
}

export function buildReservationDirectionsHref(
  restaurant: ReservationRestaurantActions,
): string | null {
  const mapsLink = restaurant.googleMapsLink?.trim()
  if (mapsLink) return mapsLink

  const address = restaurant.address?.trim()
  if (!address) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export function buildReservationPhoneHref(phone: string | null): string | null {
  const raw = phone?.trim()
  if (!raw) return null
  const normalized = raw.replace(/[^\d+]/g, '')
  if (!normalized) return null
  return `tel:${normalized}`
}
