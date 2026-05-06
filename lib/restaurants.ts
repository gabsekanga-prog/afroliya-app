import { supabase } from '@/lib/supabase'

export type Restaurant = {
  id: number
  slug: string
  nom: string
  cuisine: string
  ville: string
  note: string
  image: string
  description: string
}

type RestaurantRow = {
  id: number
  slug: string
  nom: string
  cuisine: string
  ville: string
  note: string
  image: string
  description: string
}

function mapRow(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    nom: row.nom,
    cuisine: row.cuisine,
    ville: row.ville,
    note: row.note,
    image: row.image,
    description: row.description,
  }
}

export async function fetchPublishedRestaurants(): Promise<Restaurant[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('restaurants')
    .select('id, slug, nom, cuisine, ville, note, image, description')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurants] fetchPublishedRestaurants', error.message)
    return []
  }

  if (!data?.length) return []

  return (data as RestaurantRow[]).map(mapRow)
}

export async function fetchRestaurantBySlug(
  slug: string,
): Promise<Restaurant | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('restaurants')
    .select('id, slug, nom, cuisine, ville, note, image, description')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('[restaurants] fetchRestaurantBySlug', error.message)
    return null
  }

  if (!data) return null

  return mapRow(data as RestaurantRow)
}

export async function fetchPublishedRestaurantSlugs(): Promise<string[]> {
  const list = await fetchPublishedRestaurants()
  return list.map((r) => r.slug)
}
