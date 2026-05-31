function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/** Normalise vers chiffres commençant par 32 (Belgique). */
function normalizeBelgianDigits(raw: string): string | null {
  let digits = digitsOnly(raw.trim())
  if (!digits) return null

  if (digits.startsWith('0032')) {
    digits = digits.slice(2)
  } else if (digits.startsWith('0')) {
    digits = `32${digits.slice(1)}`
  } else if (!digits.startsWith('32')) {
    digits = `32${digits}`
  }

  return digits.startsWith('32') ? digits : null
}

/** Affichage belge : +32 avec espaces (ex. +32 471 23 45 67). */
export function formatBelgianPhoneDisplay(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  const digits = normalizeBelgianDigits(trimmed)
  if (!digits) return trimmed

  const national = digits.slice(2)
  if (!national) return trimmed

  if (national.length === 9 && national.startsWith('4')) {
    return `+32 ${national.slice(0, 3)} ${national.slice(3, 5)} ${national.slice(5, 7)} ${national.slice(7, 9)}`
  }

  if (national.length === 8 && national.startsWith('2')) {
    return `+32 ${national.slice(0, 1)} ${national.slice(1, 4)} ${national.slice(4, 6)} ${national.slice(6, 8)}`
  }

  if (national.length === 8) {
    return `+32 ${national.slice(0, 2)} ${national.slice(2, 4)} ${national.slice(4, 6)} ${national.slice(6, 8)}`
  }

  if (national.length === 9) {
    return `+32 ${national.slice(0, 3)} ${national.slice(3, 5)} ${national.slice(5, 7)} ${national.slice(7, 9)}`
  }

  const groups = ['+32']
  let rest = national

  if (rest.startsWith('4') && rest.length >= 3) {
    groups.push(rest.slice(0, 3))
    rest = rest.slice(3)
  } else if (rest.startsWith('2') && rest.length >= 1) {
    groups.push(rest.slice(0, 1))
    rest = rest.slice(1)
  } else if (rest.length >= 2) {
    groups.push(rest.slice(0, 2))
    rest = rest.slice(2)
  }

  while (rest.length > 0) {
    groups.push(rest.slice(0, 2))
    rest = rest.slice(2)
  }

  return groups.join(' ')
}

/** Lien tel: normalisé en +32… */
export function formatBelgianPhoneTelHref(raw: string): string {
  const digits = normalizeBelgianDigits(raw)
  if (!digits) return `tel:${digitsOnly(raw)}`
  return `tel:+${digits}`
}
