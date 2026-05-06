import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'afroliya_admin'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Secret pour signer les cookies de session admin.
 * - Préférez `ADMIN_SESSION_SECRET` (longue chaîne aléatoire) en production.
 * - Sinon, une clé est dérivée de `ADMIN_PASSWORD` pour éviter une config supplémentaire en local.
 */
function getSessionSecret(): string | null {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim()
  if (explicit) return explicit

  const password = process.env.ADMIN_PASSWORD?.trim()
  if (!password) return null

  return createHash('sha256')
    .update(`afroliya-admin-session-v1|${password}`)
    .digest('hex')
}

export function signAdminSession(): string | null {
  const secret = getSessionSecret()
  if (!secret) return null
  const exp = Date.now() + MAX_AGE_MS
  const payload = JSON.stringify({ exp })
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}::${sig}`).toString('base64url')
}

export function verifyAdminSessionToken(token: string): boolean {
  const secret = getSessionSecret()
  if (!secret) return false
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8')
    const sep = '::'
    const i = raw.lastIndexOf(sep)
    if (i === -1) return false
    const payload = raw.slice(0, i)
    const sig = raw.slice(i + sep.length)
    const expect = createHmac('sha256', secret).update(payload).digest('hex')
    const a = Buffer.from(sig, 'utf8')
    const b = Buffer.from(expect, 'utf8')
    if (a.length !== b.length) return false
    if (!timingSafeEqual(a, b)) return false
    const { exp } = JSON.parse(payload) as { exp: number }
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyAdminSessionToken(token)
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminSession())) redirect('/admin/login')
}

export { COOKIE_NAME }
