'use client'

import type { RestaurantAdmin } from '@/lib/restaurants-admin'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { saveRestaurantAction } from './actions'

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a] disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : isNew ? 'Créer le restaurant' : 'Enregistrer'}
    </button>
  )
}

type Props = {
  restaurant: RestaurantAdmin | null
}

export function RestaurantForm({ restaurant }: Props) {
  const isNew = !restaurant
  const [state, formAction] = useActionState(saveRestaurantAction, {})

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {!isNew ? (
        <input type="hidden" name="id" value={restaurant!.id} />
      ) : null}

      {state?.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-lg text-red-800">{state.error}</p>
      ) : null}
      {state?.ok && !isNew ? (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">
          Modifications enregistrées.
        </p>
      ) : null}

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Slug (URL)
        <input
          name="slug"
          required
          defaultValue={restaurant?.slug ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal text-neutral-900 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          placeholder="ex. mama-douala"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Nom
        <input
          name="nom"
          required
          defaultValue={restaurant?.nom ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Cuisine
        <input
          name="cuisine"
          required
          defaultValue={restaurant?.cuisine ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Ville
        <input
          name="ville"
          required
          defaultValue={restaurant?.ville ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Note (affichage)
        <input
          name="note"
          required
          defaultValue={restaurant?.note ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          placeholder="4.8"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        URL image
        <input
          name="image"
          required
          defaultValue={restaurant?.image ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Description
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={restaurant?.description ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Ordre d affichage
        <input
          type="number"
          name="sort_order"
          defaultValue={restaurant?.sort_order ?? 0}
          className="w-32 rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex items-center gap-3 text-lg font-semibold text-neutral-800">
        <input
          type="checkbox"
          name="published"
          value="on"
          defaultChecked={restaurant?.published !== false}
          className="h-5 w-5 rounded border-neutral-300 text-brand"
        />
        Publié sur le site
      </label>

      <SubmitButton isNew={isNew} />
    </form>
  )
}
