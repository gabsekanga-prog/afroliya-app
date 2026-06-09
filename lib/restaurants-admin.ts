import { getSupabaseAdmin } from '@/lib/supabase-admin'

/** Ligne éditable — colonnes de `public.restaurants` (voir table_definitions/restaurants.sql). */
export type RestaurantAdmin = {
  id: string
  name: string
  slug?: string | null
  address: string | null
  created_at: string | null
  website_url: string | null
  google_maps_link: string | null
  description: string | null
  bookable: boolean | null
  google_quotation: number | null
  google_review_total_value: number | null
  google_reviews_summary?: string | null
  city: string
  postal_code: string | null
  country_code: string | null
  latitude: number | null
  longitude: number | null
  instagram_url: string | null
  facebook_url: string | null
  whatsapp_phone: string | null
  phone: string | null
  email: string | null
  sponsored: boolean | null
  sponsorship_start_date?: string | null
  sponsorship_end_date?: string | null
  commune: string | null
  active: boolean | null
  booking_url?: string | null
  afroliya_instagram_post_url?: string | null
  afroliya_instagram_thumbnail_url?: string | null
}

const ADMIN_CORE_COLUMNS_BASE = `
  id,
  name,
  slug,
  address,
  created_at,
  website_url,
  google_maps_link,
  description,
  bookable,
  google_quotation,
  google_review_total_value,
  city,
  postal_code,
  country_code,
  latitude,
  longitude,
  instagram_url,
  facebook_url,
  whatsapp_phone,
  phone,
  email,
  sponsored,
  sponsorship_start_date,
  sponsorship_end_date,
  commune,
  active
`

const ADMIN_CORE_COLUMNS = `${ADMIN_CORE_COLUMNS_BASE},
  booking_url,
  afroliya_instagram_post_url,
  afroliya_instagram_thumbnail_url`

const ADMIN_SELECT = `${ADMIN_CORE_COLUMNS},
  google_reviews_summary`

const ADMIN_SELECT_NO_GOOGLE_SUMMARY = ADMIN_CORE_COLUMNS

const ADMIN_SELECT_NO_BOOKING_URL = `${ADMIN_CORE_COLUMNS_BASE},
  google_reviews_summary`

const ADMIN_SELECT_LEGACY = ADMIN_CORE_COLUMNS_BASE

const ADMIN_CORE_COLUMNS_NO_SLUG = `
  id,
  name,
  address,
  created_at,
  website_url,
  google_maps_link,
  description,
  bookable,
  google_quotation,
  google_review_total_value,
  city,
  postal_code,
  country_code,
  latitude,
  longitude,
  instagram_url,
  facebook_url,
  whatsapp_phone,
  phone,
  email,
  sponsored,
  sponsorship_start_date,
  sponsorship_end_date,
  commune,
  active,
  booking_url
`

const ADMIN_SELECT_NO_SLUG = `${ADMIN_CORE_COLUMNS_NO_SLUG},
  google_reviews_summary`

const ADMIN_SELECT_NO_AFROLIYA_THUMBNAIL = `${ADMIN_CORE_COLUMNS_BASE},
  booking_url,
  afroliya_instagram_post_url,
  google_reviews_summary`

const ADMIN_SELECT_NO_AFROLIYA_INSTAGRAM = `${ADMIN_CORE_COLUMNS_BASE},
  booking_url,
  google_reviews_summary`

const ADMIN_SELECT_ATTEMPTS = [
  ADMIN_SELECT,
  ADMIN_SELECT_NO_SLUG,
  ADMIN_SELECT_NO_AFROLIYA_THUMBNAIL,
  ADMIN_SELECT_NO_AFROLIYA_INSTAGRAM,
  ADMIN_SELECT_NO_BOOKING_URL,
  ADMIN_SELECT_NO_GOOGLE_SUMMARY,
  ADMIN_SELECT_LEGACY,
] as const

function isMissingDbColumnError(message: string, column: string): boolean {
  return message.toLowerCase().includes(column.toLowerCase())
}

function isOptionalAdminColumnError(message: string): boolean {
  return (
    isMissingDbColumnError(message, 'google_reviews_summary') ||
    isMissingDbColumnError(message, 'booking_url') ||
    isMissingDbColumnError(message, 'afroliya_instagram_post_url') ||
    isMissingDbColumnError(message, 'afroliya_instagram_thumbnail_url') ||
    isMissingDbColumnError(message, 'sponsorship_start_date') ||
    isMissingDbColumnError(message, 'sponsorship_end_date') ||
    isMissingDbColumnError(message, 'slug')
  )
}

function mapRow(row: RestaurantAdmin): RestaurantAdmin {
  return { ...row }
}

async function fetchAdminWithSelectFallback<T>(
  runQuery: (select: string) => Promise<{ data: T; error: { message: string } | null }>,
): Promise<T> {
  let lastError: { message: string } | null = null

  for (let i = 0; i < ADMIN_SELECT_ATTEMPTS.length; i++) {
    const { data, error } = await runQuery(ADMIN_SELECT_ATTEMPTS[i]!)
    if (!error) return data
    lastError = error
    if (i < ADMIN_SELECT_ATTEMPTS.length - 1 && isOptionalAdminColumnError(error.message)) {
      continue
    }
    break
  }

  throw new Error(lastError?.message ?? 'Lecture admin restaurants impossible')
}

export async function fetchRestaurantsAdmin(): Promise<RestaurantAdmin[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  try {
    const data = await fetchAdminWithSelectFallback(async (select) => {
      const { data: rows, error } = await admin
        .from('restaurants')
        .select(select)
        .order('created_at', { ascending: false })
      return { data: rows, error }
    })
    return ((data ?? []) as unknown as RestaurantAdmin[]).map(mapRow)
  } catch (error) {
    console.error('[restaurants-admin] list', error instanceof Error ? error.message : error)
    return []
  }
}

export async function fetchRestaurantAdminById(
  id: string,
): Promise<RestaurantAdmin | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  try {
    const data = await fetchAdminWithSelectFallback(async (select) => {
      const { data: row, error } = await admin
        .from('restaurants')
        .select(select)
        .eq('id', id)
        .maybeSingle()
      return { data: row, error }
    })
    if (!data) return null
    return mapRow(data as unknown as RestaurantAdmin)
  } catch {
    return null
  }
}
