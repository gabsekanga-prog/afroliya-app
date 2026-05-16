'use server'

import { randomUUID } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/admin-session'
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
  const city = String(formData.get('city') ?? '').trim()
  const description = emptyToNull(String(formData.get('description') ?? ''))
  const bookable = formData.has('bookable')
  const google_quotation = parseGoogleNote(String(formData.get('google_quotation') ?? ''))
  const website_url = emptyToNull(String(formData.get('website_url') ?? ''))
  const phone = emptyToNull(String(formData.get('phone') ?? ''))
  const email = emptyToNull(String(formData.get('email') ?? ''))
  const address = emptyToNull(String(formData.get('address') ?? ''))
  const google_maps_link = emptyToNull(String(formData.get('google_maps_link') ?? ''))
  const instagram_url = emptyToNull(String(formData.get('instagram_url') ?? ''))
  const facebook_url = emptyToNull(String(formData.get('facebook_url') ?? ''))
  const whatsapp_phone = emptyToNull(String(formData.get('whatsapp_phone') ?? ''))

  if (!name || !city) {
    return { error: 'Le nom et la ville sont obligatoires.' }
  }

  const row = {
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
    whatsapp_phone,
  }

  if (id && UUID_RE.test(id)) {
    const { error } = await admin.from('restaurants').update(row).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/restaurants', 'page')
    revalidatePath(`/restaurants/${id}`, 'page')
    revalidatePath('/admin/restaurants')
    revalidatePath(`/admin/restaurants/${id}`)
    revalidatePath('/', 'layout')
    return { ok: true, id }
  }

  const { data: inserted, error } = await admin
    .from('restaurants')
    .insert(row)
    .select('id')
    .single()
  if (error) return { error: error.message }

  revalidatePath('/restaurants', 'page')
  revalidatePath('/admin/restaurants')
  revalidatePath('/', 'layout')
  if (typeof inserted?.id === 'string') {
    redirect(`/admin/restaurants/${inserted.id}`)
  }
  return { error: 'Création sans identifiant retourné' }
}

function revalidateRestaurantPublicAndAdmin(restaurantId: string) {
  revalidatePath('/restaurants', 'page')
  revalidatePath(`/restaurants/${restaurantId}`, 'page')
  revalidatePath('/admin/restaurants')
  revalidatePath(`/admin/restaurants/${restaurantId}`)
  revalidatePath('/', 'layout')
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
