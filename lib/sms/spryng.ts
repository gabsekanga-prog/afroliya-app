function normalizeSmsRecipient(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('00')) return digits.slice(2)
  if (digits.startsWith('0')) return `32${digits.slice(1)}`
  return digits
}

type SendSmsParams = {
  recipients: string[]
  body: string
  reference?: string
}

const SPRYNG_API_BASE = 'https://rest.spryngsms.com/v1'

export class SmsConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SmsConfigurationError'
  }
}

export class SmsDeliveryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SmsDeliveryError'
  }
}

/** Envoi SMS via [Spryng REST API](https://docs.spryngsms.com/). */
export async function sendSpryngSms(params: SendSmsParams): Promise<void> {
  const apiKey = process.env.SPRYNG_API_KEY?.trim()
  const originator = (process.env.SPRYNG_ORIGINATOR?.trim() || 'Afroliya').slice(0, 11)

  if (!apiKey) {
    throw new SmsConfigurationError('SPRYNG_API_KEY manquant.')
  }

  const recipients = params.recipients
    .map(normalizeSmsRecipient)
    .filter((phone) => phone.length >= 10)

  if (!recipients.length) {
    throw new SmsConfigurationError('Aucun numéro SMS valide.')
  }

  const response = await fetch(`${SPRYNG_API_BASE}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'afroliya-app/1.0',
    },
    body: JSON.stringify({
      encoding: 'auto',
      body: params.body,
      route: 'business',
      originator,
      recipients,
      reference: params.reference,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new SmsDeliveryError(`Spryng ${response.status}: ${body}`)
  }
}
