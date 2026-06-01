import { unstable_noStore as noStore } from 'next/cache'

import { supabase } from '@/lib/supabase'

export type RestaurantCommunityStats = {
  ateHereCount: number
  loveCount: number
  reservationVoteCount: number
}

export type ReactionType = 'ate_here' | 'love'

const EMPTY_STATS: RestaurantCommunityStats = {
  ateHereCount: 0,
  loveCount: 0,
  reservationVoteCount: 0,
}

type StatsRow = {
  ate_here_count: number | null
  love_count: number | null
  reservation_vote_count: number | null
}

export async function fetchRestaurantCommunityStats(
  restaurantId: string,
): Promise<RestaurantCommunityStats> {
  noStore()
  if (!supabase) return EMPTY_STATS

  const { data, error } = await supabase
    .from('restaurant_community_stats')
    .select('ate_here_count, love_count, reservation_vote_count')
    .eq('restaurant_id', restaurantId)
    .maybeSingle()

  if (error) {
    console.error('[restaurant-community] fetch stats', error.message)
    return EMPTY_STATS
  }

  if (!data) return EMPTY_STATS

  const row = data as StatsRow
  return {
    ateHereCount: Number(row.ate_here_count ?? 0),
    loveCount: Number(row.love_count ?? 0),
    reservationVoteCount: Number(row.reservation_vote_count ?? 0),
  }
}

export function readStoredReactions(restaurantId: string): Partial<
  Record<ReactionType, true>
> {
  if (typeof window === 'undefined') return {}

  try {
    const raw = localStorage.getItem(`afroliya-reactions-${restaurantId}`)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<Record<ReactionType, true>>
    return parsed ?? {}
  } catch {
    return {}
  }
}

export function storeReactionLocally(
  restaurantId: string,
  reactionType: ReactionType,
): void {
  if (typeof window === 'undefined') return

  const current = readStoredReactions(restaurantId)
  current[reactionType] = true
  localStorage.setItem(
    `afroliya-reactions-${restaurantId}`,
    JSON.stringify(current),
  )
}

export function readStoredReservationVote(restaurantId: string): boolean {
  if (typeof window === 'undefined') return false
  return (
    localStorage.getItem(`afroliya-reservation-vote-${restaurantId}`) === '1'
  )
}

export function storeReservationVoteLocally(restaurantId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`afroliya-reservation-vote-${restaurantId}`, '1')
}

/** Libellé compteur communauté : masqué à 0, sinon « Déjà x vote(s) ». */
export function formatCommunityVoteLabel(count: number): string | null {
  const normalized = Number(count)
  if (!Number.isFinite(normalized) || normalized <= 0) return null
  return normalized === 1 ? 'Déjà 1 vote' : `Déjà ${normalized} votes`
}
