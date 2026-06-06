import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '@/lib/supabase-admin'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

  const guideId = String(body.guide_id ?? '').trim()
  const pagePath = String(body.page_path ?? '').trim()

  if (!UUID_RE.test(guideId)) {
    return NextResponse.json({ error: 'guide_id invalide.' }, { status: 400 })
  }

  const { data: guide, error: guideError } = await admin
    .from('guides')
    .select('id')
    .eq('id', guideId)
    .eq('published', true)
    .maybeSingle()

  if (guideError) {
    console.error('[guide-stats]', guideError.message)
    return NextResponse.json({ error: 'Vérification impossible.' }, { status: 500 })
  }

  if (!guide) {
    return NextResponse.json({ error: 'Guide introuvable.' }, { status: 404 })
  }

  const reqHeaders = await headers()
  const referer = reqHeaders.get('referer') ?? null
  const userAgent = reqHeaders.get('user-agent') ?? null

  const { error } = await admin.from('guide_page_views').insert({
    guide_id: guideId,
    page_path: pagePath || null,
    referer,
    user_agent: userAgent,
  })

  if (error) {
    console.error('[guide-stats]', error.message)
    return NextResponse.json({ error: 'Enregistrement impossible.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
