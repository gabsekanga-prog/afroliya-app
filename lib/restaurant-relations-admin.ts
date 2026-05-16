import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type RestaurantImageAdminRow = {
  created_at: string
  restaurant_id: string
  image_url: string
  cover: boolean | null
  description: string | null
}

export type RestaurantOpeningSlotAdminRow = {
  id: string
  restaurant_id: string | null
  day: number | null
  open_time: string | null
  close_time: string | null
  sort_order: number | null
}

export type CuisineCatalogRow = {
  key: string
  description: string | null
}

export type RestaurantCuisineAdminRow = {
  created_at: string
  restaurant_id: string
  cuisine_key: string
  cuisines:
    | { key: string; description: string | null }
    | { key: string; description: string | null }[]
    | null
}

export type RestaurantDealAdminRow = {
  id: string
  restaurant_id: string | null
  title: string | null
  description: string | null
  validity_text: string | null
  is_active: boolean | null
  sort_order: number | null
}

export type RestaurantFeatureCatalogRow = {
  key: string
  label: string | null
  sort_order: number | null
  is_active: boolean | null
}

export type RestaurantFeatureLinkAdminRow = {
  restaurant_id: string
  feature_key: string | null
  restaurant_features:
    | { key: string; label: string | null }
    | { key: string; label: string | null }[]
    | null
}

export type RestaurantPhotoMenuAdminRow = {
  id: string
  created_at: string
  restaurant_id: string
  image_src: string
  caption: string | null
  sort_order: number | null
  published: boolean | null
}

export async function fetchRestaurantImagesAdmin(
  restaurantId: string,
): Promise<RestaurantImageAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_images')
    .select('created_at, restaurant_id, image_url, cover, description')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[restaurant-images-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantImageAdminRow[]
}

export async function fetchRestaurantOpeningSlotsAdmin(
  restaurantId: string,
): Promise<RestaurantOpeningSlotAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_opening_slots')
    .select('id, restaurant_id, day, open_time, close_time, sort_order')
    .eq('restaurant_id', restaurantId)
    .order('day', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurant-opening-slots-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantOpeningSlotAdminRow[]
}

export async function fetchCuisinesCatalog(): Promise<CuisineCatalogRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin.from('cuisines').select('key, description').order('key')

  if (error) {
    console.error('[cuisines-catalog]', error.message)
    return []
  }

  return (data ?? []) as CuisineCatalogRow[]
}

export async function fetchRestaurantCuisinesAdmin(
  restaurantId: string,
): Promise<RestaurantCuisineAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_cuisines')
    .select('created_at, restaurant_id, cuisine_key, cuisines ( key, description )')
    .eq('restaurant_id', restaurantId)
    .order('cuisine_key')

  if (error) {
    console.error('[restaurant-cuisines-admin]', error.message)
    return []
  }

  return (data ?? []) as unknown as RestaurantCuisineAdminRow[]
}

export async function fetchRestaurantDealsAdmin(
  restaurantId: string,
): Promise<RestaurantDealAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_deals')
    .select('id, restaurant_id, title, description, validity_text, is_active, sort_order')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurant-deals-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantDealAdminRow[]
}

export async function fetchRestaurantFeaturesCatalog(): Promise<RestaurantFeatureCatalogRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_features')
    .select('key, label, sort_order, is_active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurant-features-catalog]', error.message)
    return []
  }

  const rows = (data ?? []) as RestaurantFeatureCatalogRow[]
  return rows.filter((r) => r.is_active !== false)
}

export async function fetchRestaurantFeatureLinksAdmin(
  restaurantId: string,
): Promise<RestaurantFeatureLinkAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_feature_links')
    .select('restaurant_id, feature_key, restaurant_features ( key, label )')
    .eq('restaurant_id', restaurantId)

  if (error) {
    console.error('[restaurant-feature-links-admin]', error.message)
    return []
  }

  return (data ?? []) as unknown as RestaurantFeatureLinkAdminRow[]
}

export async function fetchRestaurantPhotosMenuAdmin(
  restaurantId: string,
): Promise<RestaurantPhotoMenuAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_photos_menu')
    .select('id, created_at, restaurant_id, image_src, caption, sort_order, published')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[restaurant-photos-menu-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantPhotoMenuAdminRow[]
}
