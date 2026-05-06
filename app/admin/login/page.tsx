import Link from 'next/link'
import { redirect } from 'next/navigation'

import { isAdminSession } from '@/lib/admin-session'

import { AdminLoginForm } from './login-form'

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect('/admin')
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 text-neutral-900">
      <div className="mx-auto max-w-lg text-center">
        <Link href="/" className="text-lg text-brand hover:underline">
          ← Retour au site
        </Link>
        <h1 className="mt-8 text-3xl font-bold">Administration Afroliya</h1>
        <p className="mt-2 text-lg text-neutral-600">
          Accès réservé. Utilisez le mot de passe défini dans{' '}
          <code className="rounded bg-neutral-200 px-1">ADMIN_PASSWORD</code>.
        </p>
        <AdminLoginForm />
      </div>
    </main>
  )
}
