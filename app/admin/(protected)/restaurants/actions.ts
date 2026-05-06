'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/admin-session'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function saveRestaurantAction(
  _prev: { error?: string; ok?: boolean; id?: number } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; id?: number }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const idRaw = formData.get('id')
  const id = idRaw ? Number(idRaw) : NaN
  const slug = String(formData.get('slug') ?? '').trim()
  const nom = String(formData.get('nom') ?? '').trim()
  const cuisine = String(formData.get('cuisine') ?? '').trim()
  const ville = String(formData.get('ville') ?? '').trim()
  const note = String(formData.get('note') ?? '').trim()
  const image = String(formData.get('image') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const published = formData.has('published')
  const sortOrder = Number(formData.get('sort_order') ?? 0) || 0

  if (!slug || !nom || !cuisine || !ville || !note || !image || !description) {
    return { error: 'Tous les champs obligatoires doivent être remplis.' }
  }

  const row = {
    slug,
    nom,
    cuisine,
    ville,
    note,
    image,
    description,
    published,
    sort_order: sortOrder,
  }

  if (Number.isFinite(id) && id > 0) {
    const { error } = await admin.from('restaurants').update(row).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/reserver-un-restaurant')
    revalidatePath(`/reserver-un-restaurant/${slug}`)
    revalidatePath('/admin/restaurants')
    revalidatePath('/', 'layout')
    return { ok: true, id }
  }

  const { data: inserted, error } = await admin
    .from('restaurants')
    .insert(row)
    .select('id')
    .single()
  if (error) return { error: error.message }

  revalidatePath('/reserver-un-restaurant')
  revalidatePath('/admin/restaurants')
  revalidatePath('/', 'layout')
  if (typeof inserted?.id === 'number') {
    redirect(`/admin/restaurants/${inserted.id}`)
  }
  return { error: 'Création sans identifiant retourné' }
}

export async function deleteRestaurantAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant')

  const id = Number(formData.get('id'))
  const slug = String(formData.get('slug') ?? '').trim()
  if (!Number.isFinite(id) || id < 1) throw new Error('Identifiant invalide')

  const { error } = await admin.from('restaurants').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/reserver-un-restaurant')
  if (slug) revalidatePath(`/reserver-un-restaurant/${slug}`)
  revalidatePath('/admin/restaurants')
  revalidatePath('/', 'layout')
  redirect('/admin/restaurants')
}
