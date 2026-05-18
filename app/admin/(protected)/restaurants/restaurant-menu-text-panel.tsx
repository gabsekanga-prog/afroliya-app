'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { GEMINI_MENU_CSV_PROMPT } from '@/lib/gemini-menu-csv-prompt'
import { formatMenuPrice } from '@/lib/format-menu-text'
import type { RestaurantMenuSectionAdminRow } from '@/lib/restaurant-relations-admin'

import {
  addRestaurantMenuItemAction,
  addRestaurantMenuSectionAction,
  clearRestaurantMenuAction,
  deleteRestaurantMenuItemAction,
  deleteRestaurantMenuSectionAction,
  importRestaurantMenuCsvAction,
} from './actions'

const inputClass =
  'rounded-xl border border-neutral-300 px-4 py-2.5 font-normal outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300'

function CsvImportForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const [formKey, setFormKey] = useState(0)
  const [state, action] = useActionState(importRestaurantMenuCsvAction, {})

  useEffect(() => {
    if (state?.ok) {
      setFormKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  return (
    <form
      key={formKey}
      action={action}
      encType="multipart/form-data"
      className="space-y-4 rounded-2xl border border-dashed border-[#c9a882] bg-[#faf6f1] p-5"
    >
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <h3 className="text-lg font-semibold text-neutral-900">Importer un CSV</h3>
      <p className="text-base text-neutral-600">
        Colonnes attendues :{' '}
        <code className="rounded bg-white px-1.5 py-0.5 text-sm">
          category, name, description, price
        </code>{' '}
        (séparateur virgule ou point-virgule). Alias acceptés : section, nom, prix…
      </p>
      <details className="rounded-xl border border-neutral-200 bg-white p-4">
        <summary className="cursor-pointer text-base font-semibold text-neutral-800">
          Prompt Gemini (extraction depuis photos)
        </summary>
        <p className="mt-2 text-sm text-neutral-600">
          Joignez les photos du menu, collez ce prompt, puis importez le CSV généré ci-dessous.
          Formatage attendu : peu de sections (regroupement fort), plats en « Première lettre
          majuscule », prix avec « € » en suffixe (ex. « 12,50 € »).
        </p>
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-stone-100 p-3 text-xs leading-relaxed text-neutral-800">
          {GEMINI_MENU_CSV_PROMPT}
        </pre>
      </details>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Fichier CSV
        <input
          type="file"
          name="csv_file"
          accept=".csv,text/csv"
          required
          className="text-base font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-[#8D5524] file:px-4 file:py-2 file:text-white"
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-base font-semibold text-neutral-800">Mode d&apos;import</legend>
        <label className="flex items-center gap-2 text-base text-neutral-700">
          <input
            type="radio"
            name="menu_import_mode"
            value="replace"
            defaultChecked
            className="h-4 w-4 border-neutral-300 text-brand"
          />
          Remplacer tout le menu texte existant
        </label>
        <label className="flex items-center gap-2 text-base text-neutral-700">
          <input
            type="radio"
            name="menu_import_mode"
            value="append"
            className="h-4 w-4 border-neutral-300 text-brand"
          />
          Ajouter aux sections existantes (crée les catégories manquantes)
        </label>
      </fieldset>
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-800">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-base text-green-800">
          {state.imported ?? 0} plat{(state.imported ?? 0) !== 1 ? 's' : ''} importé
          {(state.imported ?? 0) !== 1 ? 's' : ''}.
        </p>
      ) : null}
      <button
        type="submit"
        className="rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
      >
        Importer le CSV
      </button>
    </form>
  )
}

function AddSectionForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const [formKey, setFormKey] = useState(0)
  const [state, action] = useActionState(addRestaurantMenuSectionAction, {})

  useEffect(() => {
    if (state?.ok) {
      setFormKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  return (
    <form
      key={formKey}
      action={action}
      className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <h3 className="text-lg font-semibold text-neutral-900">Ajouter une section</h3>
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-800">{state.error}</p>
      ) : null}
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Nom (ex. Entrées, Plats)
        <input name="section_name" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Ordre
        <input
          type="number"
          name="section_sort_order"
          defaultValue={0}
          className={`${inputClass} w-32`}
        />
      </label>
      <label className="flex items-center gap-2 text-base font-semibold text-neutral-800">
        <input
          type="checkbox"
          name="section_published"
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
        Ajouter la section
      </button>
    </form>
  )
}

function AddItemForm({
  restaurantId,
  sections,
}: {
  restaurantId: string
  sections: RestaurantMenuSectionAdminRow[]
}) {
  const router = useRouter()
  const [formKey, setFormKey] = useState(0)
  const [state, action] = useActionState(addRestaurantMenuItemAction, {})

  useEffect(() => {
    if (state?.ok) {
      setFormKey((k) => k + 1)
      router.refresh()
    }
  }, [state, router])

  if (!sections.length) {
    return (
      <p className="text-base text-neutral-600">
        Créez d&apos;abord une section ou importez un CSV avant d&apos;ajouter un plat.
      </p>
    )
  }

  return (
    <form
      key={formKey}
      action={action}
      className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <h3 className="text-lg font-semibold text-neutral-900">Ajouter un plat</h3>
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-800">{state.error}</p>
      ) : null}
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Section
        <select name="section_id" required className={inputClass} defaultValue="">
          <option value="" disabled>
            Choisir…
          </option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Nom du plat
        <input name="item_name" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Description
        <textarea name="item_description" rows={2} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Prix (texte libre)
        <input name="item_price" placeholder="12,50 €" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
        Ordre
        <input type="number" name="item_sort_order" defaultValue={0} className={`${inputClass} w-32`} />
      </label>
      <label className="flex items-center gap-2 text-base font-semibold text-neutral-800">
        <input
          type="checkbox"
          name="item_published"
          value="on"
          defaultChecked
          className="h-5 w-5 rounded border-neutral-300 text-brand"
        />
        Publié
      </label>
      <button
        type="submit"
        className="rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
      >
        Ajouter le plat
      </button>
    </form>
  )
}

function MenuItemRow({
  restaurantId,
  sectionId,
  item,
}: {
  restaurantId: string
  sectionId: string
  item: RestaurantMenuSectionAdminRow['items'][number]
}) {
  const router = useRouter()
  const [state, action] = useActionState(deleteRestaurantMenuItemAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <li className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-100 py-2 last:border-0">
      <div className="min-w-0 flex-1 text-base">
        <p className="font-medium text-neutral-900">{item.name}</p>
        {item.description ? <p className="text-neutral-600">{item.description}</p> : null}
        {item.price ? (
          <p className="font-medium text-[#8D5524]">{formatMenuPrice(item.price) ?? item.price}</p>
        ) : null}
        <p className="text-sm text-neutral-500">
          Ordre {item.sort_order ?? 0} — {item.published === false ? 'non publié' : 'publié'}
        </p>
      </div>
      <form action={action}>
        <input type="hidden" name="restaurant_id" value={restaurantId} />
        <input type="hidden" name="section_id" value={sectionId} />
        <input type="hidden" name="item_id" value={item.id} />
        <button
          type="submit"
          className="text-sm font-semibold text-red-800 underline-offset-2 hover:underline"
        >
          Supprimer
        </button>
      </form>
    </li>
  )
}

function MenuSectionBlock({
  restaurantId,
  section,
}: {
  restaurantId: string
  section: RestaurantMenuSectionAdminRow
}) {
  const router = useRouter()
  const [state, action] = useActionState(deleteRestaurantMenuSectionAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <article className="rounded-xl border border-neutral-200 bg-stone-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">{section.name}</h3>
          <p className="text-sm text-neutral-500">
            Ordre {section.sort_order ?? 0} — {section.published === false ? 'non publiée' : 'publiée'}{' '}
            — {section.items.length} plat{section.items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <form action={action}>
          <input type="hidden" name="restaurant_id" value={restaurantId} />
          <input type="hidden" name="section_id" value={section.id} />
          <button
            type="submit"
            className="text-base font-semibold text-red-800 underline-offset-2 hover:underline"
          >
            Supprimer la section
          </button>
        </form>
      </div>
      {state?.error ? <p className="mt-2 text-sm text-red-700">{state.error}</p> : null}
      {section.items.length ? (
        <ul className="mt-3 rounded-lg border border-neutral-200 bg-white px-3">
          {section.items.map((item) => (
            <MenuItemRow
              key={item.id}
              restaurantId={restaurantId}
              sectionId={section.id}
              item={item}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-base text-neutral-600">Aucun plat dans cette section.</p>
      )}
    </article>
  )
}

function ClearMenuForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const [state, action] = useActionState(clearRestaurantMenuAction, {})

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <form
      action={action}
      className="rounded-2xl border border-red-200 bg-red-50/50 p-4"
      onSubmit={(event) => {
        if (
          !window.confirm(
            'Supprimer tout le menu texte de ce restaurant ? Cette action est irréversible.',
          )
        ) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <p className="text-base text-neutral-700">Retirer toutes les sections et tous les plats.</p>
      {state?.error ? <p className="mt-2 text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        className="mt-3 text-base font-semibold text-red-900 underline-offset-2 hover:underline"
      >
        Vider le menu texte
      </button>
    </form>
  )
}

type Props = {
  restaurantId: string
  sections: RestaurantMenuSectionAdminRow[]
}

export function RestaurantMenuTextPanel({ restaurantId, sections }: Props) {
  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0)

  return (
    <section className="mt-10 max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Menu texte (accordéon public)</h2>
      <p className="text-lg text-neutral-600">
        Affiché sur la fiche restaurant à la place des photos de menu lorsqu&apos;au moins un plat
        est renseigné. {totalItems > 0 ? `${totalItems} plat${totalItems !== 1 ? 's' : ''} au total.` : ''}
      </p>

      <CsvImportForm restaurantId={restaurantId} />

      {sections.length ? (
        <div className="space-y-4">
          {sections.map((section) => (
            <MenuSectionBlock key={section.id} restaurantId={restaurantId} section={section} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-neutral-600">Aucune section de menu pour le moment.</p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <AddSectionForm restaurantId={restaurantId} />
        <AddItemForm restaurantId={restaurantId} sections={sections} />
      </div>

      {sections.length > 0 ? <ClearMenuForm restaurantId={restaurantId} /> : null}
    </section>
  )
}
