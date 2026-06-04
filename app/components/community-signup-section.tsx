'use client'

import { useState } from 'react'

import { formInputClassName, formLabelClassName } from '@/app/components/form-fields'
import { SiteChecklist } from '@/app/components/site-checklist'
import { supabase } from '@/lib/supabase'
import {
  siteButtonPrimaryClass,
  siteHeading2Class,
  siteSubtitleLeadClass,
  siteSectionContentFirstClass,
  siteSectionMediaSecondClass,
  communitySignupSectionClass,
  communitySignupSectionInnerClass,
  siteSectionColumnImageClass,
  siteSectionInnerClass,
} from '@/lib/site-styles'

type CommunitySignupSectionProps = {
  /** `full` : section pleine largeur. `guide` : bloc aligné sur les sous-sections d’un guide. */
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
    <section
      id="communaute"
      className={
        variant === 'guide'
          ? `${communitySignupSectionClass} scroll-mt-24`
          : communitySignupSectionClass
      }
    >
      <div
        className={
          variant === 'guide'
            ? `${siteSectionInnerClass} grid items-center gap-8 pt-8 sm:pt-10 lg:grid-cols-2 lg:gap-10`
            : `${communitySignupSectionInnerClass} grid items-center gap-8 lg:grid-cols-2 lg:gap-10`
        }
      >
        <div className={siteSectionContentFirstClass}>
          <div className="max-w-2xl">
            <h2 className={siteHeading2Class}>
            Rejoignez la communauté Afroliya
            </h2>
            <p className={siteSubtitleLeadClass}>
            Découvertes chaque semaine | Repas gratuits à gagner | Réductions exclusives
            </p>
            <SiteChecklist
              items={[]}
            />
          </div>

          <div className="mt-8">{formInner}</div>
        </div>

        <div
          className={`${siteSectionMediaSecondClass} overflow-hidden rounded-2xl border border-neutral-200 shadow-md`}
        >
          <img
            src="/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp"
            alt="Membre de la communauté Afroliya profitant d'un repas dans un restaurant africain"
            className={siteSectionColumnImageClass}
          />
        </div>
      </div>
    </section>
  )
}
