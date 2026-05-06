import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900">Tableau de bord</h1>
      <p className="mt-2 text-lg text-neutral-600">
        Gérez les fiches restaurants et les guides thématiques publiés sur Afroliya.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/restaurants"
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-brand hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-neutral-900">Restaurants</h2>
          <p className="mt-2 text-lg text-neutral-600">
            Ajouter, modifier ou retirer des restaurants du catalogue public.
          </p>
        </Link>
        <Link
          href="/admin/guides"
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-brand hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-neutral-900">Guides thématiques</h2>
          <p className="mt-2 text-lg text-neutral-600">
            Éditer les guides : titres, intro, couverture et sous-sections.
          </p>
        </Link>
      </div>
    </div>
  )
}
