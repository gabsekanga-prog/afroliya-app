import Link from 'next/link'

import { fetchRestaurantsAdmin } from '@/lib/restaurants-admin'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export default async function AdminRestaurantsPage() {
  if (!getSupabaseAdmin()) {
    return (
      <p className="text-lg text-neutral-600">
        Configurez la clé service Supabase pour charger les restaurants.
      </p>
    )
  }

  const list = await fetchRestaurantsAdmin()

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Restaurants</h1>
          <p className="mt-1 text-lg text-neutral-600">
            {list.length} fiche{list.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/restaurants/nouveau"
          className="inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
        >
          Nouveau restaurant
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-lg">
          <thead className="border-b border-neutral-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Ville</th>
              <th className="px-4 py-3 font-semibold">Publié</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium">{r.nom}</td>
                <td className="px-4 py-3 text-neutral-600">{r.slug}</td>
                <td className="px-4 py-3 text-neutral-600">{r.ville}</td>
                <td className="px-4 py-3">{r.published ? 'Oui' : 'Non'}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/restaurants/${r.id}`}
                    className="font-semibold text-brand hover:underline"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
