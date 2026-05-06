'use client'

import type { GuideSubsection } from '@/lib/guide-types'
import type { GuideAdmin } from '@/lib/guides-admin'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { saveGuideAction } from './actions'

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a] disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : isNew ? 'Créer le guide' : 'Enregistrer'}
    </button>
  )
}

const emptySection = (): GuideSubsection => ({
  title: '',
  imageSrc: '',
  imageAlt: '',
  description: '',
  href: '/reserver-un-restaurant',
  buttonLabel: 'Voir',
})

type Props = {
  guide: GuideAdmin | null
}

export function GuideForm({ guide }: Props) {
  const isNew = !guide
  const [sections, setSections] = useState<GuideSubsection[]>(() =>
    guide?.subsections?.length ? guide.subsections : [],
  )

  const [state, formAction] = useActionState(saveGuideAction, {})

  function updateSection(
    index: number,
    field: keyof GuideSubsection,
    value: string,
  ) {
    setSections((prev) => {
      const next = [...prev]
      const row = { ...next[index], [field]: value }
      next[index] = row
      return next
    })
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      <input
        type="hidden"
        name="original_slug"
        value={guide?.slug ?? ''}
      />
      <input type="hidden" name="subsections" value={JSON.stringify(sections)} />

      {state?.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-lg text-red-800">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">
          Modifications enregistrées.
        </p>
      ) : null}

      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900">Informations générales</h2>

        <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
          Slug (URL unique)
          <input
            name="slug"
            required
            defaultValue={guide?.slug ?? ''}
            className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
            placeholder="ex. restaurants-congolais-bruxelles"
          />
        </label>

        <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
          Titre
          <input
            name="title"
            required
            defaultValue={guide?.title ?? ''}
            className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          />
        </label>

        <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
          Image de couverture (URL)
          <input
            name="image_src"
            required
            defaultValue={guide?.image_src ?? ''}
            className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          />
        </label>

        <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
          Texte alternatif couverture
          <input
            name="image_alt"
            defaultValue={guide?.image_alt ?? ''}
            className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          />
        </label>

        <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
          Introduction
          <textarea
            name="intro"
            rows={4}
            defaultValue={guide?.intro ?? ''}
            className="rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          />
        </label>

        <label className="flex flex-col gap-1 text-lg font-semibold text-neutral-800">
          Ordre dans les listes
          <input
            type="number"
            name="sort_order"
            defaultValue={guide?.sort_order ?? 0}
            className="w-32 rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300"
          />
        </label>

        <label className="flex items-center gap-3 text-lg font-semibold text-neutral-800">
          <input
            type="checkbox"
            name="published"
            value="on"
            defaultChecked={guide?.published !== false}
            className="h-5 w-5 rounded border-neutral-300 text-brand"
          />
          Publié sur le site
        </label>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-neutral-900">Sous-sections</h2>
          <button
            type="button"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-lg text-neutral-800 transition hover:bg-stone-50"
            onClick={() => setSections((s) => [...s, emptySection()])}
          >
            Ajouter une sous-section
          </button>
        </div>

        {sections.length === 0 ? (
          <p className="text-lg text-neutral-600">
            Aucune sous-section. Ajoutez-en une ou enregistrez sans (contenu minimal).
          </p>
        ) : null}

        {sections.map((row, index) => (
          <div
            key={index}
            className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex justify-between gap-2">
              <span className="font-semibold text-neutral-800">
                Bloc {index + 1}
              </span>
              <button
                type="button"
                className="text-lg text-red-700 hover:underline"
                onClick={() =>
                  setSections((s) => s.filter((_, i) => i !== index))
                }
              >
                Retirer
              </button>
            </div>
            <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
              Titre
              <input
                value={row.title}
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
              Image (URL)
              <input
                value={row.imageSrc}
                onChange={(e) => updateSection(index, 'imageSrc', e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
              Texte alternatif image
              <input
                value={row.imageAlt}
                onChange={(e) => updateSection(index, 'imageAlt', e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
              Description
              <textarea
                value={row.description}
                onChange={(e) =>
                  updateSection(index, 'description', e.target.value)
                }
                rows={3}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
              Lien (URL ou chemin)
              <input
                value={row.href}
                onChange={(e) => updateSection(index, 'href', e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
              Libellé du bouton
              <input
                value={row.buttonLabel}
                onChange={(e) =>
                  updateSection(index, 'buttonLabel', e.target.value)
                }
                className="rounded-lg border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-500"
              />
            </label>
          </div>
        ))}
      </div>

      <SubmitButton isNew={isNew} />
    </form>
  )
}
