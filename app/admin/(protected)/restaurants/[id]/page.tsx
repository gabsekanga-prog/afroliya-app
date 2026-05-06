import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DeleteRestaurantForm } from '@/app/admin/(protected)/components/delete-restaurant-form'
import { fetchRestaurantAdminById } from '@/lib/restaurants-admin'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

import { RestaurantForm } from '../restaurant-form'

type Params = { id: string }

export default async function AdminEditRestaurantPage({
  params,
}: {
  params: Promise<Params>
}) {
  if (!getSupabaseAdmin()) notFound()

  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isFinite(id) || id < 1) notFound()

  const restaurant = await fetchRestaurantAdminById(id)
  if (!restaurant) notFound()

  return (
    <div>
      <Link
        href="/admin/restaurants"
        className="text-lg text-brand hover:underline"
      >
        ← Liste des restaurants
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-neutral-900">
        Modifier : {restaurant.nom}
      </h1>
      <div className="mt-8">
        <RestaurantForm restaurant={restaurant} />
      </div>

      <div className="mt-12 border-t border-neutral-200 pt-8">
        <h2 className="text-xl font-bold text-red-900">Zone sensible</h2>
        <p className="mt-2 text-lg text-neutral-600">
          La suppression retire définitivement ce restaurant du catalogue.
        </p>
        <DeleteRestaurantForm id={restaurant.id} slug={restaurant.slug} />
      </div>
    </div>
  )
}
