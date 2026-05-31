import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Service indisponible.' }, { status: 503 })
  }

  let body: { email?: string; code?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const email = String(body.email ?? '').trim().toLowerCase()
  const code = String(body.code ?? '').trim()

  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'Code ou e-mail invalide.' }, { status: 400 })
  }

  const { data: row } = await admin
    .from('email_verification_codes')
    .select('id, expires_at')
    .eq('email', email)
    .eq('code', code)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!row) {
    return NextResponse.json({ error: 'Code incorrect.' }, { status: 400 })
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Code expiré. Demandez un nouveau code.' }, { status: 400 })
  }

  await admin.from('verified_client_emails').upsert({ email, verified_at: new Date().toISOString() })
  await admin.from('email_verification_codes').delete().eq('id', row.id)

  return NextResponse.json({ ok: true })
}
