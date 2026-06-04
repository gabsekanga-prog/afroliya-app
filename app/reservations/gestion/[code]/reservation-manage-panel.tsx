'use client'

import { useState } from 'react'

import { formTextareaClassName } from '@/app/components/form-fields'
import {
  reservationPanelBoxClass,
  reservationPanelInnerClass,
} from '@/app/reservations/reservation-panel-box'
import { ReservationStatusDisplay } from '@/app/reservations/reservation-status-display'
import { reportReservationProblemAction } from '@/app/reservations/suivi/[code]/actions'
import {
  buildClientPhoneHref,
  ReservationManageActionsMenu,
} from '@/app/reservations/gestion/[code]/reservation-manage-actions-menu'
import { updateReservationStatusAction } from '@/app/reservations/gestion/[code]/actions'
import {
  formatReservationDateFr,
  formatReservationTimeFr,
  reservationLinkExpiredMessage,
  type ReservationStatus,
} from '@/lib/reservations'
import { siteBodyClass, siteHeading3Class } from '@/lib/site-styles'

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
  restaurantSlug: string
  reservation: ReservationView
  expired: boolean
}

export function ReservationManagePanel({
  publicCode,
  restaurantSlug,
  reservation,
  expired,
}: Props) {
  const [status, setStatus] = useState(reservation.status)
  const [declineMessage, setDeclineMessage] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const [activeForm, setActiveForm] = useState<'decline' | 'report' | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [pending, setPending] = useState(false)

  const canRespond = !expired && status === 'pending'
  const restaurantPageHref = `/restaurants/${restaurantSlug}`
  const clientPhoneHref = buildClientPhoneHref(reservation.client_phone)

  async function handleConfirm() {
    if (!canRespond) return

    setPending(true)
    setError('')
    setSuccessMessage('')
    const result = await updateReservationStatusAction(publicCode, 'confirmed')
    setPending(false)

    if (result.error) {
      setError(result.error)
      if (result.status) setStatus(result.status)
      return
    }

    if (result.status) setStatus(result.status)
    setSuccessMessage('Réservation confirmée. Le client a été notifié par e-mail.')
  }

  async function handleDecline() {
    const motif = declineMessage.trim()
    if (motif.length < 10) {
      setError('Indiquez un motif de refus (au moins 10 caractères).')
      return
    }

    setPending(true)
    setError('')
    setSuccessMessage('')
    const result = await updateReservationStatusAction(publicCode, 'declined', motif)
    setPending(false)

    if (result.error) {
      setError(result.error)
      if (result.status) setStatus(result.status)
      return
    }

    if (result.status) setStatus(result.status)
    setActiveForm(null)
    setDeclineMessage('')
    setSuccessMessage('Demande refusée. Le client a été notifié par e-mail.')
  }

  async function handleReport() {
    const description = reportMessage.trim()
    if (description.length < 10) {
      setError('Décrivez le problème en au moins 10 caractères.')
      return
    }

    setPending(true)
    setError('')
    setSuccessMessage('')
    const result = await reportReservationProblemAction(publicCode, description, 'restaurant')
    setPending(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setActiveForm(null)
    setReportMessage('')
    setSuccessMessage(
      'Merci, votre signalement a été transmis à l’équipe Afroliya.',
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
          <ReservationManageActionsMenu
            restaurantPageHref={restaurantPageHref}
            clientPhoneHref={clientPhoneHref}
            canRespond={canRespond}
            onConfirm={handleConfirm}
            onDecline={() => {
              setError('')
              setSuccessMessage('')
              setActiveForm('decline')
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
              placeholder="Descrivez le problème…"
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
        className={`${reservationPanelBoxClass} ${activeForm === 'decline' ? 'mt-8' : 'mt-4'}`}
      >
        <div className={reservationPanelInnerClass}>
          <div>
            <p className="text-lg font-semibold text-neutral-800">Statut</p>
            <div className="mt-2">
              <ReservationStatusDisplay status={status} variant="restaurant" />
            </div>
          </div>

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
          </dl>

          {status === 'pending' ? (
            <p className={siteBodyClass}>
              Acceptez ou refusez cette demande. Le client sera informé par e-mail de votre
              décision.
            </p>
          ) : null}

          {status === 'confirmed' ? (
            <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">
              Réservation confirmée. Le client a été notifié par e-mail.
            </p>
          ) : null}

          {status === 'declined' ? (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-lg text-amber-950">
              Demande refusée. Le client a été notifié par e-mail.
            </p>
          ) : null}

          {status === 'cancelled' ? (
            <p className="rounded-xl bg-neutral-100 px-3 py-2 text-lg text-neutral-800">
              Le client a annulé cette réservation.
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">{successMessage}</p>
          ) : null}

          {error && activeForm !== 'report' ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-red-800">{error}</p>
          ) : null}

          {activeForm === 'decline' && canRespond ? (
            <div className="space-y-4 rounded-xl border border-neutral-200 bg-stone-50/80 p-4">
              <p className={siteBodyClass}>
                Confirmez le refus. Le client recevra un e-mail avec votre motif.
              </p>
              <label className="block text-base font-semibold text-neutral-900">
                Motif de refus <span className="text-red-700">*</span>
                <textarea
                  value={declineMessage}
                  onChange={(e) => setDeclineMessage(e.target.value)}
                  className={`mt-2 ${formTextareaClassName}`}
                  rows={3}
                  maxLength={500}
                  required
                  placeholder="Créneau indisponible, complet ce soir-là…"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={pending}
                  onClick={handleDecline}
                  className="inline-flex rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-lg text-red-900 transition hover:bg-red-100 disabled:opacity-60"
                >
                  {pending ? 'Envoi…' : 'Confirmer le refus'}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setActiveForm(null)
                    setDeclineMessage('')
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
