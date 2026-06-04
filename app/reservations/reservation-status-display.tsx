import { Ban, CircleCheck, CircleX, Clock3, UserX, type LucideIcon } from 'lucide-react'

import type { ReservationStatus } from '@/lib/reservations'

type Variant = 'client' | 'restaurant'

type Props = {
  status: ReservationStatus
  variant?: Variant
}

export function ReservationStatusDisplay({ status, variant = 'client' }: Props) {
  const { Icon, badgeClass, iconClass, textClass } = getStatusVisual(status)
  const label = statusLabel(status, variant)

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${badgeClass}`}
        aria-hidden
      >
        <Icon className={`h-5 w-5 ${iconClass}`} strokeWidth={2} />
      </span>
      <span className={`font-medium ${textClass}`}>{label}</span>
    </span>
  )
}

function getStatusVisual(status: ReservationStatus): {
  Icon: LucideIcon
  badgeClass: string
  iconClass: string
  textClass: string
} {
  switch (status) {
    case 'pending':
      return {
        Icon: Clock3,
        badgeClass: 'bg-amber-100',
        iconClass: 'text-amber-700',
        textClass: 'text-amber-950',
      }
    case 'confirmed':
      return {
        Icon: CircleCheck,
        badgeClass: 'bg-green-100',
        iconClass: 'text-green-700',
        textClass: 'text-green-900',
      }
    case 'declined':
      return {
        Icon: CircleX,
        badgeClass: 'bg-amber-100',
        iconClass: 'text-amber-800',
        textClass: 'text-amber-950',
      }
    case 'cancelled':
      return {
        Icon: Ban,
        badgeClass: 'bg-neutral-200',
        iconClass: 'text-neutral-700',
        textClass: 'text-neutral-800',
      }
    case 'no_show':
      return {
        Icon: UserX,
        badgeClass: 'bg-red-100',
        iconClass: 'text-red-700',
        textClass: 'text-red-900',
      }
    default:
      return {
        Icon: Clock3,
        badgeClass: 'bg-neutral-100',
        iconClass: 'text-neutral-600',
        textClass: 'text-neutral-800',
      }
  }
}

function statusLabel(status: ReservationStatus, variant: Variant): string {
  if (variant === 'restaurant') {
    switch (status) {
      case 'pending':
        return 'En attente de votre réponse'
      case 'confirmed':
        return 'Confirmée'
      case 'declined':
        return 'Refusée'
      case 'cancelled':
        return 'Annulée par le client'
      case 'no_show':
        return 'No-show'
      default:
        return status
    }
  }

  switch (status) {
    case 'pending':
      return 'En attente de réponse du restaurant'
    case 'confirmed':
      return 'Confirmée'
    case 'declined':
      return 'Refusée par le restaurant'
    case 'cancelled':
      return 'Annulée'
    case 'no_show':
      return 'No-show'
    default:
      return status
  }
}
