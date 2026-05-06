import { unstable_noStore as noStore } from 'next/cache'

import type { GuideSubsection } from '@/lib/guide-types'
import { parseSubsections } from '@/lib/guides-parse'
import { supabase } from '@/lib/supabase'

export type { GuideSubsection } from '@/lib/guide-types'

/** Champs utilisés par l’app (camelCase). */
export type Guide = {
  slug: string
  title: string
  /** Image de couverture (hero + cartes liste / carrousel). */
  imageSrc: string
  imageAlt: string
  intro: string | null
  subsections: GuideSubsection[]
}

type GuideRow = {
  slug: string
  title: string
  image_src: string
  image_alt: string | null
  intro: string | null
  subsections: unknown
}

function mapRow(row: GuideRow): Guide {
  return {
    slug: row.slug,
    title: row.title,
    imageSrc: row.image_src,
    imageAlt: row.image_alt?.trim() ? row.image_alt : row.title,
    intro: row.intro?.trim() ? row.intro : null,
    subsections: parseSubsections(row.subsections),
  }
}

export async function fetchPublishedGuides(): Promise<Guide[]> {
  noStore()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('guides')
    .select('slug, title, image_src, image_alt, intro, subsections')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[guides] fetchPublishedGuides', error.message)
    return []
  }

  if (!data?.length) return []

  return (data as GuideRow[]).map(mapRow)
}

export async function fetchGuideBySlug(slug: string): Promise<Guide | null> {
  noStore()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('guides')
    .select('slug, title, image_src, image_alt, intro, subsections')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('[guides] fetchGuideBySlug', error.message)
    return null
  }

  if (!data) return null

  return mapRow(data as GuideRow)
}
