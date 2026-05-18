const MENU_TEXT_LOCALE = 'fr-FR'

/** Première lettre en majuscule, le reste en minuscules (ex. « ENTRÉES » → « Entrées »). */
export function formatMenuDisplayText(value: string | null | undefined): string | null {
  if (value == null) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  const lower = trimmed.toLocaleLowerCase(MENU_TEXT_LOCALE)
  return lower.charAt(0).toLocaleUpperCase(MENU_TEXT_LOCALE) + lower.slice(1)
}

export function formatMenuDisplayTextRequired(value: string): string {
  return formatMenuDisplayText(value) ?? ''
}

/** Prix affiché avec le symbole € en suffixe (ex. « 12,50 » → « 12,50 € »). */
export function formatMenuPrice(value: string | null | undefined): string | null {
  if (value == null) return null
  const raw = value.trim().replace(/\u20AC/g, '€')
  if (!raw) return null

  const amount = raw
    .replace(/€/g, '')
    .replace(/\b(?:eur|euros?)\b/gi, '')
    .trim()
    .replace(/\s+/g, ' ')

  if (!amount) return null

  return `${amount} €`
}
