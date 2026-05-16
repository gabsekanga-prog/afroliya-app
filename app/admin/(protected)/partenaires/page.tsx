import Link from 'next/link'

import { getAdminTableConfig } from '@/lib/admin-table-config'
import { fetchAdminTableRows, type JsonRecord } from '@/lib/admin-table-data'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const OFFER_LABELS: Record<string, string> = {
  basique: 'Basique',
  standard: 'Standard',
  premium: 'Premium',
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-BE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

function cell(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

export default async function AdminPartenairesPage() {
  if (!getSupabaseAdmin()) {
    return (
      <p className="text-lg text-neutral-600">
        Configurez la clé service Supabase pour charger les demandes partenaires.
      </p>
    )
  }

  const config = getAdminTableConfig('partner_applications')
  if (!config) {
    return <p className="text-lg text-red-700">Configuration table manquante.</p>
  }

  const { rows, error } = await fetchAdminTableRows(config)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Demandes partenaires</h1>
          <p className="mt-1 text-lg text-neutral-600">
            Soumissions du formulaire « Devenir partenaire »
            {rows.length > 0
              ? ` — ${rows.length} demande${rows.length !== 1 ? 's' : ''}`
              : ''}
          </p>
        </div>
        <Link
          href="/admin/tables/partner_applications"
          className="text-lg text-brand hover:underline"
        >
          Vue technique (toutes colonnes)
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl bg-red-50 px-3 py-2 text-lg text-red-700">{error}</p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="mt-8 text-lg text-neutral-600">Aucune demande pour le moment.</p>
      ) : null}

      {rows.length > 0 ? (
        <div className="mt-8 space-y-6">
          {rows.map((row) => (
            <PartnerApplicationCard key={String(row.id)} row={row} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function PartnerApplicationCard({ row }: { row: JsonRecord }) {
  const offer = cell(row.offer)
  const offerLabel = OFFER_LABELS[offer] ?? offer

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">{cell(row.restaurant)}</h2>
          <p className="mt-1 text-base text-neutral-600">{formatDate(row.created_at)}</p>
        </div>
        <span className="rounded-full bg-[#f5e6d9] px-3 py-1 text-base font-semibold text-[#8D5524]">
          {offerLabel}
        </span>
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Contact
          </dt>
          <dd className="mt-1 text-lg text-neutral-900">{cell(row.contact_name)}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Téléphone
          </dt>
          <dd className="mt-1 text-lg text-neutral-900">
            {row.phone ? (
              <a href={`tel:${row.phone}`} className="text-brand hover:underline">
                {cell(row.phone)}
              </a>
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            E-mail
          </dt>
          <dd className="mt-1 text-lg text-neutral-900">
            {row.email ? (
              <a href={`mailto:${row.email}`} className="text-brand hover:underline">
                {cell(row.email)}
              </a>
            ) : (
              '—'
            )}
          </dd>
        </div>
        {row.restaurant_details ? (
          <div className="sm:col-span-2">
            <dt className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Détails du restaurant
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-lg leading-relaxed text-neutral-700">
              {cell(row.restaurant_details)}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  )
}
