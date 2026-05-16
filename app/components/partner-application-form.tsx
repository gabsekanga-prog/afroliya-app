'use client'

import { useState } from 'react'

import {
  FormSelect,
  formInputClassName,
  formLabelClassName,
  formTextareaClassName,
} from '@/app/components/form-fields'
import { supabase } from '@/lib/supabase'

const OFFERS = ['basique', 'standard', 'premium'] as const
type Offer = (typeof OFFERS)[number]

function isOffer(value: string): value is Offer {
  return OFFERS.includes(value as Offer)
}

export function PartnerApplicationForm() {
  const [formKey, setFormKey] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const restaurant = String(data.get('restaurant') ?? '').trim()
    const restaurantDetails = String(data.get('restaurant_details') ?? '').trim()
    const offerRaw = String(data.get('offer') ?? '')
    const contactName = String(data.get('contact_name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const email = String(data.get('email') ?? '')
      .trim()
      .toLowerCase()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!restaurant || !contactName || !phone || !emailPattern.test(email)) {
      setMessage('Veuillez remplir correctement tous les champs obligatoires.')
      setMessageType('error')
      return
    }

    if (!isOffer(offerRaw)) {
      setMessage('Veuillez sélectionner une offre valide.')
      setMessageType('error')
      return
    }

    setIsSubmitting(true)
    setMessage('')
    setMessageType(null)

    if (!supabase) {
      setMessage(
        'Supabase n’est pas configuré : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local.',
      )
      setMessageType('error')
      setIsSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('partner_applications').insert({
      restaurant,
      restaurant_details: restaurantDetails || null,
      offer: offerRaw,
      contact_name: contactName,
      phone,
      email,
    })

    if (insertError) {
      if (
        insertError.code === '42501' ||
        insertError.message.toLowerCase().includes('row-level security')
      ) {
        setMessage(
          "Configuration Supabase requise : autorisez l'insertion anonyme dans la table partner_applications.",
        )
      } else {
        setMessage('Une erreur est survenue. Merci de réessayer.')
      }
      setMessageType('error')
      setIsSubmitting(false)
      return
    }

    setMessage('Merci ! Votre demande a bien été envoyée. Nous vous recontactons rapidement.')
    setMessageType('success')
    form.reset()
    setFormKey((key) => key + 1)
    setIsSubmitting(false)
  }

  return (
    <form
      key={formKey}
      className="mt-10 flex w-full flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <label className={formLabelClassName}>
        Restaurant
        <input
          className={formInputClassName}
          type="text"
          name="restaurant"
          required
          placeholder="Nom du restaurant"
          autoComplete="organization"
        />
      </label>
      <label className={formLabelClassName}>
        Détails du restaurant
        <textarea
          className={formTextareaClassName}
          name="restaurant_details"
          rows={4}
          placeholder="Cuisine, quartier, capacité, horaires…"
        />
      </label>
      <label className={formLabelClassName}>
        Offre souhaitée
        <FormSelect name="offer" required defaultValue="basique">
          <option value="basique">Basique</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </FormSelect>
      </label>
      <label className={formLabelClassName}>
        Nom et prénom
        <input
          className={formInputClassName}
          type="text"
          name="contact_name"
          required
          placeholder="Votre nom"
          autoComplete="name"
        />
      </label>
      <label className={formLabelClassName}>
        Téléphone
        <input
          className={formInputClassName}
          type="tel"
          name="phone"
          required
          placeholder="+32 …"
          autoComplete="tel"
        />
      </label>
      <label className={formLabelClassName}>
        E-mail
        <input
          className={formInputClassName}
          type="email"
          name="email"
          required
          placeholder="vous@exemple.com"
          autoComplete="email"
        />
      </label>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a] disabled:opacity-70 sm:w-auto sm:self-start"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </div>

      {message && (
        <p
          className={`rounded-xl px-3 py-2 text-lg font-semibold ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
