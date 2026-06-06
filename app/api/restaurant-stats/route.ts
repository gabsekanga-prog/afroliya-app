import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '@/lib/supabase-admin'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const EVENT_TYPE_SET = new Set(['page_view', 'click'])

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

  const restaurantId = String(body.restaurant_id ?? '').trim()
  const eventType = String(body.event_type ?? '').trim()
  const eventKey = String(body.event_key ?? '').trim()
  const pagePath = String(body.page_path ?? '').trim()

  if (!UUID_RE.test(restaurantId)) {
    return NextResponse.json({ error: 'restaurant_id invalide.' }, { status: 400 })
  }

  if (!EVENT_TYPE_SET.has(eventType)) {
    return NextResponse.json({ error: 'event_type invalide.' }, { status: 400 })
  }

  if (eventKey.length < 1 || eventKey.length > 80) {
    return NextResponse.json({ error: 'event_key invalide.' }, { status: 400 })
  }

  const reqHeaders = await headers()
  const referer = reqHeaders.get('referer') ?? null
  const userAgent = reqHeaders.get('user-agent') ?? null

  const { error } = await admin.from('restaurant_stats_events').insert({
    restaurant_id: restaurantId,
    event_type: eventType,
    event_key: eventKey,
    page_path: pagePath || null,
    referer,
    user_agent: userAgent,
  })

  if (error) {
    console.error('[restaurant-stats]', error.message)
    return NextResponse.json({ error: 'Enregistrement impossible.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
