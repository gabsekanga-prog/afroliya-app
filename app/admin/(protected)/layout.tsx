import type { ReactNode } from 'react'
import Link from 'next/link'

import { requireAdmin } from '@/lib/admin-session'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

import { AdminLogoutButton } from './admin-logout-button'

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireAdmin()
  const adminConfigured = getSupabaseAdmin() !== null

  return (
    <div className="min-h-screen bg-stone-100 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <Link
              href="/admin"
              className="text-xl font-bold text-brand hover:underline"
            >
              Admin Afroliya
            </Link>
            <nav className="flex flex-wrap gap-3 text-lg">
              <Link
                href="/"
                className="text-neutral-500 hover:text-brand hover:underline"
              >
                Voir le site
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
        {!adminConfigured ? (
          <div className="border-t border-amber-200 bg-amber-50 px-4 py-3 text-lg text-amber-950 sm:px-6">
            Définissez <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{' '}
            dans les variables d&apos;environnement pour activer la sauvegarde en base.
          </div>
        ) : null}
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  )
}
