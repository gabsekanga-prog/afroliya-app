import type { Restaurant } from '@/lib/restaurants'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type RestaurantAdmin = Restaurant & {
  published: boolean
  sort_order: number
}

type Row = Restaurant & { published: boolean; sort_order: number }

function mapRow(row: Row): RestaurantAdmin {
  return { ...row }
}

export async function fetchRestaurantsAdmin(): Promise<RestaurantAdmin[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurants')
    .select(
      'id, slug, nom, cuisine, ville, note, image, description, published, sort_order',
    )
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurants-admin] list', error.message)
    return []
  }

  return ((data ?? []) as Row[]).map(mapRow)
}

export async function fetchRestaurantAdminById(
  id: number,
): Promise<RestaurantAdmin | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data, error } = await admin
    .from('restaurants')
    .select(
      'id, slug, nom, cuisine, ville, note, image, description, published, sort_order',
    )
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null

  return mapRow(data as Row)
}
