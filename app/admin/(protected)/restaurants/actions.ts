'use server'

import { randomUUID } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/admin-session'
import {
  formatMenuDisplayText,
  formatMenuDisplayTextRequired,
  formatMenuPrice,
} from '@/lib/format-menu-text'
import { parseMenuCsv, type MenuCsvRow } from '@/lib/restaurant-menu-csv'
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
  const city = String(formData.get('city') ?? '').trim()
  const description = emptyToNull(String(formData.get('description') ?? ''))
  const bookable = formData.has('bookable')
  const sponsored = formData.has('sponsored')
  const active = formData.has('active')
  const google_quotation = parseGoogleNote(String(formData.get('google_quotation') ?? ''))
  const google_review_total_value = parseOptionalNonNegativeInt(
    String(formData.get('google_review_total_value') ?? ''),
  )
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

  if (!name || !city) {
    return { error: 'Le nom et la ville sont obligatoires.' }
  }

  const row = {
    name,
    city,
    description,
    bookable,
    sponsored,
    active,
    google_quotation,
    google_review_total_value,
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

async function clearRestaurantMenuData(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  restaurantId: string,
) {
  const { data: sections } = await admin
    .from('restaurant_menu_sections')
    .select('id')
    .eq('restaurant_id', restaurantId)

  const sectionIds = (sections ?? []).map((row: { id: string }) => row.id)
  if (sectionIds.length > 0) {
    const { error: itemsError } = await admin
      .from('restaurant_menu_items')
      .delete()
      .in('section_id', sectionIds)
    if (itemsError) throw new Error(itemsError.message)
  }

  const { error: sectionsError } = await admin
    .from('restaurant_menu_sections')
    .delete()
    .eq('restaurant_id', restaurantId)
  if (sectionsError) throw new Error(sectionsError.message)
}

async function importMenuRows(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  restaurantId: string,
  rows: MenuCsvRow[],
  mode: 'replace' | 'append',
) {
  if (mode === 'replace') {
    await clearRestaurantMenuData(admin, restaurantId)
  }

  const { data: existingSections } = await admin
    .from('restaurant_menu_sections')
    .select('id, name, sort_order')
    .eq('restaurant_id', restaurantId)

  const sectionByName = new Map<string, { id: string; sort_order: number | null }>()
  for (const section of existingSections ?? []) {
    sectionByName.set(formatMenuDisplayTextRequired(String(section.name).trim()), {
      id: section.id,
      sort_order: section.sort_order,
    })
  }

  let nextSectionSort =
    (existingSections ?? []).reduce(
      (max, section) => Math.max(max, Number(section.sort_order) || 0),
      -1,
    ) + 1

  const categoryOrder: string[] = []
  const byCategory = new Map<string, MenuCsvRow[]>()
  for (const row of rows) {
    const category = formatMenuDisplayTextRequired(row.category)
    const normalized: MenuCsvRow = {
      category,
      name: formatMenuDisplayTextRequired(row.name),
      description: formatMenuDisplayText(row.description),
      price: formatMenuPrice(row.price),
    }
    if (!byCategory.has(category)) {
      categoryOrder.push(category)
      byCategory.set(category, [])
    }
    byCategory.get(category)!.push(normalized)
  }

  for (const category of categoryOrder) {
    let sectionId = sectionByName.get(category)?.id
    if (!sectionId) {
      sectionId = randomUUID()
      const { error: sectionError } = await admin.from('restaurant_menu_sections').insert({
        id: sectionId,
        restaurant_id: restaurantId,
        name: category,
        sort_order: nextSectionSort,
        published: true,
      })
      if (sectionError) throw new Error(sectionError.message)
      sectionByName.set(category, { id: sectionId, sort_order: nextSectionSort })
      nextSectionSort += 1
    }

    const { data: existingItems } = await admin
      .from('restaurant_menu_items')
      .select('sort_order')
      .eq('section_id', sectionId)

    let itemSort =
      (existingItems ?? []).reduce(
        (max, item) => Math.max(max, Number(item.sort_order) || 0),
        -1,
      ) + 1

    for (const item of byCategory.get(category) ?? []) {
      const { error: itemError } = await admin.from('restaurant_menu_items').insert({
        id: randomUUID(),
        section_id: sectionId,
        name: item.name,
        description: item.description,
        price: item.price,
        sort_order: itemSort,
        published: true,
      })
      if (itemError) throw new Error(itemError.message)
      itemSort += 1
    }
  }
}

export async function importRestaurantMenuCsvAction(
  _prev: { error?: string; ok?: boolean; imported?: number } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; imported?: number }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId)) return { error: 'Restaurant invalide.' }

  const file = formData.get('csv_file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Sélectionnez un fichier CSV.' }
  }

  const maxBytes = 512 * 1024
  if (file.size > maxBytes) {
    return { error: 'Le fichier CSV ne doit pas dépasser 512 Ko.' }
  }

  const csvText = await file.text()
  const parsed = parseMenuCsv(csvText)
  if (!parsed.ok) return { error: parsed.error }

  const replace = formData.get('menu_import_mode') === 'replace'

  try {
    await importMenuRows(admin, restaurantId, parsed.rows, replace ? 'replace' : 'append')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Import impossible.'
    return { error: message }
  }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true, imported: parsed.rows.length }
}

export async function addRestaurantMenuSectionAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const nameRaw = String(formData.get('section_name') ?? '').trim()
  const name = formatMenuDisplayTextRequired(nameRaw)
  if (!UUID_RE.test(restaurantId) || !nameRaw) {
    return { error: 'Restaurant et nom de section obligatoires.' }
  }

  const sort_order = Number(formData.get('section_sort_order') ?? 0) || 0
  const published = formData.has('section_published')

  const { error } = await admin.from('restaurant_menu_sections').insert({
    id: randomUUID(),
    restaurant_id: restaurantId,
    name,
    sort_order,
    published,
  })
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function addRestaurantMenuItemAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const sectionId = String(formData.get('section_id') ?? '').trim()
  const nameRaw = String(formData.get('item_name') ?? '').trim()
  const name = formatMenuDisplayTextRequired(nameRaw)
  if (!UUID_RE.test(restaurantId) || !UUID_RE.test(sectionId) || !nameRaw) {
    return { error: 'Paramètres invalides.' }
  }

  const { data: section } = await admin
    .from('restaurant_menu_sections')
    .select('id')
    .eq('id', sectionId)
    .eq('restaurant_id', restaurantId)
    .maybeSingle()
  if (!section) return { error: 'Section introuvable pour ce restaurant.' }

  const description = formatMenuDisplayText(String(formData.get('item_description') ?? ''))
  const price = formatMenuPrice(String(formData.get('item_price') ?? ''))
  const sort_order = Number(formData.get('item_sort_order') ?? 0) || 0
  const published = formData.has('item_published')

  const { error } = await admin.from('restaurant_menu_items').insert({
    id: randomUUID(),
    section_id: sectionId,
    name,
    description,
    price,
    sort_order,
    published,
  })
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantMenuSectionAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const sectionId = String(formData.get('section_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !UUID_RE.test(sectionId)) {
    return { error: 'Paramètres invalides.' }
  }

  const { error: itemsError } = await admin
    .from('restaurant_menu_items')
    .delete()
    .eq('section_id', sectionId)
  if (itemsError) return { error: itemsError.message }

  const { error } = await admin
    .from('restaurant_menu_sections')
    .delete()
    .eq('id', sectionId)
    .eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function deleteRestaurantMenuItemAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  const itemId = String(formData.get('item_id') ?? '').trim()
  const sectionId = String(formData.get('section_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId) || !UUID_RE.test(itemId) || !UUID_RE.test(sectionId)) {
    return { error: 'Paramètres invalides.' }
  }

  const { data: section } = await admin
    .from('restaurant_menu_sections')
    .select('id')
    .eq('id', sectionId)
    .eq('restaurant_id', restaurantId)
    .maybeSingle()
  if (!section) return { error: 'Section introuvable.' }

  const { error } = await admin.from('restaurant_menu_items').delete().eq('id', itemId).eq('section_id', sectionId)
  if (error) return { error: error.message }

  revalidateRestaurantPublicAndAdmin(restaurantId)
  return { ok: true }
}

export async function clearRestaurantMenuAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const restaurantId = String(formData.get('restaurant_id') ?? '').trim()
  if (!UUID_RE.test(restaurantId)) return { error: 'Restaurant invalide.' }

  try {
    await clearRestaurantMenuData(admin, restaurantId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Suppression impossible.'
    return { error: message }
  }

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

  const { data: menuSections } = await admin
    .from('restaurant_menu_sections')
    .select('id')
    .eq('restaurant_id', id)
  const menuSectionIds = (menuSections ?? []).map((row: { id: string }) => row.id)
  if (menuSectionIds.length > 0) {
    await admin.from('restaurant_menu_items').delete().in('section_id', menuSectionIds)
  }
  await admin.from('restaurant_menu_sections').delete().eq('restaurant_id', id)
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
