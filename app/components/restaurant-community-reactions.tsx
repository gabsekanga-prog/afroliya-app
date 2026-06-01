'use client'

import { useCallback, useState } from 'react'
import { Heart, Utensils } from 'lucide-react'

import { getCommunityClientId } from '@/lib/community-client-id'
import {
  readStoredReactions,
  storeReactionLocally,
  formatCommunityVoteLabel,
  type ReactionType,
  type RestaurantCommunityStats,
} from '@/lib/restaurant-community'
import { supabase } from '@/lib/supabase'
import { communityActionButtonClass, siteHeading3Class } from '@/lib/site-styles'

type Props = {
  restaurantId: string
  initialStats: RestaurantCommunityStats
}

export function RestaurantCommunityReactions({
  restaurantId,
  initialStats,
}: Props) {
  const [stats, setStats] = useState(initialStats)
  const [userReactions, setUserReactions] = useState<
    Partial<Record<ReactionType, true>>
  >(() => readStoredReactions(restaurantId))
  const [pending, setPending] = useState<ReactionType | null>(null)
  const [message, setMessage] = useState('')

  const submitReaction = useCallback(
    async (reactionType: ReactionType) => {
      if (userReactions[reactionType] || pending) return

      const clientId = getCommunityClientId()
      if (!clientId) {
        setMessage('Impossible d’enregistrer votre avis dans ce navigateur.')
        return
      }

      if (!supabase) {
        setMessage('Service temporairement indisponible.')
        return
      }

      setPending(reactionType)
      setMessage('')

      const { error } = await supabase.from('restaurant_reactions').insert({
        restaurant_id: restaurantId,
        reaction_type: reactionType,
        client_id: clientId,
      })

      if (error) {
        if (error.code === '23505') {
          storeReactionLocally(restaurantId, reactionType)
          setUserReactions((prev) => ({ ...prev, [reactionType]: true }))
        } else {
          setMessage('Une erreur est survenue. Merci de réessayer.')
          setPending(null)
          return
        }
      } else {
        storeReactionLocally(restaurantId, reactionType)
        setUserReactions((prev) => ({ ...prev, [reactionType]: true }))
        setStats((prev) => ({
          ...prev,
          ateHereCount:
            reactionType === 'ate_here'
              ? prev.ateHereCount + 1
              : prev.ateHereCount,
          loveCount:
            reactionType === 'love' ? prev.loveCount + 1 : prev.loveCount,
        }))
      }

      setPending(null)
    },
    [pending, restaurantId, userReactions],
  )

  const ateHereVoteLabel = formatCommunityVoteLabel(stats.ateHereCount)
  const loveVoteLabel = formatCommunityVoteLabel(stats.loveCount)

  return (
    <div aria-labelledby="votre-retour-heading">
      <h3 id="votre-retour-heading" className={siteHeading3Class}>
        Retours de la communauté
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <button
            type="button"
            disabled={Boolean(userReactions.ate_here) || pending !== null}
            onClick={() => submitReaction('ate_here')}
            className={`w-full ${communityActionButtonClass}`}
          >
            <Utensils className="h-5 w-5 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
            J&apos;ai déjà testé
          </button>
          {ateHereVoteLabel ? (
            <p className="mt-2 text-center text-sm text-neutral-600">{ateHereVoteLabel}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <button
            type="button"
            disabled={Boolean(userReactions.love) || pending !== null}
            onClick={() => submitReaction('love')}
            className={`w-full ${communityActionButtonClass}`}
          >
            <Heart className="h-5 w-5 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
            Je vais tester
          </button>
          {loveVoteLabel ? (
            <p className="mt-2 text-center text-sm text-neutral-600">{loveVoteLabel}</p>
          ) : null}
        </div>
      </div>

      {message ? (
        <p className="mt-3 text-sm text-amber-800" role="status">
          {message}
        </p>
      ) : null}
    </div>
  )
}
