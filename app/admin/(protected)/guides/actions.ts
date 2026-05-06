'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { GuideSubsection } from '@/lib/guide-types'
import { requireAdmin } from '@/lib/admin-session'
import { subsectionsToJsonbPayload } from '@/lib/guides-admin'
import { parseSubsections } from '@/lib/guides-parse'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

function validateSubsections(items: GuideSubsection[]): string | null {
  for (const s of items) {
    if (
      !s.title?.trim() ||
      !s.imageSrc?.trim() ||
      !s.description?.trim() ||
      !s.href?.trim() ||
      !s.buttonLabel?.trim()
    ) {
      return 'Chaque sous-section doit avoir un titre, une image, une description, un lien et un libellé de bouton.'
    }
  }
  return null
}

export async function saveGuideAction(
  _prev: { error?: string; ok?: boolean; slug?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; slug?: string }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const originalSlug = String(formData.get('original_slug') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const image_src = String(formData.get('image_src') ?? '').trim()
  const image_alt = String(formData.get('image_alt') ?? '').trim() || null
  const intro = String(formData.get('intro') ?? '').trim() || null
  /** Case à cocher : absente si décochée ; avec Server Actions, préférer `has` à `get === 'on'`. */
  const published = formData.has('published')
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0

  let subParsed: unknown = []
  try {
    subParsed = JSON.parse(String(formData.get('subsections') ?? '[]'))
  } catch {
    return { error: 'JSON des sous-sections invalide' }
  }

  const parsed = parseSubsections(subParsed)
  if (parsed.length > 0) {
    const subErr = validateSubsections(parsed)
    if (subErr) return { error: subErr }
  }

  const subsections = subsectionsToJsonbPayload(parsed)

  if (!slug || !title || !image_src) {
    return { error: 'Slug, titre et image de couverture sont obligatoires.' }
  }

  const row = {
    slug,
    title,
    image_src,
    image_alt,
    intro,
    subsections,
    published,
    sort_order,
  }

  if (originalSlug) {
    const { error } = await admin.from('guides').update(row).eq('slug', originalSlug)
    if (error) return { error: error.message }
  } else {
    const { error } = await admin.from('guides').insert(row)
    if (error) return { error: error.message }
  }

  revalidatePath('/guides', 'page')
  revalidatePath(`/guides/${slug}`, 'page')
  revalidatePath('/admin/guides')
  revalidatePath('/', 'layout')

  if (!originalSlug) {
    redirect(`/admin/guides/${encodeURIComponent(slug)}`)
  }
  if (originalSlug !== slug) {
    redirect(`/admin/guides/${encodeURIComponent(slug)}`)
  }

  return { ok: true, slug }
}

export async function deleteGuideAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const slug = String(formData.get('slug') ?? '').trim()
  if (!slug) return { error: 'Slug manquant' }

  const { error } = await admin.from('guides').delete().eq('slug', slug)
  if (error) return { error: error.message }

  revalidatePath('/guides', 'page')
  revalidatePath(`/guides/${slug}`, 'page')
  revalidatePath('/admin/guides')
  revalidatePath('/', 'layout')
  redirect('/admin/guides')
}
