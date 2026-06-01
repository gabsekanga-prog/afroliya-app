const STORAGE_KEY = 'afroliya-community-client-id'

/** Identifiant anonyme persistant (navigateur) pour votes et réactions. */
export function getCommunityClientId(): string {
  if (typeof window === 'undefined') return ''

  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    localStorage.setItem(STORAGE_KEY, id)
  }

  return id
}
