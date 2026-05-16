import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TableCreateForm } from '@/app/admin/(protected)/tables/table-create-form'
import { TableRowsEditor } from '@/app/admin/(protected)/tables/table-rows-editor'
import { getAdminTableConfig } from '@/lib/admin-table-config'
import { getAdminTableColumnInputKinds } from '@/lib/admin-table-column-input-types'
import {
  fetchAdminTableColumns,
  fetchAdminTableRows,
  type JsonRecord,
} from '@/lib/admin-table-data'

type Params = { table: string }

function getColumns(rows: JsonRecord[]): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    for (const col of Object.keys(row)) set.add(col)
  }
  return [...set]
}

function parseEditKey(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const key: Record<string, string> = {}
    for (const [name, value] of Object.entries(parsed)) {
      if (value === null || value === undefined) return null
      key[name] = String(value)
    }
    return key
  } catch {
    return null
  }
}

function rowMatchesKey(row: JsonRecord, key: Record<string, string>): boolean {
  return Object.entries(key).every(([column, value]) => String(row[column] ?? '') === value)
}

export default async function AdminTableDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<{ edit?: string }>
}) {
  const { table } = await params
  const { edit } = await searchParams
  const config = getAdminTableConfig(table)
  if (!config) notFound()

  const { columns: schemaColumns } = await fetchAdminTableColumns(config)
  const { rows, error } = await fetchAdminTableRows(config)
  const columns =
    config.columns?.length
      ? config.columns
      : schemaColumns.length > 0
        ? schemaColumns
        : getColumns(rows)

  const columnInputKinds = getAdminTableColumnInputKinds(config.name)
  const editKey = parseEditKey(edit)
  const rowToEdit =
    editKey && rows.length > 0 ? rows.find((row) => rowMatchesKey(row, editKey)) ?? null : null
  const initialValues = rowToEdit ?? undefined

  return (
    <div className="space-y-6">
      <Link href="/admin/tables" className="text-lg text-brand hover:underline">
        ← Toutes les tables
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{config.label}</h1>
        <p className="mt-1 font-mono text-base text-neutral-600">{config.name}</p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-lg text-red-700">{error}</p>
      ) : null}

      <TableCreateForm
        table={config.name}
        columns={columns}
        keyColumns={config.primaryKey}
        initialValues={initialValues}
        editing={Boolean(rowToEdit)}
        columnInputKinds={columnInputKinds}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Lignes ({rows.length})</h2>
          <p className="text-sm text-neutral-600">Affichage limité à 200 lignes</p>
        </div>

        {rows.length === 0 ? (
          <p className="text-lg text-neutral-600">Aucune donnée.</p>
        ) : null}

        {rows.length > 0 ? (
          <TableRowsEditor
            table={config.name}
            columns={columns}
            keyColumns={config.primaryKey}
            rows={rows}
          />
        ) : null}
      </div>
    </div>
  )
}
