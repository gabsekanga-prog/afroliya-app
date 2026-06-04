'use client'

import { useState } from 'react'

import {
  reservationPanelBoxClass,
  reservationPanelInnerClass,
} from '@/app/reservations/reservation-panel-box'
import { ReservationStatusDisplay } from '@/app/reservations/reservation-status-display'

import { formTextareaClassName } from '@/app/components/form-fields'
import {
  buildReservationDirectionsHref,
  buildReservationPhoneHref,
  ReservationClientActionsMenu,
  type ReservationRestaurantActions,
} from '@/app/reservations/suivi/[code]/reservation-client-actions-menu'
import {
  cancelReservationByClientAction,
  reportReservationProblemAction,
} from '@/app/reservations/suivi/[code]/actions'
import {
  formatReservationDateFr,
  formatReservationTimeFr,
  reservationLinkExpiredMessage,
  type ReservationStatus,
} from '@/lib/reservations'
import { siteBodyClass, siteHeading3Class } from '@/lib/site-styles'

type ReservationView = {
  client_name: string
  booking_date: string
  booking_time: string
  group_size: number
  remarks: string | null
  status: ReservationStatus
}

type Props = {
  publicCode: string
  restaurantName: string
  restaurant: ReservationRestaurantActions
  reservation: ReservationView
  expired: boolean
}

export function ReservationClientPanel({
  publicCode,
  restaurantName,
  restaurant,
  reservation,
  expired,
}: Props) {
  const [status, setStatus] = useState(reservation.status)
  const [cancelMessage, setCancelMessage] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const [activeForm, setActiveForm] = useState<'cancel' | 'report' | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [pending, setPending] = useState(false)

  const canCancel = !expired && (status === 'pending' || status === 'confirmed')
  const restaurantPageHref = `/restaurants/${restaurant.slug}`
  const directionsHref = buildReservationDirectionsHref(restaurant)
  const phoneHref = buildReservationPhoneHref(restaurant.phone)

  async function handleCancel() {
    const motif = cancelMessage.trim()
    if (motif.length < 10) {
      setError('Indiquez un motif d’annulation (au moins 10 caractères).')
      return
    }

    setPending(true)
    setError('')
    setSuccessMessage('')
    const result = await cancelReservationByClientAction(publicCode, motif)
    setPending(false)

    if (result.error) {
      setError(result.error)
      if (result.status) setStatus(result.status)
      return
    }

    if (result.status) setStatus(result.status)
    setActiveForm(null)
    setCancelMessage('')
    setSuccessMessage('Votre réservation a été annulée. Le restaurant en a été informé.')
  }

  async function handleReport() {
    setPending(true)
    setError('')
    setSuccessMessage('')
    const result = await reportReservationProblemAction(publicCode, reportMessage)
    setPending(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setActiveForm(null)
    setReportMessage('')
    setSuccessMessage(
      'Merci, votre signalement a été transmis à l’équipe Afroliya. Nous reviendrons vers vous si nécessaire.',
    )
  }

  if (expired) {
    return (
      <div className={`mt-8 ${reservationPanelBoxClass}`}>
        <p className="text-lg text-red-800">{reservationLinkExpiredMessage}</p>
      </div>
    )
  }

  return (
    <>
      {!activeForm ? (
        <div className="mt-8 flex justify-start">
          <ReservationClientActionsMenu
            restaurantPageHref={restaurantPageHref}
            directionsHref={directionsHref}
            phoneHref={phoneHref}
            canCancel={canCancel}
            onCancel={() => {
              setError('')
              setSuccessMessage('')
              setActiveForm('cancel')
            }}
            onReportProblem={() => {
              setError('')
              setSuccessMessage('')
              setActiveForm('report')
            }}
          />
        </div>
      ) : null}

      {activeForm === 'report' ? (
        <div className={`mt-8 space-y-4 ${reservationPanelBoxClass}`}>
          <h2 className={siteHeading3Class}>Signaler un problème</h2>
          <p className={siteBodyClass}>
            Un problème avec la réservation ? Signalez-le à l&apos;équipe Afroliya.
          </p>
          <label className="block text-base font-semibold text-neutral-900">
            Description du problème
            <textarea
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              className={`mt-2 ${formTextareaClassName}`}
              rows={4}
              maxLength={1000}
              required
              placeholder="Décrivez le problème…"
            />
          </label>
          {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-red-800">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={handleReport}
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-6 py-3 text-lg text-neutral-900 transition hover:bg-[#faf6f2] disabled:opacity-60"
            >
              {pending ? 'Envoi…' : 'Envoyer le signalement'}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setActiveForm(null)
                setReportMessage('')
                setError('')
              }}
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-6 py-3 text-lg text-neutral-900 transition hover:bg-neutral-50 disabled:opacity-60"
            >
              Retour
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`${reservationPanelBoxClass} ${activeForm === 'cancel' ? 'mt-8' : 'mt-4'}`}
      >
        <div className={reservationPanelInnerClass}>
          <div>
            <p className="text-lg font-semibold text-neutral-800">Statut</p>
            <div className="mt-2">
              <ReservationStatusDisplay status={status} variant="client" />
            </div>
          </div>

          <dl className="space-y-2 text-lg text-neutral-800">
        <div>
          <dt className="font-semibold">Restaurant</dt>
          <dd>{restaurantName}</dd>
        </div>
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
      </dl>

      {status === 'pending' ? (
        <p className={siteBodyClass}>
          Le restaurant n’a pas encore répondu. Vous serez informé par e-mail dès qu’il aura
          confirmé ou refusé votre demande.
        </p>
      ) : null}

      {status === 'confirmed' ? (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">
          Votre réservation est confirmée par le restaurant.
        </p>
      ) : null}

      {status === 'declined' ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-lg text-amber-950">
          Le restaurant n’a pas pu accepter cette demande.
        </p>
      ) : null}

      {status === 'cancelled' ? (
        <p className="rounded-xl bg-neutral-100 px-3 py-2 text-lg text-neutral-800">
          Cette réservation a été annulée.
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">{successMessage}</p>
      ) : null}

      {error && activeForm !== 'report' ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-red-800">{error}</p>
      ) : null}

      {activeForm === 'cancel' && canCancel ? (
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-stone-50/80 p-4">
          <p className={siteBodyClass}>
            Confirmez l’annulation. Le restaurant sera informé par e-mail.
          </p>
          <label className="block text-base font-semibold text-neutral-900">
            Motif d’annulation <span className="text-red-700">*</span>
            <textarea
              value={cancelMessage}
              onChange={(e) => setCancelMessage(e.target.value)}
              className={`mt-2 ${formTextareaClassName}`}
              rows={3}
              maxLength={500}
              required
              placeholder="Imprévu, changement de programme…"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={handleCancel}
              className="inline-flex rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-lg text-red-900 transition hover:bg-red-100 disabled:opacity-60"
            >
              {pending ? 'Annulation…' : 'Confirmer l’annulation'}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setActiveForm(null)
                setCancelMessage('')
                setError('')
              }}
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-6 py-3 text-lg text-neutral-900 transition hover:bg-neutral-50 disabled:opacity-60"
            >
              Retour
            </button>
          </div>
        </div>
      ) : null}
        </div>
      </div>
    </>
  )
}

