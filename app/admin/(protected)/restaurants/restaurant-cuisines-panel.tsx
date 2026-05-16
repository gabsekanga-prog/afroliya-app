'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { CuisineCatalogRow, RestaurantCuisineAdminRow } from '@/lib/restaurant-relations-admin'

import { addRestaurantCuisineAction, deleteRestaurantCuisineAction } from './actions'

function cuisineLabel(row: RestaurantCuisineAdminRow): string {
  const c = row.cuisines
  const list = Array.isArray(c) ? c : c != null ? [c] : []
  const first = list[0]
  return (first?.description ?? '').trim() || first?.key || row.cuisine_key
}

function AddCuisineForm({
  restaurantId,
  options,
}: {
  restaurantId: string
  options: CuisineCatalogRow[]
}) {
  const router = useRouter()
  const [key, setKey] = useState(0)
  const [state, action] = useActionState(addRestaurantCuisineAction, {})

  useEffect(() => {
    if (state?.ok) {
      setKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  if (!options.length) {
    return (
      <p className="text-base text-neutral-600">
        Aucune entrée dans la table <code className="rounded bg-stone-200 px-1">cuisines</code>. Ajoutez des
        clés dans Supabase pour les proposer ici.
      </p>
    )
  }

  return (
    <form key={key} action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-base font-semibold text-neutral-800">
        Ajouter une cuisine
        <select
          name="cuisine_key"
          required
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          defaultValue=""
        >
          <option value="" disabled>
            Choisir…
          </option>
          {options.map((c) => (
            <option key={c.key} value={c.key}>
              {(c.description ?? '').trim() || c.key}
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

function CuisineRow({ restaurantId, row }: { restaurantId: string; row: RestaurantCuisineAdminRow }) {
  const router = useRouter()
  const [state, action] = useActionState(deleteRestaurantCuisineAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <div>
        <p className="font-medium text-neutral-900">{cuisineLabel(row)}</p>
        <p className="text-sm text-neutral-500">clé : {row.cuisine_key}</p>
      </div>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <form action={action}>
        <input type="hidden" name="restaurant_id" value={restaurantId} />
        <input type="hidden" name="cuisine_key" value={row.cuisine_key} />
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
  assigned: RestaurantCuisineAdminRow[]
  catalog: CuisineCatalogRow[]
}

export function RestaurantCuisinesPanel({ restaurantId, assigned, catalog }: Props) {
  const assignedKeys = useMemo(() => new Set(assigned.map((a) => a.cuisine_key)), [assigned])
  const addOptions = useMemo(
    () => catalog.filter((c) => !assignedKeys.has(c.key)),
    [catalog, assignedKeys],
  )

  return (
    <section className="mt-10 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Cuisines (restaurant_cuisines)</h2>
      <p className="text-lg text-neutral-600">
        Lie le restaurant à des entrées de la table <code className="rounded bg-stone-200 px-1">cuisines</code>{' '}
        (clé étrangère <code className="rounded bg-stone-200 px-1">cuisine_key</code>).
      </p>
      {assigned.length ? (
        <ul className="space-y-2">
          {assigned.map((row) => (
            <CuisineRow key={row.cuisine_key} restaurantId={restaurantId} row={row} />
          ))}
        </ul>
      ) : (
        <p className="text-lg text-neutral-600">Aucune cuisine associée.</p>
      )}
      <AddCuisineForm restaurantId={restaurantId} options={addOptions} />
    </section>
  )
}
