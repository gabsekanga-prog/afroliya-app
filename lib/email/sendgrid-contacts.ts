import { formatBelgianPhoneTelHref } from '@/lib/format-phone'

export type SendGridContactSource =
  | 'reservation'
  | 'newsletter'
  | 'contact'
  | 'partner_application'
  | 'address_suggestion'

export type SyncSendGridContactInput = {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  source: SendGridContactSource
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function phoneForSendGrid(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined
  const href = formatBelgianPhoneTelHref(raw)
  if (!href) return raw.trim()
  return href.replace(/^tel:/i, '')
}

function getListIdsForSource(source: SendGridContactSource): string[] {
  const bySource: Record<SendGridContactSource, string | undefined> = {
    reservation: process.env.SENDGRID_LIST_RESERVATION?.trim(),
    newsletter: process.env.SENDGRID_LIST_NEWSLETTER?.trim(),
    contact: process.env.SENDGRID_LIST_CONTACT?.trim(),
    partner_application: process.env.SENDGRID_LIST_PARTNER?.trim(),
    address_suggestion: process.env.SENDGRID_LIST_ADDRESS_SUGGESTION?.trim(),
  }

  const specific = bySource[source]
  if (specific) return [specific]

  const fallback = process.env.SENDGRID_MARKETING_LIST_ID?.trim()
  return fallback ? [fallback] : []
}

/** Crée ou met à jour un contact SendGrid Marketing (upsert par e-mail). Ne lève pas d'erreur. */
export async function syncSendGridContact(input: SyncSendGridContactInput): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY?.trim()
  if (!apiKey) {
    console.warn('[sendgrid-contacts] SENDGRID_API_KEY manquant — contact non synchronisé.')
    return false
  }

  const email = input.email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return false
  }

  const contact: Record<string, string> = { email }

  const firstName = input.firstName?.trim()
  const lastName = input.lastName?.trim()
  if (firstName) contact.first_name = firstName
  if (lastName) contact.last_name = lastName

  const phone = phoneForSendGrid(input.phone)
  if (phone) contact.phone_number = phone

  const body: { contacts: Record<string, string>[]; list_ids?: string[] } = {
    contacts: [contact],
  }

  const listIds = getListIdsForSource(input.source)
  if (listIds.length) {
    body.list_ids = listIds
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('[sendgrid-contacts]', input.source, response.status, text)
      return false
    }

    return true
  } catch (error) {
    console.error(
      '[sendgrid-contacts]',
      input.source,
      error instanceof Error ? error.message : error,
    )
    return false
  }
}

export function syncSendGridContactFromFullName(params: {
  email: string
  fullName?: string
  phone?: string
  source: SendGridContactSource
}): void {
  const { firstName, lastName } = splitFullName(params.fullName ?? '')
  void syncSendGridContact({
    email: params.email,
    firstName,
    lastName,
    phone: params.phone,
    source: params.source,
  })
}
