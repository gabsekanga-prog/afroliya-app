'use client'

import { deleteRestaurantAction } from '../restaurants/actions'

type Props = {
  id: number
  slug: string
}

export function DeleteRestaurantForm({ id, slug }: Props) {
  return (
    <form
      className="mt-4"
      action={deleteRestaurantAction}
      onSubmit={(event) => {
        if (!confirm('Supprimer ce restaurant ?')) event.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-lg font-semibold text-red-900 transition hover:bg-red-100"
      >
        Supprimer
      </button>
    </form>
  )
}
