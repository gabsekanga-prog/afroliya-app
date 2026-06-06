import { NextResponse } from 'next/server'

import { sendAdminSiteNotification } from '@/lib/email/sendgrid'
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

  const email = String(body.email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 })
  }

  const { error: insertError } = await admin.from('newsletter').insert({ email })

  if (insertError) {
    if (insertError.code === '23505') {
      void syncSendGridContact({ email, source: 'newsletter' })
      return NextResponse.json({ ok: true, alreadyMember: true })
    }

    console.error('[newsletter]', insertError.message)
    return NextResponse.json({ error: 'Inscription impossible.' }, { status: 500 })
  }

  void syncSendGridContact({ email, source: 'newsletter' })

  try {
    await sendAdminSiteNotification({
      subject: 'Nouvelle inscription communauté Afroliya',
      message: ['Nouvelle inscription à la communauté Afroliya', '', `E-mail : ${email}`].join(
        '\n',
      ),
    })
  } catch (err) {
    console.error('[newsletter] notify', err)
  }

  return NextResponse.json({ ok: true })
}
