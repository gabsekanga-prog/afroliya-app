'use client'

import { useState } from 'react'

import { formInputClassName, formLabelClassName } from '@/app/components/form-fields'
import { supabase } from '@/lib/supabase'
import { siteBodyRelaxedClass, siteButtonPrimaryClass, siteHeading2Class, siteSectionPaddingClass } from '@/lib/site-styles'

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
    <ul className={`mt-5 space-y-2 ${siteBodyRelaxedClass} sm:mt-6`}>
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Ne ratez aucune nouveauté</span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Gagnez des repas et promos</span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-brand shrink-0 font-semibold" aria-hidden>
          ✓
        </span>
        <span>Participez à des événements exclusifs</span>
      </li>
    </ul>
  )

  const formInner = (
    <form className="grid gap-4" onSubmit={handleCommunitySubmit}>
      <label className={formLabelClassName}>
        E-mail
        <input
          type="email"
          value={communityEmail}
          onChange={(event) => setCommunityEmail(event.target.value)}
          placeholder="Entrez votre e-mail"
          required
          className={formInputClassName}
        />
      </label>

      <div>
        <button
          type="submit"
          disabled={isSubmittingCommunity}
          className={`inline-flex ${siteButtonPrimaryClass} disabled:opacity-70`}
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


  return (
    <section id="communaute" className={`w-full bg-[#f8f1ea] ${siteSectionPaddingClass}`}>
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="max-w-2xl">
            <h2 className={siteHeading2Class}>
              Rejoignez la communauté Afroliya
            </h2>
            {benefitsList}
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
