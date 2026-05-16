'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { RestaurantImageAdminRow } from '@/lib/restaurant-relations-admin'

import { addRestaurantImageAction, deleteRestaurantImageAction } from './actions'

function AddImageForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const [formKey, setFormKey] = useState(0)
  const [state, action] = useActionState(addRestaurantImageAction, {})

  useEffect(() => {
    if (state?.ok) {
      setFormKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  return (
    <form key={formKey} action={action} className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <h3 className="text-lg font-semibold text-neutral-900">Ajouter une image</h3>
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-800">{state.error}</p>
      ) : null}
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        URL de l’image
        <input
          name="image_url"
          required
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          placeholder="https://…"
        />
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Légende (optionnel)
        <input
          name="image_description"
          className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
        />
      </label>
      <label className="flex items-center gap-2 text-base font-semibold text-neutral-800">
        <input type="checkbox" name="image_cover" className="h-5 w-5 rounded border-neutral-300 text-brand" />
        Image de couverture (les autres perdent le statut « couverture »)
      </label>
      <button
        type="submit"
        className="rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
      >
        Ajouter l’image
      </button>
    </form>
  )
}

function ImageRow({ restaurantId, image }: { restaurantId: string; image: RestaurantImageAdminRow }) {
  const router = useRouter()
  const [state, action] = useActionState(deleteRestaurantImageAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-stone-50 p-4 sm:flex-row sm:items-start">
      <img
        src={image.image_url}
        alt=""
        className="h-28 w-full max-w-xs rounded-lg object-cover sm:h-24 sm:w-40"
      />
      <div className="min-w-0 flex-1 space-y-1 text-base">
        <p className="break-all font-medium text-neutral-900">{image.image_url}</p>
        {image.description ? (
          <p className="text-neutral-600">{image.description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {image.cover ? (
            <span className="rounded-full bg-[#f5e6d9] px-2.5 py-0.5 text-sm font-semibold text-[#8D5524]">
              Couverture
            </span>
          ) : null}
          <span className="text-sm text-neutral-500">{image.created_at}</span>
        </div>
        {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        <form action={action}>
          <input type="hidden" name="restaurant_id" value={restaurantId} />
          <input type="hidden" name="image_url" value={image.image_url} />
          <input type="hidden" name="created_at" value={image.created_at} />
          <button
            type="submit"
            className="mt-2 text-base font-semibold text-red-800 underline-offset-2 hover:underline"
          >
            Supprimer cette image
          </button>
        </form>
      </div>
    </li>
  )
}

type Props = {
  restaurantId: string
  images: RestaurantImageAdminRow[]
}

export function RestaurantImagesPanel({ restaurantId, images }: Props) {
  return (
    <section className="mt-10 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Images (restaurant_images)</h2>
      <p className="text-lg text-neutral-600">
        Les URLs pointent vers des fichiers déjà hébergés (stockage, CDN, etc.). Une image marquée
        « couverture » s’affiche en priorité sur le site public.
      </p>
      {images.length ? (
        <ul className="space-y-4">
          {images.map((img) => (
            <ImageRow key={`${img.created_at}-${img.image_url}`} restaurantId={restaurantId} image={img} />
          ))}
        </ul>
      ) : (
        <p className="text-lg text-neutral-600">Aucune image pour ce restaurant.</p>
      )}
      <AddImageForm restaurantId={restaurantId} />
    </section>
  )
}
