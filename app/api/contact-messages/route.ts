import { NextResponse } from 'next/server'

import { EmailConfigurationError, EmailDeliveryError, sendAdminSiteNotification } from '@/lib/email/sendgrid'
import { syncSendGridContact } from '@/lib/email/sendgrid-contacts'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const subject = String(body.subject ?? '').trim()
  const message = String(body.message ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()

  if (subject.length < 3) {
    return NextResponse.json({ error: 'Indiquez un sujet (au moins 3 caractères).' }, { status: 400 })
  }

  if (message.length < 10) {
    return NextResponse.json({ error: 'Votre message doit contenir au moins 10 caractères.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 })
  }

  const notification = [
    'Nouveau message via la page contact',
    '',
    `Sujet : ${subject}`,
    `E-mail : ${email}`,
    '',
    message,
  ].join('\n')

  try {
    await sendAdminSiteNotification({
      subject: `[Afroliya] Contact — ${subject}`,
      message: notification,
    })
  } catch (err) {
    console.error('[contact-messages]', err)

    if (err instanceof EmailConfigurationError || err instanceof EmailDeliveryError) {
      return NextResponse.json(
        { error: 'Envoi impossible pour le moment. Écrivez-nous à contact@afroliya.be.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ error: 'Envoi impossible. Réessayez plus tard.' }, { status: 500 })
  }

  void syncSendGridContact({ email, source: 'contact' })

  return NextResponse.json({ ok: true })
}
