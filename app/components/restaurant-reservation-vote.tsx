'use client'

import { useState } from 'react'
import { CalendarCheck } from 'lucide-react'

import { getCommunityClientId } from '@/lib/community-client-id'
import {
  readStoredReservationVote,
  storeReservationVoteLocally,
  formatCommunityVoteLabel,
} from '@/lib/restaurant-community'
import { supabase } from '@/lib/supabase'
import { restaurantDetailPanelClass, siteHeading3Class, communityActionButtonClass } from '@/lib/site-styles'

type Props = {
  restaurantId: string
  initialVoteCount: number
  /** À l’intérieur du panneau téléphone (réservation par appel). */
  embedded?: boolean
}

export function RestaurantReservationVote({
  restaurantId,
  initialVoteCount,
  embedded = false,
}: Props) {
  const [voteCount, setVoteCount] = useState(() =>
    Math.max(0, Number(initialVoteCount) || 0),
  )
  const [hasVoted, setHasVoted] = useState(() =>
    readStoredReservationVote(restaurantId),
  )
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  async function handleVote() {
    if (hasVoted || pending) return

    const clientId = getCommunityClientId()
    if (!clientId) {
      setMessage('Impossible d’enregistrer votre vote dans ce navigateur.')
      return
    }

    if (!supabase) {
      setMessage('Service temporairement indisponible.')
      return
    }

    setPending(true)
    setMessage('')

    const { error } = await supabase.from('restaurant_reservation_votes').insert({
      restaurant_id: restaurantId,
      client_id: clientId,
    })

    if (error) {
      if (error.code === '23505') {
        storeReservationVoteLocally(restaurantId)
        setHasVoted(true)
      } else {
        setMessage('Une erreur est survenue. Merci de réessayer.')
        setPending(false)
        return
      }
    } else {
      storeReservationVoteLocally(restaurantId)
      setHasVoted(true)
      setVoteCount((count) => Math.max(0, Number(count) || 0) + 1)
    }

    setPending(false)
  }

  const voteLabel = formatCommunityVoteLabel(voteCount)

  const voteBody = (
    <div className="inline-flex flex-col items-center">
      <button
        type="button"
        onClick={handleVote}
        disabled={hasVoted || pending}
        className={communityActionButtonClass}
      >
        <CalendarCheck className="h-5 w-5 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
        {pending ? 'Envoi…' : 'Voter'}
      </button>
      {voteLabel ? (
        <p className="mt-2 text-center text-base text-neutral-600">{voteLabel}</p>
      ) : null}

      {message ? (
        <p className="mt-3 text-base text-amber-800" role="status">
          {message}
        </p>
      ) : null}
    </div>
  )

  if (embedded) {
    return (
      <div className={`min-w-0 ${restaurantDetailPanelClass}`}>
        <h3 id="reservation-vote-heading" className={siteHeading3Class}>
          Votez pour la réservation en ligne
        </h3>
        <div className="mt-4">{voteBody}</div>
      </div>
    )
  }

  return (
    <aside className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-stone-50/80 p-5 sm:p-6">
      <div className="flex gap-3">
        <CalendarCheck
          className="mt-0.5 h-6 w-6 shrink-0 text-[#8D5524]"
          strokeWidth={1.5}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h3 className={siteHeading3Class}>Envie de réserver en ligne ici ?</h3>
          <div className="mt-2">{voteBody}</div>
        </div>
      </div>
    </aside>
  )
}
