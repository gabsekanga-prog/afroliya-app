type SendEmailParams = {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export class EmailConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmailConfigurationError'
  }
}

export class EmailDeliveryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmailDeliveryError'
  }
}

function getResendConfig(): { apiKey: string; from: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()

  if (!apiKey) {
    throw new EmailConfigurationError('RESEND_API_KEY manquant.')
  }

  if (!from) {
    throw new EmailConfigurationError(
      'RESEND_FROM_EMAIL manquant. Exemple : Afroliya <reservations@afroliya.be>',
    )
  }

  return { apiKey, from }
}

function parseResendError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string }
    const message = parsed.message ?? body

    if (status === 403 && message.includes('domain is not verified')) {
      return 'Le domaine d’envoi n’est pas vérifié dans Resend. Vérifiez RESEND_FROM_EMAIL et le domaine configuré sur resend.com/domains.'
    }

    return message
  } catch {
    return body || `Erreur Resend (${status}).`
  }
}

export async function sendTransactionalEmail(params: SendEmailParams): Promise<void> {
  const { apiKey, from } = getResendConfig()
  const to = Array.isArray(params.to) ? params.to : [params.to]

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new EmailDeliveryError(parseResendError(response.status, body))
  }
}
