/** Normalise une URL post / reel / IGTV Instagram pour l’embed officiel. */
export function normalizeInstagramPostUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
    )
    const host = url.hostname.replace(/^www\./i, '').toLowerCase()
    if (host !== 'instagram.com') return null

    const match = url.pathname.match(/^\/(p|reel|tv)\/([^/?#]+)/i)
    if (!match) return null

    const type = match[1]!.toLowerCase()
    const code = match[2]!
    return `https://www.instagram.com/${type}/${code}/`
  } catch {
    return null
  }
}
