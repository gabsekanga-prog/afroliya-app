'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'

import { createTableRowAction, updateTableRowAction } from './actions'
import type { ColumnInputKind } from '@/lib/admin-table-column-input-types'

function SubmitButton({ editing }: { editing?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a] disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Créer une ligne'}
    </button>
  )
}

export function TableCreateForm({
  table,
  columns,
  keyColumns,
  initialValues,
  editing,
  columnInputKinds,
}: {
  table: string
  columns: string[]
  keyColumns: string[]
  initialValues?: Record<string, unknown>
  editing?: boolean
  columnInputKinds?: Record<string, ColumnInputKind>
}) {
  const action = editing ? updateTableRowAction : createTableRowAction
  const [state, formAction] = useActionState(action, {})

  function getDefaultValue(column: string): string {
    const value = initialValues?.[column]
    if (value === null || value === undefined) return ''
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  function formatForDatetimeLocal(value: unknown): string {
    if (value === null || value === undefined) return ''
    if (typeof value !== 'string') return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm
  }

  function formatForDate(value: unknown): string {
    if (value === null || value === undefined) return ''
    if (typeof value !== 'string') return ''
    const m = value.match(/^(\d{4}-\d{2}-\d{2})/)
    return m?.[1] ?? ''
  }

  function formatForTime(value: unknown): string {
    if (value === null || value === undefined) return ''
    if (typeof value !== 'string') return ''
    const m = value.match(/^(\d{2}:\d{2})/)
    return m?.[1] ?? ''
  }

  function getDefaultByKind(column: string, kind: ColumnInputKind): string {
    const value = initialValues?.[column]
    if (kind === 'boolean') {
      if (value === true) return 'true'
      if (value === false) return 'false'
      if (typeof value === 'string') {
        if (value === 't') return 'true'
        if (value === 'f') return 'false'
      }
      return ''
    }
    if (kind === 'json') return getDefaultValue(column)
    if (kind === 'datetime') return formatForDatetimeLocal(value)
    if (kind === 'date') return formatForDate(value)
    if (kind === 'time') return formatForTime(value)
    return getDefaultValue(column)
  }

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="table" value={table} />
      {editing
        ? keyColumns.map((keyCol) => (
            <input
              key={keyCol}
              type="hidden"
              name={`key:${keyCol}`}
              value={String(initialValues?.[keyCol] ?? '')}
            />
          ))
        : null}
      <h2 className="text-xl font-bold text-neutral-900">
        {editing ? 'Modifier la ligne' : 'Ajouter une ligne'}
      </h2>
      <p className="text-base text-neutral-600">
        Laisser un champ vide pour ne pas l&apos;envoyer.
      </p>
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-700">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-base text-green-900">
          Ligne créée.
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {columns.map((column) => (
          <label
            key={column}
            className="flex flex-col gap-1 text-sm font-semibold text-neutral-800"
          >
            {column}
            {(() => {
              const kind = columnInputKinds?.[column] ?? 'text'
              const baseInputClass =
                'rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300'

              if (kind === 'boolean') {
                return (
                  <select
                    name={`field:${column}`}
                    defaultValue={getDefaultByKind(column, kind)}
                    className={baseInputClass}
                  >
                    <option value="">—</option>
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                )
              }

              if (kind === 'json') {
                return (
                  <textarea
                    name={`field:${column}`}
                    defaultValue={getDefaultByKind(column, kind)}
                    rows={4}
                    className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
                  />
                )
              }

              if (kind === 'number') {
                return (
                  <input
                    name={`field:${column}`}
                    type="number"
                    step="any"
                    defaultValue={getDefaultByKind(column, kind)}
                    className={baseInputClass}
                  />
                )
              }

              if (kind === 'date') {
                return (
                  <input
                    name={`field:${column}`}
                    type="date"
                    defaultValue={getDefaultByKind(column, kind)}
                    className={baseInputClass}
                  />
                )
              }

              if (kind === 'time') {
                return (
                  <input
                    name={`field:${column}`}
                    type="time"
                    defaultValue={getDefaultByKind(column, kind)}
                    className={baseInputClass}
                  />
                )
              }

              if (kind === 'datetime') {
                return (
                  <input
                    name={`field:${column}`}
                    type="datetime-local"
                    defaultValue={getDefaultByKind(column, kind)}
                    className={baseInputClass}
                  />
                )
              }

              // default: text input
              if (kind === 'text' && column === 'description') {
                return (
                  <textarea
                    name={`field:${column}`}
                    defaultValue={getDefaultByKind(column, kind)}
                    rows={4}
                    className={baseInputClass}
                  />
                )
              }

              return (
                <input
                  name={`field:${column}`}
                  type="text"
                  defaultValue={getDefaultByKind(column, kind)}
                  className={baseInputClass}
                />
              )
            })()}
          </label>
        ))}
      </div>
      {columns.length === 0 ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Aucune colonne détectée. Ajoutez une ligne depuis Supabase puis rechargez la page.
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <SubmitButton editing={editing} />
        {editing ? (
          <Link
            href={`/admin/tables/${table}`}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-stone-50"
          >
            Annuler
          </Link>
        ) : null}
      </div>
    </form>
  )
}
