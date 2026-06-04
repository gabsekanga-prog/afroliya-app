import { NextResponse } from 'next/server'

import { EmailConfigurationError, EmailDeliveryError } from '@/lib/email/sendgrid'
import { sendEmailVerificationCode } from '@/lib/reservation-notifications'
import { generateEmailVerificationCode } from '@/lib/reservations'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Service indisponible.' }, { status: 503 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const email = String(body.email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail invalide.' }, { status: 400 })
  }

  const { data: verified } = await admin
    .from('verified_client_emails')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (verified) {
    return NextResponse.json({ ok: true, alreadyVerified: true })
  }

  const code = generateEmailVerificationCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  const { error } = await admin.from('email_verification_codes').insert({
    email,
    code,
    expires_at: expiresAt,
  })

  if (error) {
    console.error('[email-code]', error.message)
    return NextResponse.json({ error: 'Envoi impossible.' }, { status: 500 })
  }

  try {
    await sendEmailVerificationCode(email, code)
  } catch (err) {
    console.error('[email-code] send', err)

    if (err instanceof EmailConfigurationError) {
      return NextResponse.json(
        { error: 'Envoi d’e-mail non configuré sur le serveur. Contactez l’équipe Afroliya.' },
        { status: 503 },
      )
    }

    if (err instanceof EmailDeliveryError) {
      return NextResponse.json({ error: err.message }, { status: 502 })
    }

    return NextResponse.json({ error: 'Envoi du code impossible.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
