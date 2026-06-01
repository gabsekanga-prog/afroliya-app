'use client'

import { useState } from 'react'

import { formInputClassName, formLabelClassName, formTextareaClassName } from '@/app/components/form-fields'
import { supabase } from '@/lib/supabase'
import {
  siteBodyClass,
  siteButtonPrimarySmClass,
  siteGuideContentHeadingClass,
} from '@/lib/site-styles'

type Props = {
  guideSlug?: string
}

export function SuggestAddressSection({ guideSlug }: Props) {
  const [restaurantName, setRestaurantName] = useState('')
  const [commune, setCommune] = useState('')
  const [details, setDetails] = useState('')
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = restaurantName.trim()
    const area = commune.trim()

    if (name.length < 2 || area.length < 2) {
      setMessage('Indiquez au minimum le nom du restaurant et le quartier.')
      setMessageType('error')
      return
    }

    if (!supabase) {
      setMessage('Service temporairement indisponible.')
      setMessageType('error')
      return
    }

    setPending(true)
    setMessage('')
    setMessageType(null)

    const { error } = await supabase.from('address_suggestions').insert({
      guide_slug: guideSlug?.trim() || null,
      restaurant_name: name,
      commune: area,
      details: details.trim() || null,
      email: email.trim() || null,
    })

    if (error) {
      setMessage('Une erreur est survenue. Merci de réessayer.')
      setMessageType('error')
      setPending(false)
      return
    }

    setRestaurantName('')
    setCommune('')
    setDetails('')
    setEmail('')
    setMessage('Merci — nous étudions chaque pépite proposée par la communauté.')
    setMessageType('success')
    setPending(false)
  }

  return (
    <aside className="mt-12 rounded-2xl border border-neutral-200/90 bg-stone-50 p-6 sm:p-8">
      <h2 className={siteGuideContentHeadingClass}>Suggérer une adresse</h2>
      <p className={`mt-3 ${siteBodyClass}`}>
        Une pépite cachée à Bruxelles ou aux alentours ? Partagez-la avec la
        communauté Afroliya.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className={formLabelClassName}>
          Nom du restaurant
          <input
            type="text"
            name="restaurant_name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className={formInputClassName}
            required
            minLength={2}
            autoComplete="off"
          />
        </label>

        <label className={formLabelClassName}>
          Quartier / commune
          <input
            type="text"
            name="commune"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            className={formInputClassName}
            required
            minLength={2}
            autoComplete="off"
          />
        </label>

        <label className={formLabelClassName}>
          Pourquoi c&apos;est une pépite ?{' '}
          <span className="font-normal text-neutral-500">(optionnel)</span>
          <textarea
            name="details"
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className={formTextareaClassName}
          />
        </label>

        <label className={formLabelClassName}>
          Votre e-mail{' '}
          <span className="font-normal text-neutral-500">(optionnel)</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={formInputClassName}
            autoComplete="email"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className={siteButtonPrimarySmClass}
        >
          {pending ? 'Envoi…' : 'Envoyer ma suggestion'}
        </button>

        {message ? (
          <p
            className={
              messageType === 'success'
                ? 'text-sm text-green-800'
                : 'text-sm text-amber-800'
            }
            role="status"
          >
            {message}
          </p>
        ) : null}
      </form>
    </aside>
  )
}
