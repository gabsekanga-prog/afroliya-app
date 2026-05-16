import Link from 'next/link'

import { ADMIN_TABLES } from '@/lib/admin-table-config'

export default function AdminTablesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900">Gestion des tables</h1>
      <p className="mt-2 text-lg text-neutral-600">
        Interface d administration générique pour consulter et modifier les données en base.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {ADMIN_TABLES.map((table) => (
          <Link
            key={table.name}
            href={`/admin/tables/${table.name}`}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <p className="text-xl font-bold text-neutral-900">{table.label}</p>
            <p className="mt-1 text-base text-neutral-600 font-mono">{table.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
