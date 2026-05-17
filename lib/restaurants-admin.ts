import { getSupabaseAdmin } from '@/lib/supabase-admin'

/** Ligne éditable — colonnes de `public.restaurants` (voir table_definitions/restaurants.sql). */
export type RestaurantAdmin = {
  id: string
  name: string
  address: string | null
  created_at: string | null
  website_url: string | null
  google_maps_link: string | null
  description: string | null
  bookable: boolean | null
  google_quotation: number | null
  google_review_total_value: number | null
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
  commune: string | null
  active: boolean | null
}

const ADMIN_SELECT = `
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
  commune,
  active
`

function mapRow(row: RestaurantAdmin): RestaurantAdmin {
  return { ...row }
}

export async function fetchRestaurantsAdmin(): Promise<RestaurantAdmin[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurants')
    .select(ADMIN_SELECT)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[restaurants-admin] list', error.message)
    return []
  }

  return ((data ?? []) as RestaurantAdmin[]).map(mapRow)
}

export async function fetchRestaurantAdminById(
  id: string,
): Promise<RestaurantAdmin | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data, error } = await admin
    .from('restaurants')
    .select(ADMIN_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null

  return mapRow(data as RestaurantAdmin)
}
