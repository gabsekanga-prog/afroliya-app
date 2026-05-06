'use client'

import { useState } from 'react'

import { supabase } from '@/lib/supabase'

type CommunitySignupSectionProps = {
  /** `full` : section pleine largeur (Concept, liste des guides). `guide` : bloc aligné sur les sous-sections d’un guide. */
  variant?: 'full' | 'guide'
}

export function CommunitySignupSection({
  variant = 'full',
}: CommunitySignupSectionProps) {
  const [communityEmail, setCommunityEmail] = useState('')
  const [communityMessage, setCommunityMessage] = useState('')
  const [communityMessageType, setCommunityMessageType] = useState<
    'success' | 'error' | null
  >(null)
  const [isSubmittingCommunity, setIsSubmittingCommunity] = useState(false)

  const handleCommunitySubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const normalizedEmail = communityEmail.trim().toLowerCase()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(normalizedEmail)) {
      setCommunityMessage('Veuillez entrer une adresse e-mail valide.')
      setCommunityMessageType('error')
      return
    }

    setIsSubmittingCommunity(true)
    setCommunityMessage('')
    setCommunityMessageType(null)

    if (!supabase) {
      setCommunityMessage(
        'Supabase n’est pas configuré : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local.',
      )
      setCommunityMessageType('error')
      setIsSubmittingCommunity(false)
      return
    }

    const { error: insertError } = await supabase
      .from('newsletter')
      .insert({ email: normalizedEmail })

    if (insertError) {
      if (insertError.code === '23505') {
        setCommunityMessage('Vous êtes déjà membre de la communauté.')
        setCommunityMessageType('error')
      } else if (
        insertError.code === '42501' ||
        insertError.message.toLowerCase().includes('row-level security')
      ) {
        setCommunityMessage(
          "Configuration Supabase requise : autorisez l'insertion anonyme dans la table newsletter.",
        )
        setCommunityMessageType('error')
      } else {
        setCommunityMessage('Une erreur est survenue. Merci de réessayer.')
        setCommunityMessageType('error')
      }
      setIsSubmittingCommunity(false)
      return
    }

    setCommunityMessage('Bienvenue dans la communauté Afroliya.')
    setCommunityMessageType('success')
    setCommunityEmail('')
    setIsSubmittingCommunity(false)
  }

  const benefitsList = (
    <ul className="mt-5 space-y-2 text-lg leading-relaxed text-neutral-600 sm:mt-6">
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Découvrez des adresses</span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Gagnez des repas gratuits</span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Profitez des offres spéciales</span>
      </li>
    </ul>
  )

  const formInner = (
    <form className="grid gap-4" onSubmit={handleCommunitySubmit}>
      <label className="flex flex-col gap-2 text-lg font-semibold text-neutral-800">
        E-mail
        <input
          type="email"
          value={communityEmail}
          onChange={(event) => setCommunityEmail(event.target.value)}
          placeholder="Entrez votre e-mail"
          required
          className="rounded-xl border border-neutral-300 bg-white px-4 py-3 font-normal text-neutral-900 placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <div>
        <button
          type="submit"
          disabled={isSubmittingCommunity}
          className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a] disabled:opacity-70"
        >
          {isSubmittingCommunity
            ? 'Envoi en cours...'
            : 'Rejoindre la communauté'}
        </button>
      </div>

      {communityMessage && (
        <p
          className={`rounded-xl px-3 py-2 text-lg font-semibold ${
            communityMessageType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {communityMessage}
        </p>
      )}
    </form>
  )

  const benefitsListFull = (
    <ul className="mt-3 space-y-2 text-lg text-neutral-600">
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Découvrez des adresses</span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Gagnez des repas gratuits</span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Profitez des offres spéciales</span>
      </li>
    </ul>
  )

  if (variant === 'guide') {
    return (
      <>
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          Rejoignez la communauté Afroliya
        </h2>

        <div className="relative mt-5 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 sm:mt-6">
          <img
            src="/images/Nourriture%20congolaise.jpg"
            alt="Plat de nourriture congolaise"
            className="h-56 w-full object-cover sm:h-72 md:h-80"
          />
        </div>

        {benefitsList}
        <div className="mt-6 sm:mt-8">{formInner}</div>
      </>
    )
  }

  return (
    <section id="communaute" className="w-full bg-[#f8f1ea] py-14 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
              Rejoignez la communauté Afroliya
            </h2>
            {benefitsListFull}
          </div>

          <div className="mt-8">{formInner}</div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-md">
          <img
            src="/images/Nourriture%20congolaise.jpg"
            alt="Plat de nourriture congolaise"
            className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
          />
        </div>
      </div>
    </section>
  )
}
