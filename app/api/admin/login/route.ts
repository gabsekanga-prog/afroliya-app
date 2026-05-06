import { NextResponse } from 'next/server'

import { COOKIE_NAME, signAdminSession } from '@/lib/admin-session'

export async function POST(request: Request) {
  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD non configuré sur le serveur' },
      { status: 500 },
    )
  }

  const password = body.password?.trim() ?? ''
  if (password.length !== expected.length || password !== expected) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const token = signAdminSession()
  if (!token) {
    return NextResponse.json(
      { error: 'ADMIN_SESSION_SECRET manquant ou invalide' },
      { status: 500 },
    )
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
  return res
}
