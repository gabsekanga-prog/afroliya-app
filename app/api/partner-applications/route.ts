import { NextResponse } from 'next/server'

import { EmailConfigurationError, EmailDeliveryError, sendAdminSiteNotification } from '@/lib/email/sendgrid'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const OFFERS = ['standard', 'premium'] as const

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

  const restaurant = String(body.restaurant ?? '').trim()
  const restaurantDetails = String(body.restaurant_details ?? '').trim()
  const offer = String(body.offer ?? '').trim()
  const contactName = String(body.contact_name ?? '').trim()
  const phone = String(body.phone ?? '').trim()
  const email = String(body.email ?? '')
    .trim()
    .toLowerCase()

  if (!restaurant || !contactName || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Champs invalides.' }, { status: 400 })
  }

  if (!OFFERS.includes(offer as (typeof OFFERS)[number])) {
    return NextResponse.json({ error: 'Offre invalide.' }, { status: 400 })
  }

  const { error: insertError } = await admin.from('partner_applications').insert({
    restaurant,
    restaurant_details: restaurantDetails || null,
    offer,
    contact_name: contactName,
    phone,
    email,
  })

  if (insertError) {
    console.error('[partner-applications]', insertError.message)
    return NextResponse.json({ error: 'Enregistrement impossible.' }, { status: 500 })
  }

  const message = [
    'Nouvelle demande de partenariat',
    '',
    `Restaurant : ${restaurant}`,
    restaurantDetails ? `Détails : ${restaurantDetails}` : null,
    `Offre : ${offer}`,
    `Contact : ${contactName}`,
    `Téléphone : ${phone}`,
    `E-mail : ${email}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    await sendAdminSiteNotification({
      subject: 'Nouvelle demande partenaire Afroliya',
      message,
    })
  } catch (err) {
    console.error('[partner-applications] notify', err)

    if (err instanceof EmailConfigurationError || err instanceof EmailDeliveryError) {
      return NextResponse.json(
        { error: 'Demande enregistrée, mais la notification admin a échoué.' },
        { status: 502 },
      )
    }
  }

  return NextResponse.json({ ok: true })
}
