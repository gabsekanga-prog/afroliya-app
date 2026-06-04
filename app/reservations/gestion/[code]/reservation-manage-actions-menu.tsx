'use client'

import {
  ReservationActionsDropdown,
  type ReservationMenuEntry,
} from '@/app/reservations/reservation-actions-dropdown'

type Props = {
  restaurantPageHref: string
  clientPhoneHref: string | null
  canRespond: boolean
  onConfirm: () => void
  onDecline: () => void
  onReportProblem: () => void
}

export function ReservationManageActionsMenu({
  restaurantPageHref,
  clientPhoneHref,
  canRespond,
  onConfirm,
  onDecline,
  onReportProblem,
}: Props) {
  const entries: ReservationMenuEntry[] = [
    {
      kind: 'button',
      id: 'confirm',
      label: 'Confirmer la réservation',
      onClick: onConfirm,
      disabled: !canRespond,
    },
    {
      kind: 'button',
      id: 'decline',
      label: 'Refuser la demande',
      onClick: onDecline,
      disabled: !canRespond,
      destructive: true,
    },
    {
      kind: 'link',
      id: 'call-client',
      label: 'Appeler le client',
      href: clientPhoneHref ?? '#',
      disabled: !clientPhoneHref,
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

export function buildClientPhoneHref(phone: string | null): string | null {
  const raw = phone?.trim()
  if (!raw) return null
  const normalized = raw.replace(/[^\d+]/g, '')
  if (!normalized) return null
  return `tel:${normalized}`
}
