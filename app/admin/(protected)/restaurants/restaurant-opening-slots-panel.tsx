'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import type { RestaurantOpeningSlotAdminRow } from '@/lib/restaurant-relations-admin'

import { saveRestaurantOpeningSlotsAction } from './actions'

const DAY_OPTIONS = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
]

function timeForInput(t: string | null | undefined): string {
  if (!t) return ''
  const s = String(t).trim()
  if (/^\d{2}:\d{2}:\d{2}/.test(s)) return s.slice(0, 5)
  if (/^\d{1,2}:\d{2}$/.test(s)) return s.padStart(5, '0')
  return ''
}

type RowState = {
  key: string
  day: number
  open_time: string
  close_time: string
  sort_order: number
}

function mapSlotsToRows(slots: RestaurantOpeningSlotAdminRow[]): RowState[] {
  return slots.map((s, i) => ({
    key: s.id,
    day: typeof s.day === 'number' && s.day >= 0 && s.day <= 6 ? s.day : 1,
    open_time: timeForInput(s.open_time),
    close_time: timeForInput(s.close_time),
    sort_order: s.sort_order ?? i,
  }))
}

function buildPayload(rows: RowState[]) {
  return rows
    .filter((r) => r.open_time.trim() && r.close_time.trim())
    .map((r, index) => ({
      day: r.day,
      open_time: r.open_time.trim(),
      close_time: r.close_time.trim(),
      sort_order: r.sort_order ?? index,
    }))
}

type Props = {
  restaurantId: string
  slots: RestaurantOpeningSlotAdminRow[]
}

export function RestaurantOpeningSlotsPanel({ restaurantId, slots }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<RowState[]>(() => mapSlotsToRows(slots))

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        key: `new-${crypto.randomUUID()}`,
        day: 1,
        open_time: '12:00',
        close_time: '14:30',
        sort_order: prev.length,
      },
    ])
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key))
  }

  function updateRow(key: string, patch: Partial<Omit<RowState, 'key'>>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  }

  function save() {
    setError(null)
    const fd = new FormData()
    fd.set('restaurant_id', restaurantId)
    fd.set('slots_json', JSON.stringify(buildPayload(rows)))
    startTransition(async () => {
      const res = await saveRestaurantOpeningSlotsAction(undefined, fd)
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <section className="mt-10 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Horaires (restaurant_opening_slots)</h2>
      <p className="text-lg text-neutral-600">
        Jour au format calendrier (0 = dimanche … 6 = samedi). Ajoutez plusieurs lignes pour le même jour
        (ex. midi et soir). Les créneaux incomplets (heure manquante) sont ignorés à l’enregistrement.
      </p>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-800">{error}</p> : null}

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-[140px_1fr_1fr_auto]"
          >
            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
              Jour
              <select
                value={row.day}
                onChange={(e) => updateRow(row.key, { day: Number(e.target.value) })}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              >
                {DAY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
              Ouverture
              <input
                type="time"
                value={row.open_time}
                onChange={(e) => updateRow(row.key, { open_time: e.target.value })}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
              Fermeture
              <input
                type="time"
                value={row.close_time}
                onChange={(e) => updateRow(row.key, { close_time: e.target.value })}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-stone-50 sm:w-auto"
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addRow}
          className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-lg font-normal text-neutral-800 transition hover:bg-stone-50"
        >
          Ajouter un créneau
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a] disabled:opacity-60"
        >
          {pending ? 'Enregistrement…' : 'Enregistrer les horaires'}
        </button>
      </div>
    </section>
  )
}
