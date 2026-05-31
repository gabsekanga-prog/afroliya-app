'use client'

import { useMemo, useState } from 'react'

import { formTextareaClassName } from '@/app/components/form-fields'
import type { RestaurantAdmin } from '@/lib/restaurants-admin'

function buildGeminiPrompt(
  reviewExcerpts: string,
  googleMapsLink: string,
): string {
  const excerpts = reviewExcerpts.trim()

  if (excerpts) {
    return `Voici des avis Google réels (ne pas en inventer d'autres) :

${excerpts}

Résume en 2 phrases en français les points positifs qui reviennent dans CE texte.
Règles : uniquement ce qui est écrit ci-dessus, ton factuel, max 280 caractères, un paragraphe, pas de liste.`
  }

  const link = googleMapsLink.trim() || 'https://maps.google.com/...'

  return `Lien fiche Google : ${link}

Je vais coller ci-dessous des extraits d'avis copiés depuis cette fiche.

Quand je les aurai collés, résume-les en 2 phrases (français, points positifs récurrents, factuel, max 280 car., un paragraphe).
N'invente rien qui ne figure pas dans mes extraits.

En attendant mes extraits, réponds seulement : Collez vos avis Google ci-dessus.`
}

type Props = {
  restaurant: RestaurantAdmin | null | undefined
}

export function GoogleReviewsGeminiPrompt({ restaurant }: Props) {
  const [copied, setCopied] = useState(false)
  const [reviewExcerpts, setReviewExcerpts] = useState('')

  const prompt = useMemo(
    () =>
      buildGeminiPrompt(
        reviewExcerpts,
        restaurant?.google_maps_link?.trim() ?? '',
      ),
    [reviewExcerpts, restaurant?.google_maps_link],
  )

  const hasExcerpts = reviewExcerpts.trim().length > 0

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <details className="rounded-xl border border-neutral-200 bg-stone-50/80" open>
      <summary className="cursor-pointer px-4 py-3 text-base font-semibold text-neutral-800">
        Prompt Gemini — résumé des avis positifs
      </summary>
      <div className="space-y-3 border-t border-neutral-200 px-4 py-3">
        <p className="text-sm text-neutral-600">
          <strong className="font-semibold text-neutral-800">Méthode :</strong>{' '}
          copiez 5 avis positifs depuis Google Maps dans le champ ci-dessous, copiez le
          prompt, collez-le dans{' '}
          <a
            href="https://gemini.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#c9a882] underline-offset-2 hover:text-neutral-900"
          >
            Gemini
          </a>
          , puis reportez le résumé dans le champ « Résumé des avis Google ».
        </p>
        <label className="block text-sm font-semibold text-neutral-800">
          Extraits d&apos;avis Google
          <textarea
            value={reviewExcerpts}
            onChange={(event) => setReviewExcerpts(event.target.value)}
            rows={5}
            placeholder="Collez ici 5 avis copiés depuis Google (un par ligne)…"
            className={`mt-1.5 w-full ${formTextareaClassName}`}
          />
        </label>
        {!hasExcerpts ? (
          <p className="text-sm text-amber-800">
            Sans extraits, le prompt demandera d&apos;abord de coller les avis dans
            Gemini — évitez le résumé « INCONNU ».
          </p>
        ) : null}
        <pre className="whitespace-pre-wrap rounded-lg border border-neutral-200 bg-white p-3 text-sm leading-relaxed text-neutral-800">
          {prompt}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-normal text-neutral-900 transition hover:border-[#c9a882] hover:bg-[#faf6f2]"
        >
          {copied ? 'Copié' : 'Copier le prompt'}
        </button>
      </div>
    </details>
  )
}
