'use client'

import { deleteGuideAction } from '../guides/actions'

type Props = {
  slug: string
  title: string
}

export function DeleteGuideForm({ slug, title }: Props) {
  return (
    <form
      action={deleteGuideAction}
      onSubmit={(event) => {
        if (!confirm(`Supprimer le guide « ${title} » ?`)) event.preventDefault()
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-lg font-semibold text-red-900 transition hover:bg-red-100"
      >
        Supprimer
      </button>
    </form>
  )
}
