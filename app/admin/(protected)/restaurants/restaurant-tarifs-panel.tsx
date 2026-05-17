'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { RestaurantTarifAdminRow, TarifCatalogRow } from '@/lib/restaurant-relations-admin'

import { addRestaurantTarifAction, deleteRestaurantTarifAction } from './actions'

function tarifLabel(row: RestaurantTarifAdminRow): string {
  const t = row.tarifs
  const list = Array.isArray(t) ? t : t != null ? [t] : []
  const first = list[0]
  return (first?.label ?? '').trim() || first?.key || row.tarif_key
}

function AddTarifForm({
  restaurantId,
  options,
}: {
  restaurantId: string
  options: TarifCatalogRow[]
}) {
  const router = useRouter()
  const [key, setKey] = useState(0)
  const [state, action] = useActionState(addRestaurantTarifAction, {})

  useEffect(() => {
    if (state?.ok) {
      setKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  if (!options.length) {
    return (
      <p className="text-base text-neutral-600">
        Aucune entrée dans la table <code className="rounded bg-stone-200 px-1">tarifs</code>. Ajoutez des
        clés dans Supabase pour les proposer ici.
      </p>
    )
  }

  return (
    <form key={key} action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-base font-semibold text-neutral-800">
        Ajouter un tarif
        <select
          name="tarif_key"
          required
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          defaultValue=""
        >
          <option value="" disabled>
            Choisir…
          </option>
          {options.map((t) => (
            <option key={t.key} value={t.key}>
              {(t.label ?? '').trim() || t.key}
            </option>
          ))}
        </select>
      </label>
      {state?.error ? <p className="w-full text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        className="rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
      >
        Associer
      </button>
    </form>
  )
}

function TarifRow({ restaurantId, row }: { restaurantId: string; row: RestaurantTarifAdminRow }) {
  const router = useRouter()
  const [state, action] = useActionState(deleteRestaurantTarifAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <div>
        <p className="font-medium text-neutral-900">{tarifLabel(row)}</p>
        <p className="text-sm text-neutral-500">clé : {row.tarif_key}</p>
      </div>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <form action={action}>
        <input type="hidden" name="restaurant_id" value={restaurantId} />
        <input type="hidden" name="tarif_key" value={row.tarif_key} />
        <button
          type="submit"
          className="text-base font-semibold text-red-800 underline-offset-2 hover:underline"
        >
          Retirer
        </button>
      </form>
    </li>
  )
}

type Props = {
  restaurantId: string
  assigned: RestaurantTarifAdminRow[]
  catalog: TarifCatalogRow[]
}

export function RestaurantTarifsPanel({ restaurantId, assigned, catalog }: Props) {
  const assignedKeys = useMemo(() => new Set(assigned.map((a) => a.tarif_key)), [assigned])
  const addOptions = useMemo(
    () => catalog.filter((t) => !assignedKeys.has(t.key)),
    [catalog, assignedKeys],
  )

  return (
    <section className="mt-10 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Tarifs (restaurants_tarifs)</h2>
      <p className="text-lg text-neutral-600">
        Lie le restaurant à des entrées de la table <code className="rounded bg-stone-200 px-1">tarifs</code>{' '}
        (clé étrangère <code className="rounded bg-stone-200 px-1">tarif_key</code>).
      </p>
      {assigned.length ? (
        <ul className="space-y-2">
          {assigned.map((row) => (
            <TarifRow key={row.tarif_key} restaurantId={restaurantId} row={row} />
          ))}
        </ul>
      ) : (
        <p className="text-lg text-neutral-600">Aucun tarif associé.</p>
      )}
      <AddTarifForm restaurantId={restaurantId} options={addOptions} />
    </section>
  )
}
