'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { RestaurantPhotoMenuAdminRow } from '@/lib/restaurant-relations-admin'

import { addRestaurantPhotoMenuAction, deleteRestaurantPhotoMenuAction } from './actions'

function AddPhotoMenuForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const [formKey, setFormKey] = useState(0)
  const [state, action] = useActionState(addRestaurantPhotoMenuAction, {})

  useEffect(() => {
    if (state?.ok) {
      setFormKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  return (
    <form key={formKey} action={action} className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <h3 className="text-lg font-semibold text-neutral-900">Ajouter une photo de menu</h3>
      {state?.error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-800">{state.error}</p> : null}
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        URL de l’image
        <input
          name="menu_image_src"
          required
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          placeholder="https://…"
        />
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Légende
        <input
          name="menu_caption"
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Ordre d’affichage
        <input
          type="number"
          name="menu_sort_order"
          defaultValue={0}
          className="w-32 rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>
      <label className="flex items-center gap-2 text-base font-semibold text-neutral-800">
        <input
          type="checkbox"
          name="menu_published"
          value="on"
          defaultChecked
          className="h-5 w-5 rounded border-neutral-300 text-brand"
        />
        Publiée
      </label>
      <button
        type="submit"
        className="rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
      >
        Ajouter
      </button>
    </form>
  )
}

function PhotoMenuRow({ restaurantId, row }: { restaurantId: string; row: RestaurantPhotoMenuAdminRow }) {
  const router = useRouter()
  const [state, action] = useActionState(deleteRestaurantPhotoMenuAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-stone-50 p-4 sm:flex-row sm:items-start">
      <img
        src={row.image_src}
        alt=""
        className="h-28 w-full max-w-xs rounded-lg object-cover sm:h-24 sm:w-40"
      />
      <div className="min-w-0 flex-1 space-y-1 text-base">
        <p className="break-all font-medium text-neutral-900">{row.image_src}</p>
        {row.caption ? <p className="text-neutral-600">{row.caption}</p> : null}
        <p className="text-sm text-neutral-500">
          Ordre {row.sort_order ?? 0} — {row.published === false ? 'non publiée' : 'publiée'}
        </p>
        {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        <form action={action}>
          <input type="hidden" name="restaurant_id" value={restaurantId} />
          <input type="hidden" name="photo_menu_id" value={row.id} />
          <button
            type="submit"
            className="mt-2 text-base font-semibold text-red-800 underline-offset-2 hover:underline"
          >
            Supprimer
          </button>
        </form>
      </div>
    </li>
  )
}

type Props = {
  restaurantId: string
  photos: RestaurantPhotoMenuAdminRow[]
}

export function RestaurantPhotosMenuPanel({ restaurantId, photos }: Props) {
  return (
    <section className="mt-10 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Photos menu (restaurant_photos_menu)</h2>
      <p className="text-lg text-neutral-600">
        Galerie d’images (carte, plats, ambiance) avec ordre d’affichage et statut publié.
      </p>
      {photos.length ? (
        <ul className="space-y-4">
          {photos.map((row) => (
            <PhotoMenuRow key={row.id} restaurantId={restaurantId} row={row} />
          ))}
        </ul>
      ) : (
        <p className="text-lg text-neutral-600">Aucune photo de menu.</p>
      )}
      <AddPhotoMenuForm restaurantId={restaurantId} />
    </section>
  )
}
