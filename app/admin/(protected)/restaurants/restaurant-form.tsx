'use client'

import type { RestaurantAdmin } from '@/lib/restaurants-admin'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import {
  formInputClassName,
  formLabelClassName,
  formTextareaClassName,
} from '@/app/components/form-fields'

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

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="border-b border-neutral-200 pb-2 text-xl font-bold text-neutral-900">
      {children}
    </h2>
  )
}

function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string
  label: string
  defaultChecked: boolean
}) {
  return (
    <label className="flex items-center gap-3 text-lg font-semibold text-neutral-800">
      <input
        type="checkbox"
        name={name}
        value="on"
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-neutral-300 text-brand"
      />
      {label}
    </label>
  )
}

type Props = {
  restaurant: RestaurantAdmin | null
}

export function RestaurantForm({ restaurant }: Props) {
  const isNew = !restaurant
  const [state, formAction] = useActionState(saveRestaurantAction, {})

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      {!isNew ? <input type="hidden" name="id" value={restaurant!.id} /> : null}

      {state?.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-lg text-red-800">{state.error}</p>
      ) : null}
      {state?.ok && !isNew ? (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-lg text-green-900">
          Modifications enregistrées.
        </p>
      ) : null}

      <section className="space-y-4">
        <SectionTitle>Identité</SectionTitle>
        <label className={formLabelClassName}>
          Nom
          <input
            name="name"
            required
            defaultValue={restaurant?.name ?? ''}
            className={formInputClassName}
          />
        </label>
        <label className={formLabelClassName}>
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={restaurant?.description ?? ''}
            className={formTextareaClassName}
          />
        </label>
        <div className="flex flex-wrap gap-6">
          <CheckboxField
            name="bookable"
            label="Réservable en ligne (bookable)"
            defaultChecked={restaurant?.bookable === true}
          />
          <CheckboxField
            name="sponsored"
            label="Restaurant sponsorisé"
            defaultChecked={restaurant?.sponsored === true}
          />
          <CheckboxField
            name="active"
            label="Visible sur le site (actif)"
            defaultChecked={restaurant?.active === true}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Localisation</SectionTitle>
        <label className={formLabelClassName}>
          Adresse
          <input name="address" defaultValue={restaurant?.address ?? ''} className={formInputClassName} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={formLabelClassName}>
            Ville
            <input
              name="city"
              required
              defaultValue={restaurant?.city ?? ''}
              className={formInputClassName}
            />
          </label>
          <label className={formLabelClassName}>
            Commune
            <input name="commune" defaultValue={restaurant?.commune ?? ''} className={formInputClassName} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={formLabelClassName}>
            Code postal
            <input
              name="postal_code"
              defaultValue={restaurant?.postal_code ?? ''}
              className={formInputClassName}
            />
          </label>
          <label className={formLabelClassName}>
            Pays (code ISO, ex. BE)
            <input
              name="country_code"
              defaultValue={restaurant?.country_code ?? ''}
              className={formInputClassName}
              maxLength={8}
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={formLabelClassName}>
            Latitude
            <input
              name="latitude"
              defaultValue={
                restaurant?.latitude != null ? String(restaurant.latitude) : ''
              }
              className={formInputClassName}
              placeholder="50.8503"
            />
          </label>
          <label className={formLabelClassName}>
            Longitude
            <input
              name="longitude"
              defaultValue={
                restaurant?.longitude != null ? String(restaurant.longitude) : ''
              }
              className={formInputClassName}
              placeholder="4.3517"
            />
          </label>
        </div>
        <label className={formLabelClassName}>
          Lien Google Maps
          <input
            name="google_maps_link"
            defaultValue={restaurant?.google_maps_link ?? ''}
            className={formInputClassName}
          />
        </label>
      </section>

      <section className="space-y-4">
        <SectionTitle>Google</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={formLabelClassName}>
            Note (0 à 5)
            <input
              name="google_quotation"
              defaultValue={
                restaurant?.google_quotation != null
                  ? String(restaurant.google_quotation)
                  : ''
              }
              className={formInputClassName}
              placeholder="4.5"
            />
          </label>
          <label className={formLabelClassName}>
            Nombre d&apos;avis
            <input
              name="google_review_total_value"
              defaultValue={
                restaurant?.google_review_total_value != null
                  ? String(restaurant.google_review_total_value)
                  : ''
              }
              className={formInputClassName}
              placeholder="128"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Contact</SectionTitle>
        <label className={formLabelClassName}>
          Téléphone
          <input name="phone" defaultValue={restaurant?.phone ?? ''} className={formInputClassName} />
        </label>
        <label className={formLabelClassName}>
          E-mail
          <input
            type="email"
            name="email"
            defaultValue={restaurant?.email ?? ''}
            className={formInputClassName}
          />
        </label>
        <label className={formLabelClassName}>
          WhatsApp
          <input
            name="whatsapp_phone"
            defaultValue={restaurant?.whatsapp_phone ?? ''}
            className={formInputClassName}
          />
        </label>
      </section>

      <section className="space-y-4">
        <SectionTitle>Web et réseaux</SectionTitle>
        <label className={formLabelClassName}>
          Site web
          <input
            name="website_url"
            defaultValue={restaurant?.website_url ?? ''}
            className={formInputClassName}
          />
        </label>
        <label className={formLabelClassName}>
          Instagram
          <input
            name="instagram_url"
            defaultValue={restaurant?.instagram_url ?? ''}
            className={formInputClassName}
          />
        </label>
        <label className={formLabelClassName}>
          Facebook
          <input
            name="facebook_url"
            defaultValue={restaurant?.facebook_url ?? ''}
            className={formInputClassName}
          />
        </label>
      </section>

      {!isNew && restaurant?.created_at ? (
        <p className="text-lg text-neutral-500">
          Créé le {new Date(restaurant.created_at).toLocaleString('fr-BE')}
        </p>
      ) : null}

      <SubmitButton isNew={isNew} />
    </form>
  )
}
