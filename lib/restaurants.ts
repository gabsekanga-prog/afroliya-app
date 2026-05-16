import { unstable_noStore as noStore } from 'next/cache'

import { supabase } from '@/lib/supabase'

/** Modèle public (UI) — dérivé de la table `restaurants` + relations. */
export type Restaurant = {
  id: string
  /** Segment d’URL : identifiant UUID du restaurant. */
  slug: string
  nom: string
  cuisine: string
  ville: string
  note: string
  image: string
  description: string
}

const PLACEHOLDER_IMAGE =
  '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CuisineJoin = { key: string; description: string | null } | null
type RestaurantCuisineRow = {
  cuisines: CuisineJoin | CuisineJoin[] | null
} | null
type RestaurantImageRow = {
  image_url: string
  cover: boolean | null
  created_at: string
}

type DbRestaurantRow = {
  id: string
  name: string
  city: string
  description: string | null
  google_quotation: number | null
  google_review_total_value: number | null
  restaurant_images: RestaurantImageRow[] | RestaurantImageRow | null
  restaurant_cuisines: RestaurantCuisineRow[] | null
}

function pickCoverImage(
  images: RestaurantImageRow[] | RestaurantImageRow | null | undefined,
): string {
  const list = Array.isArray(images) ? images : images != null ? [images] : []
  if (!list.length) return PLACEHOLDER_IMAGE
  const withCover = list.filter((i) => i.cover === true)
  const pool = withCover.length ? withCover : list
  const sorted = [...pool].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )
  const url = sorted[0]?.image_url?.trim()
  return url || PLACEHOLDER_IMAGE
}

function stripCuisinePrefix(label: string): string {
  const trimmed = label.trim()
  const withoutPrefix = trimmed.replace(/^cuisine\s+/i, '').trim()
  return withoutPrefix || trimmed
}

function formatCuisineLabels(rows: RestaurantCuisineRow[] | null | undefined): string {
  if (!rows?.length) return 'Africaine'
  const labels = rows
    .map((row) => {
      const raw = row?.cuisines
      const list = Array.isArray(raw) ? raw : raw != null ? [raw] : []
      return list
        .map((c) => {
          if (!c) return null
          const rawLabel = (c.description ?? '').trim() || c.key
          const label = rawLabel ? stripCuisinePrefix(rawLabel) : null
          return label || null
        })
        .filter(Boolean)
    })
    .flat() as string[]
  return labels.length ? [...new Set(labels)].join(' · ') : 'Africaine'
}

function formatNote(q: number | null | undefined): string {
  if (q == null || Number.isNaN(q)) return '—'
  return Number(q).toFixed(1)
}

export function mapDbRestaurantToPublic(row: DbRestaurantRow): Restaurant {
  const id = row.id
  return {
    id,
    slug: id,
    nom: row.name?.trim() || 'Restaurant',
    ville: row.city?.trim() || '',
    cuisine: formatCuisineLabels(row.restaurant_cuisines),
    note: formatNote(row.google_quotation),
    image: pickCoverImage(row.restaurant_images),
    description: (row.description ?? '').trim() || 'Découvrez ce restaurant partenaire.',
  }
}

const RESTAURANT_PUBLIC_SELECT = `
  id,
  name,
  city,
  description,
  google_quotation,
  google_review_total_value,
  restaurant_images ( image_url, cover, created_at ),
  restaurant_cuisines ( cuisines ( key, description ) )
`

const RESTAURANT_MINIMAL_SELECT = `
  id,
  name,
  city,
  description,
  google_quotation,
  google_review_total_value,
  created_at
`

type DbRestaurantCore = Omit<DbRestaurantRow, 'restaurant_images' | 'restaurant_cuisines'> & {
  created_at?: string
}

function asRowWithEmptyRelations(row: DbRestaurantCore): DbRestaurantRow {
  const { created_at: _ignored, ...core } = row
  return {
    ...core,
    restaurant_images: null,
    restaurant_cuisines: null,
  }
}

type CuisineLinkDbRow = {
  restaurant_id: string
  cuisine_key?: string
  cuisines: CuisineJoin | CuisineJoin[] | null
}

function toRestaurantCuisineRows(
  links: CuisineLinkDbRow[] | null | undefined,
): RestaurantCuisineRow[] {
  if (!links?.length) return []

  return links.map((link) => {
    if (link.cuisines != null) {
      return { cuisines: link.cuisines }
    }
    if (link.cuisine_key) {
      return { cuisines: { key: link.cuisine_key, description: null } }
    }
    return { cuisines: null }
  })
}

async function fetchRestaurantCuisinesMap(
  restaurantIds: string[],
): Promise<Map<string, RestaurantCuisineRow[]>> {
  if (!supabase || restaurantIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('restaurant_cuisines')
    .select('restaurant_id, cuisine_key, cuisines ( key, description )')
    .in('restaurant_id', restaurantIds)

  if (error) {
    console.warn('[restaurants] lecture restaurant_cuisines :', error.message)
    return new Map()
  }

  const map = new Map<string, RestaurantCuisineRow[]>()

  for (const link of (data ?? []) as CuisineLinkDbRow[]) {
    const id = link.restaurant_id
    const bucket = map.get(id) ?? []
    bucket.push(...toRestaurantCuisineRows([link]))
    map.set(id, bucket)
  }

  return map
}

async function enrichRowsWithCuisines(rows: DbRestaurantRow[]): Promise<DbRestaurantRow[]> {
  const idsMissingCuisines = rows
    .filter((row) => !row.restaurant_cuisines?.length)
    .map((row) => row.id)

  if (idsMissingCuisines.length === 0) return rows

  const cuisineMap = await fetchRestaurantCuisinesMap(idsMissingCuisines)

  return rows.map((row) => {
    if (row.restaurant_cuisines?.length) return row
    const fromDb = cuisineMap.get(row.id)
    if (!fromDb?.length) return row
    return { ...row, restaurant_cuisines: fromDb }
  })
}

export async function fetchPublishedRestaurants(): Promise<Restaurant[]> {
  noStore()
  if (!supabase) return []

  let usedFallback = false
  let { data, error } = await supabase
    .from('restaurants')
    .select(RESTAURANT_PUBLIC_SELECT)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[restaurants] select avec relations a échoué, repli minimal :', error.message)
    const fb = await supabase
      .from('restaurants')
      .select(RESTAURANT_MINIMAL_SELECT)
      .order('created_at', { ascending: false })
    if (fb.error) {
      console.error('[restaurants] fetchPublishedRestaurants', fb.error.message)
      return []
    }
    data = fb.data as unknown as typeof data
    usedFallback = true
  }

  if (!data?.length) return []

  const rows: DbRestaurantRow[] = usedFallback
    ? (data as unknown as DbRestaurantCore[]).map((r) => asRowWithEmptyRelations(r))
    : (data as unknown as DbRestaurantRow[])

  const enriched = await enrichRowsWithCuisines(rows)
  return enriched.map(mapDbRestaurantToPublic)
}

export async function fetchRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  noStore()
  if (!supabase) return null
  if (!UUID_RE.test(slug.trim())) return null

  const id = slug.trim()

  let usedFallback = false
  let { data, error } = await supabase
    .from('restaurants')
    .select(RESTAURANT_PUBLIC_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.warn('[restaurants] detail avec relations a échoué, repli minimal :', error.message)
    const fb = await supabase
      .from('restaurants')
      .select(RESTAURANT_MINIMAL_SELECT)
      .eq('id', id)
      .maybeSingle()
    if (fb.error) {
      console.error('[restaurants] fetchRestaurantBySlug', fb.error.message)
      return null
    }
    data = fb.data as unknown as typeof data
    usedFallback = true
  }

  if (!data) return null

  const row: DbRestaurantRow = usedFallback
    ? asRowWithEmptyRelations(data as unknown as DbRestaurantCore)
    : (data as unknown as DbRestaurantRow)

  const [enriched] = await enrichRowsWithCuisines([row])
  return mapDbRestaurantToPublic(enriched)
}

export async function fetchPublishedRestaurantSlugs(): Promise<string[]> {
  noStore()
  if (!supabase) return []

  const { data, error } = await supabase.from('restaurants').select('id')

  if (error) {
    console.error('[restaurants] fetchPublishedRestaurantSlugs', error.message)
    return []
  }

  return (data ?? []).map((row: { id: string }) => row.id)
}
