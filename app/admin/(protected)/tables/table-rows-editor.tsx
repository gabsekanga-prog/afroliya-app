'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'

import { deleteTableRowAction } from './actions'

type JsonRecord = Record<string, unknown>

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
    >
      {pending ? '...' : 'Suppr'}
    </button>
  )
}

function RowActions({
  table,
  keyColumns,
  row,
}: {
  table: string
  keyColumns: string[]
  row: JsonRecord
}) {
  const editKey: Record<string, unknown> = {}
  for (const keyCol of keyColumns) {
    editKey[keyCol] = row[keyCol]
  }
  const editHref = `/admin/tables/${table}?edit=${encodeURIComponent(JSON.stringify(editKey))}`

  return (
    <div className="flex gap-2">
      <Link
        href={editHref}
        className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 transition hover:bg-stone-50"
      >
        Modifier
      </Link>
      <form action={deleteTableRowAction}>
        <input type="hidden" name="table" value={table} />
        {keyColumns.map((keyCol) => (
          <input
            key={keyCol}
            type="hidden"
            name={`key:${keyCol}`}
            value={String(row[keyCol] ?? '')}
          />
        ))}
        <DeleteButton />
      </form>
    </div>
  )
}

export function TableRowsEditor({
  table,
  columns,
  keyColumns,
  rows,
}: {
  table: string
  columns: string[]
  keyColumns: string[]
  rows: JsonRecord[]
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-stone-50">
          <tr>
            <th className="px-2 py-2 font-semibold text-neutral-800">Actions</th>
            {columns.map((column) => (
              <th key={column} className="px-2 py-2 font-semibold text-neutral-800">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${table}-row-${index}`} className="border-b border-neutral-100 last:border-0">
              <td className="px-2 py-2 align-top">
                <RowActions table={table} keyColumns={keyColumns} row={row} />
              </td>
              {columns.map((column) => (
                <td key={column} className="max-w-xs truncate px-2 py-2 text-neutral-700">
                  {formatCellValue(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
