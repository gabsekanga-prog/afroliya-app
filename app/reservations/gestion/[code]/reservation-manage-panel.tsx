'use client'

import { useState } from 'react'

import { updateReservationStatusAction } from './actions'
import {
  formatReservationDateFr,
  formatReservationTimeFr,
  type ReservationStatus,
} from '@/lib/reservations'
import { siteButtonPrimaryClass } from '@/lib/site-styles'

type ReservationView = {
  client_name: string
  client_email: string
  client_phone: string | null
  booking_date: string
  booking_time: string
  group_size: number
  remarks: string | null
  status: ReservationStatus
}

type Props = {
  publicCode: string
  restaurantName: string
  reservation: ReservationView
  expired: boolean
}

export function ReservationManagePanel({
  publicCode,
  restaurantName,
  reservation,
  expired,
}: Props) {
  const [status, setStatus] = useState(reservation.status)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleAction(next: 'confirmed' | 'declined') {
    setPending(true)
    setError('')
    const result = await updateReservationStatusAction(publicCode, next)
    setPending(false)
    if (result.error) {
      setError(result.error)
      if (result.status) setStatus(result.status)
      return
    }
    if (result.status) setStatus(result.status)
  }

  if (expired) {
    return <p className="text-lg text-red-800">Ce lien de gestion a expiré.</p>
  }

  return (
    <div className="max-w-xl space-y-6">
      <p className="text-lg text-neutral-700">
        Demande pour <strong>{restaurantName}</strong>
      </p>

      <dl className="space-y-2 text-lg text-neutral-800">
        <div>
          <dt className="font-semibold">Client</dt>
          <dd>{reservation.client_name}</dd>
        </div>
        <div>
          <dt className="font-semibold">E-mail</dt>
          <dd>{reservation.client_email}</dd>
        </div>
        {reservation.client_phone ? (
          <div>
            <dt className="font-semibold">Téléphone</dt>
            <dd>{reservation.client_phone}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-semibold">Date et heure</dt>
          <dd>
            {formatReservationDateFr(reservation.booking_date)},{' '}
            {formatReservationTimeFr(reservation.booking_time)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Personnes</dt>
          <dd>{reservation.group_size}</dd>
        </div>
        {reservation.remarks ? (
          <div>
            <dt className="font-semibold">Remarques</dt>
            <dd>{reservation.remarks}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-semibold">Statut</dt>
          <dd className="capitalize">{statusLabel(status)}</dd>
        </div>
      </dl>

      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-red-800">{error}</p> : null}

      {status === 'pending' ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction('confirmed')}
            className={siteButtonPrimaryClass}
          >
            {pending ? 'Traitement…' : 'Confirmer la réservation'}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction('declined')}
            className="inline-flex rounded-xl border border-neutral-300 bg-white px-6 py-3 text-lg text-neutral-900 transition hover:bg-neutral-50 disabled:opacity-60"
          >
            Refuser
          </button>
        </div>
      ) : (
        <p className="text-lg text-green-900">
          {status === 'confirmed'
            ? 'Réservation confirmée. Le client a été notifié par e-mail.'
            : 'Demande refusée. Le client a été notifié par e-mail.'}
        </p>
      )}
    </div>
  )
}

function statusLabel(status: ReservationStatus): string {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'confirmed':
      return 'Confirmée'
    case 'declined':
      return 'Refusée'
    case 'cancelled':
      return 'Annulée'
    case 'no_show':
      return 'No-show'
    default:
      return status
  }
}
