import type { GuideSubsection } from '@/lib/guide-types'

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v.trim() : fallback
}

export function parseSubsections(raw: unknown): GuideSubsection[] {
  if (!Array.isArray(raw)) return []

  const out: GuideSubsection[] = []

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const title = str(o.title)
    const imageSrc = str(o.image_src) || str(o.imageSrc)
    const imageAlt = str(o.image_alt) || str(o.imageAlt)
    const description = str(o.description)
    const href = str(o.href)
    const buttonLabel = str(o.button_label) || str(o.buttonLabel)

    if (!title || !imageSrc || !description || !href || !buttonLabel) continue

    out.push({
      title,
      imageSrc,
      imageAlt: imageAlt || title,
      description,
      href,
      buttonLabel,
    })
  }

  return out
}
