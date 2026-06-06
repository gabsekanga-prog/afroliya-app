import type { GuideSubsection } from '@/lib/guide-types'
import { parseSubsections } from '@/lib/guides-parse'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type GuidePageViewCountsAdmin = {
  total: number
  last30Days: number
}

export type GuideAdmin = {
  id: string
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
  id: string
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
    id: row.id,
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
      'id, slug, title, image_src, image_alt, intro, subsections, published, sort_order',
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
      'id, slug, title, image_src, image_alt, intro, subsections, published, sort_order',
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

function periodStartIso(days: number): string {
  const start = new Date()
  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  return start.toISOString()
}

export async function fetchGuidePageViewCountsAdmin(): Promise<
  Map<string, GuidePageViewCountsAdmin>
> {
  const admin = getSupabaseAdmin()
  const counts = new Map<string, GuidePageViewCountsAdmin>()
  if (!admin) return counts

  const { data, error } = await admin
    .from('guide_page_views')
    .select('guide_id, created_at')
    .order('created_at', { ascending: false })
    .limit(50000)

  if (error) {
    console.error('[guides-admin] page views', error.message)
    return counts
  }

  const cutoff30 = periodStartIso(30)

  for (const row of data ?? []) {
    const guideId = String(row.guide_id)
    const current = counts.get(guideId) ?? { total: 0, last30Days: 0 }
    current.total += 1
    if (row.created_at >= cutoff30) {
      current.last30Days += 1
    }
    counts.set(guideId, current)
  }

  return counts
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
