import { normalizeInstagramPostUrl } from '@/lib/instagram-embed'

const FETCH_HEADERS = {
  Accept: 'application/json',
  'User-Agent':
    'Mozilla/5.0 (compatible; Afroliya/1.0; +https://afroliya.com)',
} as const

function decodeHtmlUrl(value: string): string {
  return value.replace(/&amp;/g, '&').trim()
}

/** Extrait une URL d’image depuis le HTML renvoyé par oEmbed (champ html). */
export function extractInstagramThumbnailFromEmbedHtml(html: string): string | null {
  const patterns = [
    /https:\/\/[^"'\s]*cdninstagram\.com\/[^"'\s]+/i,
    /https:\/\/[^"'\s]*fbcdn\.net\/[^"'\s]+/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[0]) return decodeHtmlUrl(match[0])
  }

  return null
}

type OEmbedPayload = {
  thumbnail_url?: string
  html?: string
}

/**
 * Tente de récupérer une vignette via oEmbed (souvent indisponible depuis 2025).
 * Peut encore fonctionner via une image embarquée dans le champ html.
 */
export async function fetchInstagramThumbnailFromOEmbed(
  postUrl: string,
): Promise<string | null> {
  const permalink = normalizeInstagramPostUrl(postUrl)
  if (!permalink) return null

  try {
    const endpoint = `https://api.instagram.com/oembed?url=${encodeURIComponent(permalink)}&omitscript=true`
    const response = await fetch(endpoint, {
      headers: FETCH_HEADERS,
      next: { revalidate: 3600 },
    })

    const contentType = response.headers.get('content-type') ?? ''
    if (!response.ok || !contentType.includes('json')) {
      return null
    }

    const data = (await response.json()) as OEmbedPayload
    const direct = data.thumbnail_url?.trim()
    if (direct) return decodeHtmlUrl(direct)

    if (data.html) {
      return extractInstagramThumbnailFromEmbedHtml(data.html)
    }

    return null
  } catch {
    return null
  }
}

export function resolveInstagramCardThumbnail(
  manualThumbnailUrl: string | null | undefined,
  fallbackCoverUrl: string | null | undefined,
  oEmbedThumbnailUrl: string | null | undefined,
): string | null {
  const manual = manualThumbnailUrl?.trim()
  if (manual) return manual

  const fromOEmbed = oEmbedThumbnailUrl?.trim()
  if (fromOEmbed) return fromOEmbed

  const cover = fallbackCoverUrl?.trim()
  if (cover) return cover

  return null
}
