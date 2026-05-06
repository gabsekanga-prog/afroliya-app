import Link from 'next/link'
import { notFound } from 'next/navigation'

import { fetchGuideAdminBySlug } from '@/lib/guides-admin'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

import { GuideForm } from '../guide-form'

type Params = { slug: string }

export default async function AdminEditGuidePage({
  params,
}: {
  params: Promise<Params>
}) {
  if (!getSupabaseAdmin()) notFound()

  const { slug } = await params
  const decoded = decodeURIComponent(slug)
  const guide = await fetchGuideAdminBySlug(decoded)
  if (!guide) notFound()

  return (
    <div>
      <Link href="/admin/guides" className="text-lg text-brand hover:underline">
        ← Liste des guides
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-neutral-900">Modifier le guide</h1>
      <div className="mt-8">
        <GuideForm guide={guide} />
      </div>
    </div>
  )
}
