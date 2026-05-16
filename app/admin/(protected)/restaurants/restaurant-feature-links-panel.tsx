'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { RestaurantFeatureCatalogRow, RestaurantFeatureLinkAdminRow } from '@/lib/restaurant-relations-admin'

import { addRestaurantFeatureLinkAction, deleteRestaurantFeatureLinkAction } from './actions'

function featureLabel(row: RestaurantFeatureLinkAdminRow): string {
  const f = row.restaurant_features
  const list = Array.isArray(f) ? f : f != null ? [f] : []
  const first = list[0]
  return (first?.label ?? '').trim() || first?.key || row.feature_key || '—'
}

function AddFeatureForm({
  restaurantId,
  options,
}: {
  restaurantId: string
  options: RestaurantFeatureCatalogRow[]
}) {
  const router = useRouter()
  const [key, setKey] = useState(0)
  const [state, action] = useActionState(addRestaurantFeatureLinkAction, {})

  useEffect(() => {
    if (state?.ok) {
      setKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  if (!options.length) {
    return (
      <p className="text-base text-neutral-600">
        Aucune caractéristique active dans <code className="rounded bg-stone-200 px-1">restaurant_features</code>.
      </p>
    )
  }

  return (
    <form key={key} action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-base font-semibold text-neutral-800">
        Lier une caractéristique
        <select
          name="feature_key"
          required
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          defaultValue=""
        >
          <option value="" disabled>
            Choisir…
          </option>
          {options.map((f) => (
            <option key={f.key} value={f.key}>
              {(f.label ?? '').trim() || f.key}
            </option>
          ))}
        </select>
      </label>
      {state?.error ? <p className="w-full text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        className="rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
      >
        Lier
      </button>
    </form>
  )
}

function FeatureLinkRow({ restaurantId, row }: { restaurantId: string; row: RestaurantFeatureLinkAdminRow }) {
  const router = useRouter()
  const fk = row.feature_key
  const [state, action] = useActionState(deleteRestaurantFeatureLinkAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  if (!fk) return null

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <div>
        <p className="font-medium text-neutral-900">{featureLabel(row)}</p>
        <p className="text-sm text-neutral-500">clé : {fk}</p>
      </div>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <form action={action}>
        <input type="hidden" name="restaurant_id" value={restaurantId} />
        <input type="hidden" name="feature_key" value={fk} />
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
  linked: RestaurantFeatureLinkAdminRow[]
  catalog: RestaurantFeatureCatalogRow[]
}

export function RestaurantFeatureLinksPanel({ restaurantId, linked, catalog }: Props) {
  const linkedKeys = useMemo(() => {
    const keys = new Set<string>()
    for (const row of linked) {
      if (row.feature_key) keys.add(row.feature_key)
    }
    return keys
  }, [linked])

  const addOptions = useMemo(
    () => catalog.filter((f) => !linkedKeys.has(f.key)),
    [catalog, linkedKeys],
  )

  return (
    <section className="mt-10 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Caractéristiques (restaurant_feature_links)</h2>
      <p className="text-lg text-neutral-600">
        Rattache le restaurant à des entrées actives de <code className="rounded bg-stone-200 px-1">restaurant_features</code> (wifi, terrasse, etc.).
      </p>
      {linked.length ? (
        <ul className="space-y-2">
          {linked.map((row) =>
            row.feature_key ? (
              <FeatureLinkRow key={row.feature_key} restaurantId={restaurantId} row={row} />
            ) : null,
          )}
        </ul>
      ) : (
        <p className="text-lg text-neutral-600">Aucune caractéristique liée.</p>
      )}
      <AddFeatureForm restaurantId={restaurantId} options={addOptions} />
    </section>
  )
}
