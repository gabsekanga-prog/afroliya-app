'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  formInputClassName,
  formLabelClassName,
  formTextareaClassName,
} from '@/app/components/form-fields'
import { BookableDateField } from '@/app/components/bookable-date-field'
import {
  buildBookableDates,
  buildBookingTimeOptionsForDate,
  formatBookingTimeLabel,
  isBookableBookingDate,
} from '@/lib/reservation-opening-hours'
import type { RestaurantOpeningHoursDay } from '@/lib/restaurants'
import { RESTAURANT_STATS_CLICK_LABELS } from '@/lib/restaurant-stats-events'
import { trackRestaurantEvent } from '@/lib/restaurant-stats-client'
import {
  restaurantDetailPanelClass,
  siteBodyClass,
  siteButtonPrimaryClass,
} from '@/lib/site-styles'

type Props = {
  restaurantId: string
  restaurantName: string
  openingHours: RestaurantOpeningHoursDay[]
}

type FormState = {
  bookingDate: string
  bookingTime: string
  groupSize: string
  clientName: string
  remarks: string
  clientEmail: string
  clientPhone: string
}

const initialForm: FormState = {
  bookingDate: '',
  bookingTime: '',
  groupSize: '2',
  clientName: '',
  remarks: '',
  clientEmail: '',
  clientPhone: '',
}

const reservationWidgetShellClass = `mt-6 max-w-lg ${restaurantDetailPanelClass}`

export const reservationPanelClassName = reservationWidgetShellClass

const reservationWidgetSuccessClass =
  'mt-6 max-w-lg rounded-2xl border border-green-200/90 bg-white p-6 shadow-md shadow-neutral-900/[0.06] sm:p-8'

export function RestaurantReservationWidget({
  restaurantId,
  restaurantName,
  openingHours,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [form, setForm] = useState<FormState>(initialForm)
  const [verificationCode, setVerificationCode] = useState('')
  const [submittedPublicCode, setSubmittedPublicCode] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const bookableDates = useMemo(() => buildBookableDates(openingHours), [openingHours])
  const hasOpeningHours = openingHours.some((day) => day.slots.length > 0)
  const canBookOnline = !hasOpeningHours || bookableDates.length > 0

  const timeOptions = useMemo(() => {
    if (!form.bookingDate) return []
    return buildBookingTimeOptionsForDate(openingHours, form.bookingDate)
  }, [openingHours, form.bookingDate])

  function formatTimeLabel(time: string): string {
    if (!form.bookingDate) return time.replace(':', 'h')
    return formatBookingTimeLabel(openingHours, form.bookingDate, time)
  }

  function handleBookingDateChange(value: string) {
    setError('')
    updateField('bookingDate', value)
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value }
      if (key === 'bookingDate' && typeof value === 'string') {
        const times = buildBookingTimeOptionsForDate(openingHours, value)
        next.bookingTime = times.includes(current.bookingTime) ? current.bookingTime : (times[0] ?? '')
      }
      return next
    })
  }

  async function requestEmailCode(): Promise<boolean> {
    const response = await fetch('/api/reservations/email-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.clientEmail.trim().toLowerCase() }),
    })
    const data = (await response.json()) as { error?: string; alreadyVerified?: boolean }
    if (!response.ok) {
      setError(data.error ?? 'Envoi du code impossible.')
      return false
    }
    if (data.alreadyVerified) {
      return await submitReservation()
    }
    setStep(4)
    return true
  }

  async function verifyEmailAndSubmit() {
    setPending(true)
    setError('')
    const response = await fetch('/api/reservations/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.clientEmail.trim().toLowerCase(),
        code: verificationCode.trim(),
      }),
    })
    const data = (await response.json()) as { error?: string }
    if (!response.ok) {
      setPending(false)
      setError(data.error ?? 'Code invalide.')
      return
    }
    await submitReservation()
  }

  async function submitReservation() {
    setPending(true)
    setError('')
    const response = await fetch(`/api/restaurants/${restaurantId}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        groupSize: Number(form.groupSize),
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
        remarks: form.remarks,
      }),
    })
    const data = (await response.json()) as { error?: string; publicCode?: string }
    setPending(false)
    if (!response.ok) {
      setError(data.error ?? 'Envoi impossible.')
      return false
    }
    if (data.publicCode) {
      setSubmittedPublicCode(data.publicCode)
    }
    void trackRestaurantEvent({
      restaurantId,
      eventType: 'click',
      eventKey: RESTAURANT_STATS_CLICK_LABELS.reserveOnline,
    })
    setStep(5)
    return true
  }

  async function handleNext() {
    setError('')

    if (step === 1) {
      if (!form.bookingDate || !form.bookingTime || !form.groupSize) {
        setError('Renseignez la date, l’heure et le nombre de personnes.')
        return
      }
      if (hasOpeningHours && !isBookableBookingDate(openingHours, form.bookingDate)) {
        setError('Le restaurant est fermé à cette date. Choisissez un jour d’ouverture.')
        return
      }
      if (timeOptions.length > 0 && !timeOptions.includes(form.bookingTime)) {
        setError('Choisissez un créneau dans les horaires d’ouverture.')
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      if (form.clientName.trim().length < 2) {
        setError('Indiquez votre nom.')
        return
      }
      setStep(3)
      return
    }

    if (step === 3) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail.trim())) {
        setError('Indiquez une adresse e-mail valide.')
        return
      }
      setPending(true)
      await requestEmailCode()
      setPending(false)
      return
    }

    if (step === 4) {
      if (!/^\d{6}$/.test(verificationCode.trim())) {
        setError('Saisissez le code à 6 chiffres reçu par e-mail.')
        return
      }
      await verifyEmailAndSubmit()
    }
  }

  function handleBack() {
    setError('')
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
    else if (step === 4) setStep(3)
  }

  if (step === 5) {
    const suiviHref = submittedPublicCode
      ? `/reservations/suivi/${submittedPublicCode}`
      : null

    return (
      <div className={reservationWidgetSuccessClass}>
        <h3 className="text-xl font-bold text-green-950">Demande envoyée</h3>
        <p className={`mt-3 ${siteBodyClass}`}>
          Votre demande a bien été envoyée au restaurant <strong>{restaurantName}</strong>.
          Vous recevrez une confirmation par e-mail dès que le restaurant aura répondu.
        </p>
        {suiviHref ? (
          <Link href={suiviHref} className={`mt-6 inline-flex ${siteButtonPrimaryClass}`}>
            Voir ma réservation
          </Link>
        ) : null}
        {suiviHref ? (
          <p className={`mt-3 ${siteBodyClass}`}>
            Vous pourrez aussi annuler votre demande depuis cette page si vos plans changent.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={reservationWidgetShellClass}>
      {!canBookOnline ? (
        <p className={siteBodyClass}>
          Les réservations en ligne ne sont pas disponibles pour le moment : aucun créneau
          n’est ouvert dans les prochaines semaines. Contactez le restaurant directement.
        </p>
      ) : (
        <>
      <p className="mb-6 text-base font-medium text-neutral-500">Étape {step} sur 4</p>

      {step === 1 ? (
        <div className="space-y-4">
          <label className={formLabelClassName}>
            Date
            <BookableDateField
              openingHours={openingHours}
              value={form.bookingDate}
              onChange={handleBookingDateChange}
            />
          </label>
          <label className={formLabelClassName}>
            Heure
            {hasOpeningHours ? (
              <select
                value={form.bookingTime}
                onChange={(e) => updateField('bookingTime', e.target.value)}
                className={formInputClassName}
                required
                disabled={!form.bookingDate || timeOptions.length === 0}
              >
                <option value="">
                  {!form.bookingDate
                    ? 'Choisissez d’abord une date'
                    : timeOptions.length === 0
                      ? 'Aucun créneau disponible'
                      : 'Choisir une heure'}
                </option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {formatTimeLabel(time)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="time"
                value={form.bookingTime}
                onChange={(e) => updateField('bookingTime', e.target.value)}
                className={formInputClassName}
                required
              />
            )}
          </label>
          <label className={formLabelClassName}>
            Nombre de personnes
            <input
              type="number"
              min={1}
              max={30}
              value={form.groupSize}
              onChange={(e) => updateField('groupSize', e.target.value)}
              className={formInputClassName}
              required
            />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <label className={formLabelClassName}>
            Nom
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              className={formInputClassName}
              autoComplete="name"
              required
            />
          </label>
          <label className={formLabelClassName}>
            Envies / remarques <span className="font-normal text-neutral-500">(optionnel)</span>
            <textarea
              value={form.remarks}
              onChange={(e) => updateField('remarks', e.target.value)}
              className={formTextareaClassName}
              rows={4}
              maxLength={500}
              placeholder="Allergie, anniversaire, terrasse…"
            />
          </label>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <label className={formLabelClassName}>
            E-mail
            <input
              type="email"
              value={form.clientEmail}
              onChange={(e) => updateField('clientEmail', e.target.value)}
              className={formInputClassName}
              autoComplete="email"
              required
            />
          </label>
          <label className={formLabelClassName}>
            Numéro de téléphone <span className="font-normal text-neutral-500">(optionnel)</span>
            <input
              type="tel"
              value={form.clientPhone}
              onChange={(e) => updateField('clientPhone', e.target.value)}
              className={formInputClassName}
              autoComplete="tel"
            />
          </label>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4">
          <p className={siteBodyClass}>
            Un code de vérification a été envoyé à <strong>{form.clientEmail}</strong>.
          </p>
          <label className={formLabelClassName}>
            Code de vérification
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className={`${formInputClassName} tracking-[0.3em]`}
              placeholder="000000"
              required
            />
          </label>
          <button
            type="button"
            disabled={pending}
            onClick={async () => {
              setPending(true)
              setError('')
              await requestEmailCode()
              setPending(false)
            }}
            className="text-lg text-[#8D5524] underline underline-offset-2"
          >
            Renvoyer le code
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-lg text-red-800">{error}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 1 && step < 5 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={pending}
            className="inline-flex rounded-xl border border-neutral-300 bg-white px-6 py-3 text-lg text-neutral-900 transition hover:bg-neutral-50 disabled:opacity-60"
          >
            Retour
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleNext}
          disabled={pending || !canBookOnline}
          className={`inline-flex ${siteButtonPrimaryClass} disabled:opacity-60`}
        >
          {pending
            ? 'Envoi…'
            : step === 3
              ? 'Continuer'
              : step === 4
                ? 'Valider et envoyer'
                : 'Continuer'}
        </button>
      </div>
        </>
      )}
    </div>
  )
}
