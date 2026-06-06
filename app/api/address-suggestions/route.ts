import { NextResponse } from 'next/server'

import { EmailConfigurationError, EmailDeliveryError, sendAdminSiteNotification } from '@/lib/email/sendgrid'
import { syncSendGridContact } from '@/lib/email/sendgrid-contacts'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Service indisponible.' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const restaurantName = String(body.restaurant_name ?? '').trim()
  const commune = String(body.commune ?? '').trim()
  const details = String(body.details ?? '').trim()
  const email = String(body.email ?? '').trim()
  const guideSlug = String(body.guide_slug ?? '').trim()

  if (restaurantName.length < 2 || commune.length < 2) {
    return NextResponse.json({ error: 'Champs invalides.' }, { status: 400 })
  }

  const { error: insertError } = await admin.from('address_suggestions').insert({
    guide_slug: guideSlug || null,
    restaurant_name: restaurantName,
    commune,
    details: details || null,
    email: email || null,
  })

  if (insertError) {
    console.error('[address-suggestions]', insertError.message)
    return NextResponse.json({ error: 'Enregistrement impossible.' }, { status: 500 })
  }

  const message = [
    'Nouvelle suggestion d’adresse',
    '',
    guideSlug ? `Guide : ${guideSlug}` : null,
    `Restaurant : ${restaurantName}`,
    `Quartier / commune : ${commune}`,
    details ? `Détails : ${details}` : null,
    email ? `E-mail : ${email}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    await sendAdminSiteNotification({
      subject: 'Nouvelle suggestion d’adresse Afroliya',
      message,
    })
  } catch (err) {
    console.error('[address-suggestions] notify', err)

    if (err instanceof EmailConfigurationError || err instanceof EmailDeliveryError) {
      return NextResponse.json(
        { error: 'Suggestion enregistrée, mais la notification admin a échoué.' },
        { status: 502 },
      )
    }
  }

  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    void syncSendGridContact({ email, source: 'address_suggestion' })
  }

  return NextResponse.json({ ok: true })
}
