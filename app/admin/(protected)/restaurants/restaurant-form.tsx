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
      {!isNew ? <input type="hidden" name="id" value={restaurant!.id} /> : null}

      {state?.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-lg text-red-800">{state.error}</p>
      ) : null}
      {state?.ok && !isNew ? (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">
          Modifications enregistrées.
        </p>
      ) : null}

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Nom (table restaurants)
        <input
          name="name"
          required
          defaultValue={restaurant?.name ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal text-neutral-900 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Ville
        <input
          name="city"
          required
          defaultValue={restaurant?.city ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Description
        <textarea
          name="description"
          rows={4}
          defaultValue={restaurant?.description ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex items-center gap-3 text-lg font-semibold text-neutral-800">
        <input
          type="checkbox"
          name="bookable"
          value="on"
          defaultChecked={restaurant?.bookable === true}
          className="h-5 w-5 rounded border-neutral-300 text-brand"
        />
        Réservable en ligne (bookable)
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Note Google (0 à 5, optionnel)
        <input
          name="google_quotation"
          defaultValue={
            restaurant?.google_quotation != null
              ? String(restaurant.google_quotation)
              : ''
          }
          className="w-40 rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          placeholder="4.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Site web
        <input
          name="website_url"
          defaultValue={restaurant?.website_url ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Téléphone
        <input
          name="phone"
          defaultValue={restaurant?.phone ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        E-mail
        <input
          type="email"
          name="email"
          defaultValue={restaurant?.email ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Adresse (ligne libre)
        <input
          name="address"
          defaultValue={restaurant?.address ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Lien Google Maps
        <input
          name="google_maps_link"
          defaultValue={restaurant?.google_maps_link ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Instagram
        <input
          name="instagram_url"
          defaultValue={restaurant?.instagram_url ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        Facebook
        <input
          name="facebook_url"
          defaultValue={restaurant?.facebook_url ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
        WhatsApp
        <input
          name="whatsapp_phone"
          defaultValue={restaurant?.whatsapp_phone ?? ''}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>

      <SubmitButton isNew={isNew} />
    </form>
  )
}
