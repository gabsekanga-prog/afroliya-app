import {
  DEFAULT_ADMIN_NOTIFICATION_EMAILS,
  SENDGRID_TEMPLATE_IDS,
  type AdminSiteNotificationTemplateData,
  type SimpleMessageTemplateData,
} from '@/lib/email/sendgrid-templates'

type SendGridFrom = {
  email: string
  name?: string
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

function getSendGridConfig(): { apiKey: string; from: string } {
  const apiKey = process.env.SENDGRID_API_KEY?.trim()
  const from = process.env.SENDGRID_FROM_EMAIL?.trim()

  if (!apiKey) {
    throw new EmailConfigurationError('SENDGRID_API_KEY manquant.')
  }

  if (!from) {
    throw new EmailConfigurationError(
      'SENDGRID_FROM_EMAIL manquant. Exemple : Afroliya <reservations@afroliya.be>',
    )
  }

  return { apiKey, from }
}

export function getAdminNotificationEmails(): string[] {
  const fromEnv = process.env.SENDGRID_ADMIN_EMAILS?.trim()
  if (!fromEnv) return [...DEFAULT_ADMIN_NOTIFICATION_EMAILS]

  const parsed = fromEnv
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)

  return parsed.length ? parsed : [...DEFAULT_ADMIN_NOTIFICATION_EMAILS]
}

function parseFromAddress(from: string): SendGridFrom {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/)

  if (match) {
    return { name: match[1].trim(), email: match[2].trim() }
  }

  return { email: from }
}

function parseSendGridError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as {
      errors?: { message?: string; field?: string }[]
    }

    const messages = parsed.errors
      ?.map((error) => error.message)
      .filter((message): message is string => Boolean(message))

    if (messages?.length) {
      const combined = messages.join(' ')

      if (
        status === 403 &&
        (combined.includes('verified') || combined.includes('Sender Identity'))
      ) {
        return 'L’adresse d’envoi n’est pas vérifiée dans SendGrid. Vérifiez SENDGRID_FROM_EMAIL et l’identité expéditeur dans SendGrid.'
      }

      return combined
    }
  } catch {
    // ignore JSON parse errors
  }

  return body || `Erreur SendGrid (${status}).`
}

type SendTemplateEmailParams = {
  to: string | string[]
  templateId: string
  dynamicTemplateData: Record<string, unknown>
}

async function sendTemplateEmail(params: SendTemplateEmailParams): Promise<void> {
  const { apiKey, from } = getSendGridConfig()
  const to = Array.isArray(params.to) ? params.to : [params.to]
  const fromAddress = parseFromAddress(from)

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: to.map((email) => ({ email })),
          dynamic_template_data: params.dynamicTemplateData,
        },
      ],
      from: fromAddress,
      template_id: params.templateId,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new EmailDeliveryError(parseSendGridError(response.status, body))
  }
}

export async function sendSimpleTemplateEmail(
  to: string,
  data: SimpleMessageTemplateData,
): Promise<void> {
  await sendTemplateEmail({
    to,
    templateId: SENDGRID_TEMPLATE_IDS.simpleMessage,
    dynamicTemplateData: data,
  })
}

export async function sendAdminSiteNotification(
  data: AdminSiteNotificationTemplateData,
): Promise<void> {
  await sendTemplateEmail({
    to: getAdminNotificationEmails(),
    templateId: SENDGRID_TEMPLATE_IDS.adminSiteNotification,
    dynamicTemplateData: data,
  })
}

export { sendTemplateEmail }
