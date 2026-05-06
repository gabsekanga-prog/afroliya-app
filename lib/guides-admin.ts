import type { GuideSubsection } from '@/lib/guide-types'
import { parseSubsections } from '@/lib/guides-parse'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type GuideAdmin = {
  slug: string
  title: string
  image_src: string
  image_alt: string | null
  intro: string | null
  subsections: GuideSubsection[]
  published: boolean
  sort_order: number
}

type GuideRowAdmin = {
  slug: string
  title: string
  image_src: string
  image_alt: string | null
  intro: string | null
  subsections: unknown
  published: boolean
  sort_order: number
}

function mapAdminRow(row: GuideRowAdmin): GuideAdmin {
  return {
    slug: row.slug,
    title: row.title,
    image_src: row.image_src,
    image_alt: row.image_alt,
    intro: row.intro,
    subsections: parseSubsections(row.subsections),
    published: row.published,
    sort_order: row.sort_order,
  }
}

export async function fetchGuidesAdmin(): Promise<GuideAdmin[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('guides')
    .select(
      'slug, title, image_src, image_alt, intro, subsections, published, sort_order',
    )
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[guides-admin] list', error.message)
    return []
  }

  return ((data ?? []) as GuideRowAdmin[]).map(mapAdminRow)
}

export async function fetchGuideAdminBySlug(
  slug: string,
): Promise<GuideAdmin | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data, error } = await admin
    .from('guides')
    .select(
      'slug, title, image_src, image_alt, intro, subsections, published, sort_order',
    )
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('[guides-admin] by slug', error.message)
    return null
  }

  if (!data) return null

  return mapAdminRow(data as GuideRowAdmin)
}

export function subsectionsToJsonbPayload(
  items: GuideSubsection[],
): Record<string, unknown>[] {
  return items.map((s) => ({
    title: s.title,
    image_src: s.imageSrc,
    image_alt: s.imageAlt,
    description: s.description,
    href: s.href,
    button_label: s.buttonLabel,
  }))
}
