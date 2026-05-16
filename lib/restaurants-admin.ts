import { getSupabaseAdmin } from '@/lib/supabase-admin'

/** Ligne éditable — colonnes de `public.restaurants`. */
export type RestaurantAdmin = {
  id: string
  name: string
  city: string
  description: string | null
  bookable: boolean | null
  google_quotation: number | null
  website_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  google_maps_link: string | null
  instagram_url: string | null
  facebook_url: string | null
  whatsapp_phone: string | null
}

const ADMIN_SELECT = `
  id,
  name,
  city,
  description,
  bookable,
  google_quotation,
  website_url,
  phone,
  email,
  address,
  google_maps_link,
  instagram_url,
  facebook_url,
  whatsapp_phone
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
