import Link from 'next/link'

import { DeleteGuideForm } from '@/app/admin/(protected)/components/delete-guide-form'
import { fetchGuidesAdmin } from '@/lib/guides-admin'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export default async function AdminGuidesPage() {
  if (!getSupabaseAdmin()) {
    return (
      <p className="text-lg text-neutral-600">
        Configurez la clé service Supabase pour charger les guides.
      </p>
    )
  }

  const list = await fetchGuidesAdmin()

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Guides thématiques</h1>
          <p className="mt-1 text-lg text-neutral-600">
            {list.length} guide{list.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/guides/nouveau"
          className="inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
        >
          Nouveau guide
        </Link>
      </div>

      <ul className="mt-8 space-y-4">
        {list.map((g) => (
          <li
            key={g.slug}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-xl font-bold text-neutral-900">{g.title}</p>
              <p className="text-lg text-neutral-600">{g.slug}</p>
              <p className="mt-1 text-base text-neutral-500">
                {g.published ? 'Publié' : 'Brouillon'} — ordre {g.sort_order}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/guides/${encodeURIComponent(g.slug)}`}
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-lg font-semibold text-brand transition hover:bg-stone-50"
              >
                Modifier
              </Link>
              <DeleteGuideForm slug={g.slug} title={g.title} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
