'use server'

import { randomUUID } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/admin-session'
import { resolveRestaurantSlug } from '@/lib/restaurant-slug'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

function emptyToNull(s: string): string | null {
  const t = s.trim()
  return t.length ? t : null
}

function parseGoogleNote(raw: string): number | null {
  const t = raw.trim().replace(',', '.')
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n) || n < 0 || n > 5) return null
  return n
}

function parseOptionalNonNegativeInt(raw: string): number | null {
  const t = raw.trim()
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return null
  return n
}

function parseOptionalCoord(raw: string): number | null {
  const t = raw.trim().replace(',', '.')
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  return n
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function saveRestaurantAction(
  _prev: { error?: string; ok?: boolean; id?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; id?: string }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const idRaw = formData.get('id')
  const id = idRaw ? String(idRaw).trim() : ''

  const name = String(formData.get('name') ?? '').trim()
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const originalSlug = String(formData.get('original_slug') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const description = emptyToNull(String(formData.get('description') ?? ''))
  const bookable = formData.has('bookable')
  const sponsored = formData.has('sponsored')
  const active = formData.has('active')
  const google_quotation = parseGoogleNote(String(formData.get('google_quotation') ?? ''))
  const google_review_total_value = parseOptionalNonNegativeInt(
    String(formData.get('google_review_total_value') ?? ''),
  )
  const google_reviews_summary = emptyToNull(String(formData.get('google_reviews_summary') ?? ''))
  const website_url = emptyToNull(String(formData.get('website_url') ?? ''))
  const phone = emptyToNull(String(formData.get('phone') ?? ''))
  const email = emptyToNull(String(formData.get('email') ?? ''))
  const address = emptyToNull(String(formData.get('address') ?? ''))
  const commune = emptyToNull(String(formData.get('commune') ?? ''))
  const postal_code = emptyToNull(String(formData.get('postal_code') ?? ''))
  const country_code = emptyToNull(String(formData.get('country_code') ?? ''))
  const latitude = parseOptionalCoord(String(formData.get('latitude') ?? ''))
  const longitude = parseOptionalCoord(String(formData.get('longitude') ?? ''))
  const google_maps_link = emptyToNull(String(formData.get('google_maps_link') ?? ''))
  const instagram_url = emptyToNull(String(formData.get('instagram_url') ?? ''))
  const facebook_url = emptyToNull(String(formData.get('facebook_url') ?? ''))
  const whatsapp_phone = emptyToNull(String(formData.get('whatsapp_phone') ?? ''))
  const booking_url = emptyToNull(String(formData.get('booking_url') ?? ''))
  const afroliya_instagram_post_url = emptyToNull(
    String(formData.get('afroliya_instagram_post_url') ?? ''),
  )
  const afroliya_instagram_thumbnail_url = emptyToNull(
    String(formData.get('afroliya_instagram_thumbnail_url') ?? ''),
  )

  if (!name || !city) {
    return { error: 'Le nom et la ville sont obligatoires.' }
  }

  const restaurantId = id && UUID_RE.test(id) ? id : undefined
  const slug = await resolveRestaurantSlug(admin, slugRaw || name, name, restaurantId)

  const row = {
    name,
    slug,
    city,
    description,
    bookable,
    sponsored,
    active,
    google_quotation,
    google_review_total_value,
    google_reviews_summary,
    website_url,
    phone,
    email,
    address,
    commune,
    postal_code,
    country_code,
    latitude,
    longitude,
    google_maps_link,
    instagram_url,
    facebook_url,
    whatsapp_phone,
    booking_url,
    afroliya_instagram_post_url,
    afroliya_instagram_thumbnail_url,
  }

  function isMissingDbColumnError(message: string, column: string): boolean {
    return message.toLowerCase().includes(column.toLowerCase())
  }

  const rowWithoutGoogleSummary = { ...row }
  delete (rowWithoutGoogleSummary as { google_reviews_summary?: string | null })
    .google_reviews_summary

  const rowWithoutBookingUrl = { ...row }
  delete (rowWithoutBookingUrl as { booking_url?: string | null }).booking_url

  const rowWithoutAfroliyaInstagram = { ...row }
  delete (rowWithoutAfroliyaInstagram as { afroliya_instagram_post_url?: string | null })
    .afroliya_instagram_post_url
  delete (rowWithoutAfroliyaInstagram as { afroliya_instagram_thumbnail_url?: string | null })
    .afroliya_instagram_thumbnail_url

  const rowWithoutAfroliyaThumbnail = { ...row }
  delete (rowWithoutAfroliyaThumbnail as { afroliya_instagram_thumbnail_url?: string | null })
    .afroliya_instagram_thumbnail_url

  const rowWithoutSlug = { ...row }
  delete (rowWithoutSlug as { slug?: string | null }).slug

  const rowLegacy = { ...rowWithoutGoogleSummary }
  delete (rowLegacy as { booking_url?: string | null }).booking_url
  delete (rowLegacy as { slug?: string | null }).slug

  async function saveRow(payload: typeof row) {
    if (id && UUID_RE.test(id)) {
      return admin!.from('restaurants').update(payload).eq('id', id)
    }
    return admin!.from('restaurants').insert(payload).select('id').single()
  }

  const saveAttempts = [
    row,
    rowWithoutGoogleSummary,
    rowWithoutAfroliyaThumbnail,
    rowWithoutAfroliyaInstagram,
    rowWithoutBookingUrl,
    rowWithoutSlug,
    rowLegacy,
  ]

  let result = await saveRow(saveAttempts[0]!)
  for (let i = 1; i < saveAttempts.length; i++) {
    if (!result.error) break
    const message = result.error.message
    if (
      !isMissingDbColumnError(message, 'google_reviews_summary') &&
      !isMissingDbColumnError(message, 'booking_url') &&
      !isMissingDbColumnError(message, 'afroliya_instagram_post_url') &&
      !isMissingDbColumnError(message, 'afroliya_instagram_thumbnail_url') &&
      !isMissingDbColumnError(message, 'slug')
    ) {
      break
    }
    result = await saveRow(saveAttempts[i]!)
  }

  if (id && UUID_RE.test(id)) {
    if (result.error) return { error: result.error.message }
    revalidatePath('/restaurants', 'page')
    revalidatePath(`/restaurants/${slug}`, 'page')
    if (originalSlug && originalSlug !== slug) {
      revalidatePath(`/restaurants/${originalSlug}`, 'page')
    }
    revalidatePath(`/restaurants/${id}`, 'page')
    revalidatePath('/admin/restaurants')
    revalidatePath(`/admin/restaurants/${id}`)
    revalidatePath('/', 'layout')
    return { ok: true, id }
  }

  if (result.error) return { error: result.error.message }

  const inserted = 'data' in result ? result.data : null
  revalidatePath('/restaurants', 'page')
  revalidatePath('/admin/restaurants')
  revalidatePath('/', 'layout')
  if (typeof inserted?.id === 'string') {
    redirect(`/admin/restaurants/${inserted.id}`)
  }
  return { error: 'Création sans identifiant retourné' }
}

async function revalidateRestaurantPublicAndAdmin(restaurantId: string) {
  const admin = getSupabaseAdmin()
  revalidatePath('/restaurants', 'page')
  revalidatePath('/admin/restaurants')
  revalidatePath(`/admin/restaurants/${restaurantId}`)
  revalidatePath('/', 'layout')

  if (admin) {
    const { data } = await admin
      .from('restaurants')
      .select('slug')
      .eq('id', restaurantId)
      .maybeSingle()
    const slug = (data as { slug?: string | null } | null)?.slug?.trim()
    if (slug) {
      revalidatePath(`/restaurants/${slug}`, 'page')
    }
  }

  revalidatePath(`/restaurants/${restaurantId}`, 'page')
}

export async function addRestaurantImageAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId)) return { error: 'Restaurant invalide.' }

  const image_url = String(formData.get('image_url') ?? '').trim()
  if (!image_url) return { error: 'URL de l’image obligatoire.' }

  const description = emptyToNull(String(formData.get('image_description') ?? ''))
  const cover = formData.has('image_cover')

  if (cover) {
    await admin.from('restaurant_images').update({ cover: false }).eq('restaurant_id', restaurantId)
  }

  const { error } = await admin.from('restaurant_images').insert({
    restaurant_id: restaurantId,
    image_url,
    description,
    cover: cover || null,
  })
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantImageAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const image_url = String(formData.get('image_url') ?? '').trim()
  const created_at = String(formData.get('created_at') ?? '').trim()

  if (!UUID_RE.test(restaurantId) || !image_url || !created_at) {
    return { error: 'Paramètres image invalides.' }
  }

  const { error } = await admin
    .from('restaurant_images')
    .delete()
    .match({ restaurant_id: restaurantId, image_url, created_at })

  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

type SlotJsonRow = {
  day: number
  open_time: string | null
  close_time: string | null
  sort_order: number
}

function normalizeTimeInput(raw: string | null | undefined): string | null {
  if (raw == null) return null
  const t = String(raw).trim()
  if (!t) return null
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  const sec = m[3] != null ? Number(m[3]) : 0
  if (!Number.isFinite(h) || !Number.isFinite(min) || h > 23 || min > 59 || sec > 59) {
    return null
  }
  const hh = String(h).padStart(2, '0')
  const mm = String(min).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export async function saveRestaurantOpeningSlotsAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId)) return { error: 'Restaurant invalide.' }

  const rawJson = String(formData.get('slots_json') ?? '').trim()
  let parsed: unknown
  try {
    parsed = rawJson ? JSON.parse(rawJson) : []
  } catch {
    return { error: 'Format des horaires invalide.' }
  }

  if (!Array.isArray(parsed)) return { error: 'Les horaires doivent être une liste.' }

  const rows: SlotJsonRow[] = []
  for (const item of parsed) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const day = Number(o.day)
    if (!Number.isInteger(day) || day < 0 || day > 6) continue
    const open_time = normalizeTimeInput(o.open_time != null ? String(o.open_time) : null)
    const close_time = normalizeTimeInput(o.close_time != null ? String(o.close_time) : null)
    if (!open_time || !close_time) continue
    const sort_order = Number(o.sort_order)
    rows.push({
      day,
      open_time,
      close_time,
      sort_order: Number.isFinite(sort_order) ? sort_order : rows.length,
    })
  }

  rows.sort((a, b) => (a.day !== b.day ? a.day - b.day : a.sort_order - b.sort_order))

  const { error: delErr } = await admin
    .from('restaurant_opening_slots')
    .delete()
    .eq('restaurant_id', restaurantId)
  if (delErr) return { error: delErr.message }

  if (rows.length) {
    const insertRows = rows.map((r) => ({
      id: randomUUID(),
      restaurant_id: restaurantId,
      day: r.day,
      open_time: r.open_time,
      close_time: r.close_time,
      sort_order: r.sort_order,
    }))
    const { error: insErr } = await admin.from('restaurant_opening_slots').insert(insertRows)
    if (insErr) return { error: insErr.message }
  }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function addRestaurantCuisineAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const cuisine_key = String(formData.get('cuisine_key') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !cuisine_key) {
    return { error: 'Restaurant ou type de cuisine invalide.' }
  }

  const { error } = await admin.from('restaurant_cuisines').insert({ restaurant_id: restaurantId, cuisine_key })
  if (error) {
    if (error.code === '23505') return { error: 'Cette cuisine est déjà associée à ce restaurant.' }
    return { error: error.message }
  }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantCuisineAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const cuisine_key = String(formData.get('cuisine_key') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !cuisine_key) return { error: 'Paramètres invalides.' }

  const { error } = await admin
    .from('restaurant_cuisines')
    .delete()
    .match({ restaurant_id: restaurantId, cuisine_key })

  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function addRestaurantTarifAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const tarif_key = String(formData.get('tarif_key') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !tarif_key) {
    return { error: 'Restaurant ou tarif invalide.' }
  }

  const { error } = await admin
    .from('restaurants_tarifs')
    .insert({ restaurant_id: restaurantId, tarif_key })
  if (error) {
    if (error.code === '23505') return { error: 'Ce tarif est déjà associé à ce restaurant.' }
    return { error: error.message }
  }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantTarifAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const tarif_key = String(formData.get('tarif_key') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !tarif_key) return { error: 'Paramètres invalides.' }

  const { error } = await admin
    .from('restaurants_tarifs')
    .delete()
    .match({ restaurant_id: restaurantId, tarif_key })

  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function saveRestaurantDealAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId)) return { error: 'Restaurant invalide.' }

  const dealId = String(formData.get('deal_id') ?? '').trim()
  const title = String(formData.get('deal_title') ?? '').trim() || 'Offre'
  const description = emptyToNull(String(formData.get('deal_description') ?? ''))
  const validity_text = emptyToNull(String(formData.get('deal_validity_text') ?? ''))
  const is_active = formData.has('deal_is_active')
  const sort_order = Number(formData.get('deal_sort_order') ?? 0) || 0

  const row = {
    title,
    description,
    validity_text,
    is_active,
    sort_order,
  }

  if (dealId && UUID_RE.test(dealId)) {
    const { error } = await admin
      .from('restaurant_deals')
      .update(row)
      .eq('id', dealId)
      .eq('restaurant_id', restaurantId)
    if (error) return { error: error.message }
  } else {
    const { error } = await admin.from('restaurant_deals').insert({
      id: randomUUID(),
      restaurant_id: restaurantId,
      ...row,
    })
    if (error) return { error: error.message }
  }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantDealAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const dealId = String(formData.get('deal_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !UUID_RE.test(dealId)) return { error: 'Paramètres invalides.' }

  const { error } = await admin.from('restaurant_deals').delete().eq('id', dealId).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function addRestaurantFeatureLinkAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const feature_key = String(formData.get('feature_key') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !feature_key) return { error: 'Restaurant ou caractéristique invalide.' }

  const { error } = await admin.from('restaurant_feature_links').insert({ restaurant_id: restaurantId, feature_key })
  if (error) {
    if (error.code === '23505') return { error: 'Cette caractéristique est déjà liée.' }
    return { error: error.message }
  }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantFeatureLinkAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const feature_key = String(formData.get('feature_key') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !feature_key) return { error: 'Paramètres invalides.' }

  const { error } = await admin
    .from('restaurant_feature_links')
    .delete()
    .match({ restaurant_id: restaurantId, feature_key })

  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function addRestaurantPhotoMenuAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId)) return { error: 'Restaurant invalide.' }

  const image_src = String(formData.get('menu_image_src') ?? '').trim()
  if (!image_src) return { error: 'URL de l’image obligatoire.' }

  const caption = emptyToNull(String(formData.get('menu_caption') ?? ''))
  const sort_order = Number(formData.get('menu_sort_order') ?? 0) || 0
  const published = formData.has('menu_published')

  const { error } = await admin.from('restaurant_photos_menu').insert({
    id: randomUUID(),
    restaurant_id: restaurantId,
    image_src,
    caption,
    sort_order,
    published,
  })
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantPhotoMenuAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const photoId = String(formData.get('photo_menu_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !UUID_RE.test(photoId)) return { error: 'Paramètres invalides.' }

  const { error } = await admin
    .from('restaurant_photos_menu')
    .delete()
    .eq('id', photoId)
    .eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant')

  const id = String(formData.get('id') ?? '').trim()
  if (!UUID_RE.test(id)) throw new Error('Identifiant invalide')

  await admin.from('restaurant_photos_menu').delete().eq('restaurant_id', id)
  await admin.from('restaurant_feature_links').delete().eq('restaurant_id', id)
  await admin.from('restaurant_deals').delete().eq('restaurant_id', id)
  await admin.from('restaurant_cuisines').delete().eq('restaurant_id', id)
  await admin.from('restaurants_tarifs').delete().eq('restaurant_id', id)
  await admin.from('restaurant_opening_slots').delete().eq('restaurant_id', id)
  await admin.from('restaurant_images').delete().eq('restaurant_id', id)

  const { error } = await admin.from('restaurants').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/restaurants', 'page')
  revalidatePath(`/restaurants/${id}`, 'page')
  revalidatePath('/admin/restaurants')
  revalidatePath('/', 'layout')
  redirect('/admin/restaurants')
}
