import { unstable_noStore as noStore } from 'next/cache'

import { restaurantSlugFromName } from '@/lib/restaurant-slug'
import { slugify } from '@/lib/slug'
import { supabase } from '@/lib/supabase'

export type RestaurantCuisineTag = {
  key: string
  label: string
}

export type RestaurantMenuPage = {
  id: string
  imageSrc: string
  caption: string | null
  sortOrder: number
}

export type RestaurantFeature = {
  key: string
  label: string
}

export type RestaurantOpeningHoursDay = {
  day: number
  dayLabel: string
  slots: { openTime: string; closeTime: string }[]
}

const OPENING_DAY_LABELS: Record<number, string> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
}

/** Lundi → dimanche */
const OPENING_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const

function formatOpeningTime(value: string | null | undefined): string {
  if (!value) return ''
  const raw = String(value).trim()
  if (/^\d{2}:\d{2}:\d{2}/.test(raw)) return raw.slice(0, 5)
  if (/^\d{1,2}:\d{2}/.test(raw)) {
    const [hours, minutes] = raw.split(':')
    return `${hours.padStart(2, '0')}:${minutes}`
  }
  return raw
}

/** Modèle public (UI) — dérivé de la table `restaurants` + relations. */
export type Restaurant = {
  id: string
  /** Segment d’URL : slug dérivé du nom (`slug` en base). */
  slug: string
  nom: string
  cuisine: string
  cuisines: RestaurantCuisineTag[]
  commune: string
  /** Champ `address` en base. */
  adresse: string
  codePostal: string
  ville: string
  telephone: string
  email: string
  siteWeb: string
  lienGoogleMaps: string
  instagram: string
  facebook: string
  whatsapp: string
  latitude: number | null
  longitude: number | null
  note: string
  /** Nombre d’avis Google (`google_review_total_value`). */
  googleReviewCount: number | null
  /** Court résumé textuel des avis Google. */
  googleReviewsSummary: string
  image: string
  /** Galerie : couverture en premier, puis les autres photos. */
  images: string[]
  description: string
  /** Libellés des tarifs associés (vide si aucun). */
  tarif: string
  sponsored: boolean
  bookable: boolean
  /** Lien externe de réservation (`booking_url`), pour les établissements sponsorisés. */
  bookingUrl: string
}

export type RestaurantFilterOptions = {
  cuisines: RestaurantCuisineTag[]
  lieux: string[]
}

export type RestaurantFilters = {
  query: string
  cuisineKey: string
  lieu: string
}

const PLACEHOLDER_IMAGE =
  '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CuisineJoin = { key: string; description: string | null } | null
type RestaurantCuisineRow = {
  cuisines: CuisineJoin | CuisineJoin[] | null
} | null

type TarifJoin = { key: string; label: string | null } | null
type RestaurantTarifRow = {
  tarifs: TarifJoin | TarifJoin[] | null
} | null
type RestaurantImageRow = {
  image_url: string
  cover: boolean | null
  created_at: string
}

type DbRestaurantRow = {
  id: string
  name: string
  slug?: string | null
  city: string
  commune: string | null
  address: string | null
  postal_code: string | null
  phone: string | null
  email: string | null
  website_url: string | null
  google_maps_link: string | null
  instagram_url: string | null
  facebook_url: string | null
  whatsapp_phone: string | null
  latitude: number | null
  longitude: number | null
  description: string | null
  google_quotation: number | null
  google_review_total_value: number | null
  google_reviews_summary?: string | null
  sponsored: boolean | null
  bookable: boolean | null
  booking_url?: string | null
  restaurant_images: RestaurantImageRow[] | RestaurantImageRow | null
  restaurant_cuisines: RestaurantCuisineRow[] | null
  restaurants_tarifs: RestaurantTarifRow[] | null
}

function normalizeImageRows(
  images: RestaurantImageRow[] | RestaurantImageRow | null | undefined,
): RestaurantImageRow[] {
  return Array.isArray(images) ? images : images != null ? [images] : []
}

function buildGalleryImages(
  images: RestaurantImageRow[] | RestaurantImageRow | null | undefined,
): string[] {
  const list = normalizeImageRows(images)
  if (!list.length) return [PLACEHOLDER_IMAGE]

  const sorted = [...list].sort((a, b) => {
    if (a.cover === true && b.cover !== true) return -1
    if (b.cover === true && a.cover !== true) return 1
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  const urls = sorted
    .map((row) => row.image_url?.trim())
    .filter((url): url is string => Boolean(url))

  const unique = [...new Set(urls)]
  return unique.length ? unique : [PLACEHOLDER_IMAGE]
}

function pickCoverImage(
  images: RestaurantImageRow[] | RestaurantImageRow | null | undefined,
): string {
  return buildGalleryImages(images)[0] ?? PLACEHOLDER_IMAGE
}

function stripCuisinePrefix(label: string): string {
  const trimmed = label.trim()
  const withoutPrefix = trimmed.replace(/^cuisine\s+/i, '').trim()
  return withoutPrefix || trimmed
}

function parseCuisineEntries(
  rows: RestaurantCuisineRow[] | null | undefined,
): RestaurantCuisineTag[] {
  if (!rows?.length) return [{ key: 'africaine', label: 'Africaine' }]

  const byKey = new Map<string, string>()

  for (const row of rows) {
    const raw = row?.cuisines
    const list = Array.isArray(raw) ? raw : raw != null ? [raw] : []
    for (const c of list) {
      if (!c?.key) continue
      const label = stripCuisinePrefix((c.description ?? '').trim() || c.key)
      byKey.set(c.key, label || c.key)
    }
  }

  if (!byKey.size) return [{ key: 'africaine', label: 'Africaine' }]
  return [...byKey.entries()].map(([key, label]) => ({ key, label }))
}

function formatCuisineLabels(entries: RestaurantCuisineTag[]): string {
  const labels = entries.map((c) => c.label).filter(Boolean)
  return labels.length ? [...new Set(labels)].join(' · ') : 'Africaine'
}

function formatTarifLabels(rows: RestaurantTarifRow[] | null | undefined): string {
  if (!rows?.length) return ''
  const labels = rows
    .map((row) => {
      const raw = row?.tarifs
      const list = Array.isArray(raw) ? raw : raw != null ? [raw] : []
      return list
        .map((t) => {
          if (!t) return null
          return (t.label ?? '').trim() || t.key || null
        })
        .filter(Boolean)
    })
    .flat() as string[]
  return labels.length ? [...new Set(labels)].join(' · ') : ''
}

function formatNote(q: number | null | undefined): string {
  if (q == null || Number.isNaN(q)) return '—'
  return Number(q).toFixed(1)
}

export function formatCuisineCommune(cuisine: string, commune: string): string {
  const cuisinePart = cuisine.trim()
  const communePart = commune.trim()
  if (cuisinePart && communePart) return `${cuisinePart} — ${communePart}`
  return cuisinePart || communePart
}

/** Ex. « 1050 Ixelles, Bruxelles ». */
export function formatRestaurantLocationLine(
  codePostal: string,
  commune: string,
  ville: string,
): string {
  const postal = codePostal.trim()
  const communePart = commune.trim()
  const villePart = ville.trim()
  const postalCommune = [postal, communePart].filter(Boolean).join(' ')

  if (villePart && communePart && villePart.toLowerCase() !== communePart.toLowerCase()) {
    return postalCommune ? `${postalCommune}, ${villePart}` : villePart
  }

  return postalCommune || villePart
}

export function formatCuisineCommuneTarif(
  cuisine: string,
  commune: string,
  tarif: string,
): string {
  return [cuisine, commune, tarif]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' — ')
}

/** Ligne hero : « ★ 4,5 (+120 avis Google) • €€ ». */
export function formatRestaurantHeroRatingLine(
  note: string,
  googleReviewCount: number | null,
  tarif: string,
): string {
  const segments: string[] = []

  if (note.trim() && note !== '—') {
    let rating = `★ ${note}`
    if (googleReviewCount != null && googleReviewCount > 0) {
      rating += ` (+${googleReviewCount} avis Google)`
    }
    segments.push(rating)
  }

  const prix = tarif.trim()
  if (prix) segments.push(prix)

  return segments.join(' • ')
}

export function buildRestaurantFilterOptions(
  restaurants: Restaurant[],
): RestaurantFilterOptions {
  const cuisineMap = new Map<string, string>()
  const lieux = new Set<string>()

  for (const restaurant of restaurants) {
    for (const cuisine of restaurant.cuisines) {
      cuisineMap.set(cuisine.key, cuisine.label)
    }
    const lieu = restaurant.commune.trim() || restaurant.ville.trim()
    if (lieu) lieux.add(lieu)
  }

  return {
    cuisines: [...cuisineMap.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, 'fr')),
    lieux: [...lieux].sort((a, b) => a.localeCompare(b, 'fr')),
  }
}

function shuffleRestaurants<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]!
    arr[j] = tmp!
  }
  return arr
}

/** Sponsorised first, then bookable; random order within each group. */
export function sortRestaurantsForDisplay(restaurants: Restaurant[]): Restaurant[] {
  const sponsored: Restaurant[] = []
  const bookable: Restaurant[] = []
  const others: Restaurant[] = []

  for (const restaurant of restaurants) {
    if (restaurant.sponsored) {
      sponsored.push(restaurant)
    } else if (restaurant.bookable) {
      bookable.push(restaurant)
    } else {
      others.push(restaurant)
    }
  }

  return [
    ...shuffleRestaurants(sponsored),
    ...shuffleRestaurants(bookable),
    ...shuffleRestaurants(others),
  ]
}

export function filterRestaurants(
  restaurants: Restaurant[],
  filters: RestaurantFilters,
): Restaurant[] {
  const query = filters.query.trim().toLowerCase()
  const cuisineKey = filters.cuisineKey.trim()
  const lieu = filters.lieu.trim().toLowerCase()

  return restaurants.filter((restaurant) => {
    if (cuisineKey && !restaurant.cuisines.some((c) => c.key === cuisineKey)) {
      return false
    }

    if (lieu) {
      const commune = restaurant.commune.trim().toLowerCase()
      const ville = restaurant.ville.trim().toLowerCase()
      if (commune !== lieu && ville !== lieu) return false
    }

    if (!query) return true

    const haystack = [
      restaurant.nom,
      restaurant.cuisine,
      restaurant.commune,
      restaurant.ville,
      restaurant.tarif,
      restaurant.description,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}

export function mapDbRestaurantToPublic(row: DbRestaurantRow): Restaurant {
  const id = row.id
  const cuisines = parseCuisineEntries(row.restaurant_cuisines)
  const cuisine = formatCuisineLabels(cuisines)
  const commune = (row.commune ?? '').trim()
  const ville = row.city?.trim() || ''
  const nom = row.name?.trim() || 'Restaurant'
  const slug = (row.slug ?? '').trim() || restaurantSlugFromName(nom)
  return {
    id,
    slug,
    nom,
    ville,
    cuisine,
    cuisines,
    commune,
    adresse: (row.address ?? '').trim(),
    codePostal: (row.postal_code ?? '').trim(),
    telephone: (row.phone ?? '').trim(),
    email: (row.email ?? '').trim(),
    siteWeb: (row.website_url ?? '').trim(),
    lienGoogleMaps: (row.google_maps_link ?? '').trim(),
    instagram: (row.instagram_url ?? '').trim(),
    facebook: (row.facebook_url ?? '').trim(),
    whatsapp: (row.whatsapp_phone ?? '').trim(),
    latitude:
      row.latitude != null && !Number.isNaN(Number(row.latitude)) ? Number(row.latitude) : null,
    longitude:
      row.longitude != null && !Number.isNaN(Number(row.longitude))
        ? Number(row.longitude)
        : null,
    note: formatNote(row.google_quotation),
    googleReviewCount:
      row.google_review_total_value != null && !Number.isNaN(Number(row.google_review_total_value))
        ? Number(row.google_review_total_value)
        : null,
    googleReviewsSummary: (row.google_reviews_summary ?? '').trim(),
    images: buildGalleryImages(row.restaurant_images),
    image: pickCoverImage(row.restaurant_images),
    description: (row.description ?? '').trim() || 'Découvrez ce restaurant partenaire.',
    tarif: formatTarifLabels(row.restaurants_tarifs),
    sponsored: row.sponsored === true,
    bookable: row.bookable === true,
    bookingUrl: (row.booking_url ?? '').trim(),
  }
}

const RESTAURANT_CORE_COLUMNS_BASE = `
  id,
  name,
  slug,
  city,
  commune,
  address,
  postal_code,
  phone,
  email,
  website_url,
  google_maps_link,
  instagram_url,
  facebook_url,
  whatsapp_phone,
  latitude,
  longitude,
  description,
  google_quotation,
  google_review_total_value,
  sponsored,
  bookable
`

const RESTAURANT_CORE_COLUMNS = `${RESTAURANT_CORE_COLUMNS_BASE},
  booking_url
`

const RESTAURANT_CORE_COLUMNS_LEGACY = RESTAURANT_CORE_COLUMNS_BASE

const RESTAURANT_PUBLIC_RELATIONS = `
  restaurant_images ( image_url, cover, created_at ),
  restaurant_cuisines ( cuisines ( key, description ) ),
  restaurants_tarifs ( tarif_key, tarifs ( key, label ) )
`

const RESTAURANT_PUBLIC_SELECT = `${RESTAURANT_CORE_COLUMNS},
  google_reviews_summary,
  ${RESTAURANT_PUBLIC_RELATIONS}`

const RESTAURANT_PUBLIC_SELECT_LEGACY = `${RESTAURANT_CORE_COLUMNS_LEGACY},
  ${RESTAURANT_PUBLIC_RELATIONS}`

const RESTAURANT_PUBLIC_SELECT_NO_GOOGLE_SUMMARY = `${RESTAURANT_CORE_COLUMNS},
  ${RESTAURANT_PUBLIC_RELATIONS}`

const RESTAURANT_PUBLIC_SELECT_NO_BOOKING_URL = `${RESTAURANT_CORE_COLUMNS_LEGACY},
  google_reviews_summary,
  ${RESTAURANT_PUBLIC_RELATIONS}`

const RESTAURANT_MINIMAL_SELECT = `${RESTAURANT_CORE_COLUMNS},
  google_reviews_summary,
  created_at`

const RESTAURANT_MINIMAL_SELECT_NO_GOOGLE_SUMMARY = `${RESTAURANT_CORE_COLUMNS},
  created_at`

const RESTAURANT_MINIMAL_SELECT_NO_BOOKING_URL = `${RESTAURANT_CORE_COLUMNS_LEGACY},
  google_reviews_summary,
  created_at`

const RESTAURANT_MINIMAL_SELECT_LEGACY = `${RESTAURANT_CORE_COLUMNS_LEGACY},
  created_at`

const RESTAURANT_CORE_COLUMNS_NO_SLUG = `
  id,
  name,
  city,
  commune,
  address,
  postal_code,
  phone,
  email,
  website_url,
  google_maps_link,
  instagram_url,
  facebook_url,
  whatsapp_phone,
  latitude,
  longitude,
  description,
  google_quotation,
  google_review_total_value,
  sponsored,
  bookable,
  booking_url
`

const RESTAURANT_PUBLIC_SELECT_NO_SLUG = `${RESTAURANT_CORE_COLUMNS_NO_SLUG},
  google_reviews_summary,
  ${RESTAURANT_PUBLIC_RELATIONS}`

const RESTAURANT_MINIMAL_SELECT_NO_SLUG = `${RESTAURANT_CORE_COLUMNS_NO_SLUG},
  google_reviews_summary,
  created_at`

const RESTAURANT_PUBLIC_SELECT_ATTEMPTS = [
  RESTAURANT_PUBLIC_SELECT,
  RESTAURANT_PUBLIC_SELECT_NO_SLUG,
  RESTAURANT_PUBLIC_SELECT_NO_BOOKING_URL,
  RESTAURANT_PUBLIC_SELECT_NO_GOOGLE_SUMMARY,
  RESTAURANT_PUBLIC_SELECT_LEGACY,
] as const

const RESTAURANT_MINIMAL_SELECT_ATTEMPTS = [
  RESTAURANT_MINIMAL_SELECT,
  RESTAURANT_MINIMAL_SELECT_NO_SLUG,
  RESTAURANT_MINIMAL_SELECT_NO_BOOKING_URL,
  RESTAURANT_MINIMAL_SELECT_NO_GOOGLE_SUMMARY,
  RESTAURANT_MINIMAL_SELECT_LEGACY,
] as const

function isMissingDbColumnError(message: string, column: string): boolean {
  return message.toLowerCase().includes(column.toLowerCase())
}

function isOptionalRestaurantColumnError(message: string): boolean {
  return (
    isMissingDbColumnError(message, 'google_reviews_summary') ||
    isMissingDbColumnError(message, 'booking_url') ||
    isMissingDbColumnError(message, 'slug')
  )
}

type SupabaseQueryResult = {
  data: unknown
  error: { message: string } | null
}

async function queryWithRestaurantSelectFallback(
  selects: readonly string[],
  runQuery: (select: string) => Promise<SupabaseQueryResult>,
): Promise<{ data: unknown; error: { message: string } | null; usedFallback: boolean }> {
  let lastError: { message: string } | null = null

  for (let i = 0; i < selects.length; i++) {
    const { data, error } = await runQuery(selects[i]!)
    if (!error) {
      return { data, error: null, usedFallback: i > 0 }
    }
    lastError = error
    if (i < selects.length - 1 && isOptionalRestaurantColumnError(error.message)) {
      continue
    }
    break
  }

  return { data: null, error: lastError, usedFallback: false }
}

type DbRestaurantCore = Omit<
  DbRestaurantRow,
  'restaurant_images' | 'restaurant_cuisines' | 'restaurants_tarifs'
> & {
  created_at?: string
}

function asRowWithEmptyRelations(row: DbRestaurantCore): DbRestaurantRow {
  const { created_at: _ignored, ...core } = row
  return {
    ...core,
    restaurant_images: null,
    restaurant_cuisines: null,
    restaurants_tarifs: null,
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

function normalizeCuisineRows(
  rows: RestaurantCuisineRow[] | null | undefined,
): RestaurantCuisineRow[] {
  return rows?.length ? rows : []
}

async function enrichRowsWithCuisines(rows: DbRestaurantRow[]): Promise<DbRestaurantRow[]> {
  const idsMissingCuisines = rows
    .filter((row) => normalizeCuisineRows(row.restaurant_cuisines).length === 0)
    .map((row) => row.id)

  if (idsMissingCuisines.length === 0) return rows

  const cuisineMap = await fetchRestaurantCuisinesMap(idsMissingCuisines)

  return rows.map((row) => {
    if (normalizeCuisineRows(row.restaurant_cuisines).length > 0) return row
    const fromDb = cuisineMap.get(row.id)
    if (!fromDb?.length) return row
    return { ...row, restaurant_cuisines: fromDb }
  })
}

type ImageLinkDbRow = {
  restaurant_id: string
  image_url: string
  cover: boolean | null
  created_at: string
}

async function fetchRestaurantImagesMap(
  restaurantIds: string[],
): Promise<Map<string, RestaurantImageRow[]>> {
  if (!supabase || restaurantIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('restaurant_images')
    .select('restaurant_id, image_url, cover, created_at')
    .in('restaurant_id', restaurantIds)

  if (error) {
    console.warn('[restaurants] lecture restaurant_images :', error.message)
    return new Map()
  }

  const map = new Map<string, RestaurantImageRow[]>()

  for (const link of (data ?? []) as ImageLinkDbRow[]) {
    const id = link.restaurant_id
    const bucket = map.get(id) ?? []
    bucket.push({
      image_url: link.image_url,
      cover: link.cover,
      created_at: link.created_at,
    })
    map.set(id, bucket)
  }

  return map
}

type TarifLinkDbRow = {
  restaurant_id: string
  tarif_key?: string
  tarifs: TarifJoin | TarifJoin[] | null
}

function toRestaurantTarifRows(
  links: TarifLinkDbRow[] | null | undefined,
): RestaurantTarifRow[] {
  if (!links?.length) return []

  return links.map((link) => {
    if (link.tarifs != null) {
      return { tarifs: link.tarifs }
    }
    if (link.tarif_key) {
      return { tarifs: { key: link.tarif_key, label: null } }
    }
    return { tarifs: null }
  })
}

async function fetchRestaurantTarifsMap(
  restaurantIds: string[],
): Promise<Map<string, RestaurantTarifRow[]>> {
  if (!supabase || restaurantIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('restaurants_tarifs')
    .select('restaurant_id, tarif_key, tarifs ( key, label )')
    .in('restaurant_id', restaurantIds)

  if (error) {
    console.warn('[restaurants] lecture restaurants_tarifs :', error.message)
    return new Map()
  }

  const map = new Map<string, RestaurantTarifRow[]>()

  for (const link of (data ?? []) as TarifLinkDbRow[]) {
    const id = link.restaurant_id
    const bucket = map.get(id) ?? []
    bucket.push(...toRestaurantTarifRows([link]))
    map.set(id, bucket)
  }

  return map
}

function normalizeTarifRows(
  rows: RestaurantTarifRow[] | null | undefined,
): RestaurantTarifRow[] {
  return rows?.length ? rows : []
}

async function enrichRowsWithTarifs(rows: DbRestaurantRow[]): Promise<DbRestaurantRow[]> {
  const idsMissingTarifs = rows
    .filter((row) => normalizeTarifRows(row.restaurants_tarifs).length === 0)
    .map((row) => row.id)

  if (idsMissingTarifs.length === 0) return rows

  const tarifMap = await fetchRestaurantTarifsMap(idsMissingTarifs)

  return rows.map((row) => {
    if (normalizeTarifRows(row.restaurants_tarifs).length > 0) return row
    const fromDb = tarifMap.get(row.id)
    if (!fromDb?.length) return row
    return { ...row, restaurants_tarifs: fromDb }
  })
}

async function enrichRowsWithImages(rows: DbRestaurantRow[]): Promise<DbRestaurantRow[]> {
  const idsMissingImages = rows
    .filter((row) => normalizeImageRows(row.restaurant_images).length === 0)
    .map((row) => row.id)

  if (idsMissingImages.length === 0) return rows

  const imageMap = await fetchRestaurantImagesMap(idsMissingImages)

  return rows.map((row) => {
    if (normalizeImageRows(row.restaurant_images).length > 0) return row
    const fromDb = imageMap.get(row.id)
    if (!fromDb?.length) return row
    return { ...row, restaurant_images: fromDb }
  })
}

async function enrichPublishedRows(rows: DbRestaurantRow[]): Promise<DbRestaurantRow[]> {
  const withCuisines = await enrichRowsWithCuisines(rows)
  const withImages = await enrichRowsWithImages(withCuisines)
  return enrichRowsWithTarifs(withImages)
}

export async function fetchPublishedRestaurants(): Promise<Restaurant[]> {
  noStore()
  if (!supabase) return []

  let usedFallback = false
  let data: unknown = null

  const primary = await queryWithRestaurantSelectFallback(
    RESTAURANT_PUBLIC_SELECT_ATTEMPTS,
    async (select) => {
      const { data, error } = await supabase!
        .from('restaurants')
        .select(select)
        .eq('active', true)
        .order('created_at', { ascending: false })
      return { data, error }
    },
  )

  if (primary.error) {
    console.warn('[restaurants] select avec relations a échoué, repli minimal :', primary.error.message)
    const minimal = await queryWithRestaurantSelectFallback(
      RESTAURANT_MINIMAL_SELECT_ATTEMPTS,
      async (select) => {
        const { data, error } = await supabase!
          .from('restaurants')
          .select(select)
          .eq('active', true)
          .order('created_at', { ascending: false })
        return { data, error }
      },
    )
    if (minimal.error) {
      console.error('[restaurants] fetchPublishedRestaurants', minimal.error.message)
      return []
    }
    data = minimal.data
    usedFallback = true
  } else {
    data = primary.data
    usedFallback = primary.usedFallback
  }

  const rows = data as DbRestaurantRow[] | DbRestaurantCore[] | null
  if (!rows?.length) return []

  const normalized: DbRestaurantRow[] = usedFallback
    ? (rows as DbRestaurantCore[]).map((r) => asRowWithEmptyRelations(r))
    : (rows as DbRestaurantRow[])

  const enriched = await enrichPublishedRows(normalized)
  return sortRestaurantsForDisplay(enriched.map(mapDbRestaurantToPublic))
}

type FeatureJoin = {
  key: string
  label: string | null
  sort_order: number | null
  is_active: boolean | null
} | null

type FeatureLinkRow = {
  feature_key: string | null
  restaurant_features: FeatureJoin | FeatureJoin[] | null
}

function normalizeFeatureJoin(
  feature: FeatureJoin | FeatureJoin[] | null | undefined,
): FeatureJoin {
  if (Array.isArray(feature)) return feature[0] ?? null
  return feature ?? null
}

export async function fetchRestaurantFeatures(restaurantId: string): Promise<RestaurantFeature[]> {
  noStore()
  if (!supabase || !UUID_RE.test(restaurantId.trim())) return []

  const { data, error } = await supabase
    .from('restaurant_feature_links')
    .select('feature_key, restaurant_features ( key, label, sort_order, is_active )')
    .eq('restaurant_id', restaurantId.trim())

  if (error) {
    console.warn('[restaurants] lecture restaurant_feature_links :', error.message)
    return []
  }

  const rows = (data ?? []) as FeatureLinkRow[]

  return rows
    .map((row) => {
      const feature = normalizeFeatureJoin(row.restaurant_features)
      if (feature?.is_active === false) return null
      const key = (feature?.key ?? row.feature_key ?? '').trim()
      if (!key) return null
      const label = (feature?.label ?? '').trim() || key
      return {
        key,
        label,
        sortOrder: Number(feature?.sort_order) || 0,
      }
    })
    .filter((item): item is RestaurantFeature & { sortOrder: number } => item != null)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label, 'fr'))
    .map(({ key, label }) => ({ key, label }))
}

export type RestaurantAfroliyaReview = {
  id: string
  authorName: string
  rating: number
  body: string
  validatedAt: string | null
}

type AfroliyaReviewDbRow = {
  id: string
  author_display_name: string
  rating: number
  body: string
  validated_at: string | null
}

export async function fetchRestaurantAfroliyaReviews(
  restaurantId: string,
): Promise<RestaurantAfroliyaReview[]> {
  noStore()
  if (!supabase || !UUID_RE.test(restaurantId.trim())) return []

  const { data, error } = await supabase
    .from('restaurant_afroliya_reviews')
    .select('id, author_display_name, rating, body, validated_at')
    .eq('restaurant_id', restaurantId.trim())
    .order('validated_at', { ascending: false })

  if (error) {
    console.warn('[restaurants] lecture restaurant_afroliya_reviews :', error.message)
    return []
  }

  return ((data ?? []) as AfroliyaReviewDbRow[])
    .map((row) => ({
      id: row.id,
      authorName: row.author_display_name.trim() || 'Membre Afroliya',
      rating: Math.min(5, Math.max(1, Number(row.rating) || 5)),
      body: row.body.trim(),
      validatedAt: row.validated_at,
    }))
    .filter((review) => review.body.length > 0)
}

export async function fetchRestaurantOpeningHours(
  restaurantId: string,
): Promise<RestaurantOpeningHoursDay[]> {
  noStore()
  if (!supabase || !UUID_RE.test(restaurantId.trim())) return []

  const { data, error } = await supabase
    .from('restaurant_opening_slots')
    .select('day, open_time, close_time, sort_order')
    .eq('restaurant_id', restaurantId.trim())
    .order('day', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) {
    console.warn('[restaurants] lecture restaurant_opening_slots :', error.message)
    return []
  }

  const byDay = new Map<number, { openTime: string; closeTime: string; sortOrder: number }[]>()

  for (const row of data ?? []) {
    const day = row.day
    if (typeof day !== 'number' || day < 0 || day > 6) continue
    const openTime = formatOpeningTime(row.open_time)
    const closeTime = formatOpeningTime(row.close_time)
    if (!openTime || !closeTime) continue
    const slots = byDay.get(day) ?? []
    slots.push({
      openTime,
      closeTime,
      sortOrder: Number(row.sort_order) || slots.length,
    })
    byDay.set(day, slots)
  }

  if (byDay.size === 0) return []

  return OPENING_DAY_ORDER.map((day) => {
    const slots = byDay.get(day) ?? []
    slots.sort((a, b) => a.sortOrder - b.sortOrder)
    return {
      day,
      dayLabel: OPENING_DAY_LABELS[day] ?? `Jour ${day}`,
      slots: slots.map(({ openTime, closeTime }) => ({ openTime, closeTime })),
    }
  })
}

export async function fetchRestaurantMenuPages(restaurantId: string): Promise<RestaurantMenuPage[]> {
  noStore()
  if (!supabase || !UUID_RE.test(restaurantId.trim())) return []

  const { data, error } = await supabase
    .from('restaurant_photos_menu')
    .select('id, image_src, caption, sort_order')
    .eq('restaurant_id', restaurantId.trim())
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[restaurants] lecture restaurant_photos_menu :', error.message)
    return []
  }

  return (data ?? [])
    .map((row: {
      id: string
      image_src: string
      caption: string | null
      sort_order: number | null
    }) => ({
      id: row.id,
      imageSrc: row.image_src?.trim() ?? '',
      caption: row.caption?.trim() || null,
      sortOrder: Number(row.sort_order) || 0,
    }))
    .filter((page) => Boolean(page.imageSrc))
}

async function fetchPublishedRestaurantRowByLookup(
  field: 'slug' | 'id',
  value: string,
): Promise<Restaurant | null> {
  if (!supabase || !value.trim()) return null

  let usedFallback = false
  let data: unknown = null

  const primary = await queryWithRestaurantSelectFallback(
    RESTAURANT_PUBLIC_SELECT_ATTEMPTS,
    async (select) => {
      const { data, error } = await supabase!
        .from('restaurants')
        .select(select)
        .eq(field, value.trim())
        .eq('active', true)
        .maybeSingle()
      return { data, error }
    },
  )

  if (primary.error) {
    console.warn('[restaurants] detail avec relations a échoué, repli minimal :', primary.error.message)
    const minimal = await queryWithRestaurantSelectFallback(
      RESTAURANT_MINIMAL_SELECT_ATTEMPTS,
      async (select) => {
        const { data, error } = await supabase!
          .from('restaurants')
          .select(select)
          .eq(field, value.trim())
          .eq('active', true)
          .maybeSingle()
        return { data, error }
      },
    )
    if (minimal.error) {
      console.error('[restaurants] fetchPublishedRestaurantRowByLookup', minimal.error.message)
      return null
    }
    data = minimal.data
    usedFallback = true
  } else {
    data = primary.data
    usedFallback = primary.usedFallback
  }

  if (!data) return null

  const row: DbRestaurantRow = usedFallback
    ? asRowWithEmptyRelations(data as DbRestaurantCore)
    : (data as DbRestaurantRow)

  const [enriched] = await enrichPublishedRows([row])
  return mapDbRestaurantToPublic(enriched)
}

export async function fetchRestaurantBySlug(slugParam: string): Promise<Restaurant | null> {
  noStore()
  const slug = decodeURIComponent(slugParam.trim())
  if (!slug) return null

  const bySlug = await fetchPublishedRestaurantRowByLookup('slug', slug)
  if (bySlug) return bySlug

  if (UUID_RE.test(slug)) {
    return fetchPublishedRestaurantRowByLookup('id', slug)
  }

  return null
}

/** Jusqu’à `limit` restaurants sponsorisés actifs, ordre aléatoire (hors restaurant courant). */
export async function fetchRandomSponsoredRestaurants(
  excludeRestaurantId: string,
  limit = 3,
): Promise<Restaurant[]> {
  noStore()
  const restaurants = await fetchPublishedRestaurants()
  const sponsored = restaurants.filter(
    (restaurant) => restaurant.sponsored && restaurant.id !== excludeRestaurantId,
  )
  return shuffleRestaurants(sponsored).slice(0, Math.max(0, limit))
}

export async function fetchPublishedRestaurantSlugs(): Promise<string[]> {
  noStore()
  if (!supabase) return []

  let { data, error } = await supabase
    .from('restaurants')
    .select('slug, id, name')
    .eq('active', true)

  if (error && isMissingDbColumnError(error.message, 'slug')) {
    const legacy = await supabase.from('restaurants').select('id, name').eq('active', true)
    data = legacy.data as unknown as typeof data
    error = legacy.error
  }

  if (error) {
    console.error('[restaurants] fetchPublishedRestaurantSlugs', error.message)
    return []
  }

  return (data ?? []).map((row: { slug?: string | null; id: string; name?: string | null }) => {
    const fromDb = (row.slug ?? '').trim()
    if (fromDb) return fromDb
    const name = (row.name ?? '').trim()
    return name ? slugify(name) : row.id
  })
}
