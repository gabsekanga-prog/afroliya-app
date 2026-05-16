'use client'

import { useActionState, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { RestaurantDealAdminRow } from '@/lib/restaurant-relations-admin'

import { deleteRestaurantDealAction, saveRestaurantDealAction } from './actions'

function DealFields({
  restaurantId,
  deal,
  submitLabel,
  onSaved,
}: {
  restaurantId: string
  deal: RestaurantDealAdminRow | null
  submitLabel: string
  onSaved?: () => void
}) {
  const router = useRouter()
  const [state, action] = useActionState(saveRestaurantDealAction, {})

  const savedOk = state?.ok === true

  useEffect(() => {
    if (!savedOk) return
    router.refresh()
    onSaved?.()
  }, [savedOk, router, onSaved])

  return (
    <form action={action} className="space-y-3 rounded-xl border border-neutral-200 bg-stone-50 p-4">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      {deal ? <input type="hidden" name="deal_id" value={deal.id} /> : null}
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
        Titre
        <input
          name="deal_title"
          required
          defaultValue={deal?.title ?? ''}
          className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
        Description
        <textarea
          name="deal_description"
          rows={3}
          defaultValue={deal?.description ?? ''}
          className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
        Validité (texte libre)
        <input
          name="deal_validity_text"
          defaultValue={deal?.validity_text ?? ''}
          className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
          placeholder="ex. Jusqu’au 31/12/2026"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
        Ordre d’affichage
        <input
          type="number"
          name="deal_sort_order"
          defaultValue={deal?.sort_order ?? 0}
          className="w-28 rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
        <input
          type="checkbox"
          name="deal_is_active"
          value="on"
          defaultChecked={deal?.is_active !== false}
          className="h-4 w-4 rounded border-neutral-300 text-brand"
        />
        Offre active
      </label>
      <button
        type="submit"
        className="rounded-lg bg-[#8D5524] px-4 py-2 text-base font-normal text-white transition hover:bg-[#74431a]"
      >
        {submitLabel}
      </button>
    </form>
  )
}

function DealRow({ restaurantId, deal }: { restaurantId: string; deal: RestaurantDealAdminRow }) {
  const router = useRouter()
  const [delState, delAction] = useActionState(deleteRestaurantDealAction, {})

  useEffect(() => {
    if (delState?.ok) router.refresh()
  }, [delState, router])

  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-neutral-900">{deal.title || 'Sans titre'}</p>
          {deal.description ? (
            <p className="mt-1 line-clamp-2 text-base text-neutral-600">{deal.description}</p>
          ) : null}
          {deal.validity_text ? (
            <p className="mt-1 text-sm text-neutral-500">{deal.validity_text}</p>
          ) : null}
          <p className="mt-2 text-sm text-neutral-500">
            Ordre {deal.sort_order ?? 0} — {deal.is_active === false ? 'inactive' : 'active'}
          </p>
        </div>
        <form action={delAction}>
          <input type="hidden" name="restaurant_id" value={restaurantId} />
          <input type="hidden" name="deal_id" value={deal.id} />
          <button
            type="submit"
            className="text-base font-semibold text-red-800 underline-offset-2 hover:underline"
          >
            Supprimer
          </button>
        </form>
        {delState?.error ? <p className="w-full text-sm text-red-700">{delState.error}</p> : null}
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-base font-semibold text-brand hover:underline">
          Modifier cette offre
        </summary>
        <div className="mt-3">
          <DealFields restaurantId={restaurantId} deal={deal} submitLabel="Enregistrer les modifications" />
        </div>
      </details>
    </li>
  )
}

type Props = {
  restaurantId: string
  deals: RestaurantDealAdminRow[]
}

export function RestaurantDealsPanel({ restaurantId, deals }: Props) {
  const [showNew, setShowNew] = useState(false)
  const closeNewForm = useCallback(() => setShowNew(false), [])

  return (
    <section className="mt-10 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Offres (restaurant_deals)</h2>
      <p className="text-lg text-neutral-600">
        Promotions ou bons plans liés au restaurant (titre, description, validité, ordre).
      </p>
      {deals.length ? (
        <ul className="space-y-4">
          {deals.map((d) => (
            <DealRow key={d.id} restaurantId={restaurantId} deal={d} />
          ))}
        </ul>
      ) : (
        <p className="text-lg text-neutral-600">Aucune offre enregistrée.</p>
      )}
      <div>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-lg font-normal text-neutral-800 transition hover:bg-stone-50"
        >
          {showNew ? 'Fermer le formulaire' : 'Nouvelle offre'}
        </button>
        {showNew ? (
          <div className="mt-4">
            <DealFields
              restaurantId={restaurantId}
              deal={null}
              submitLabel="Créer l’offre"
              onSaved={closeNewForm}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
