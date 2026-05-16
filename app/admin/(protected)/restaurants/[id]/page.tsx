import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DeleteRestaurantForm } from '@/app/admin/(protected)/components/delete-restaurant-form'
import {
  fetchCuisinesCatalog,
  fetchRestaurantCuisinesAdmin,
  fetchRestaurantDealsAdmin,
  fetchRestaurantFeatureLinksAdmin,
  fetchRestaurantFeaturesCatalog,
  fetchRestaurantImagesAdmin,
  fetchRestaurantOpeningSlotsAdmin,
  fetchRestaurantPhotosMenuAdmin,
} from '@/lib/restaurant-relations-admin'
import { fetchRestaurantAdminById } from '@/lib/restaurants-admin'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

import { RestaurantForm } from '../restaurant-form'
import { RestaurantCuisinesPanel } from '../restaurant-cuisines-panel'
import { RestaurantDealsPanel } from '../restaurant-deals-panel'
import { RestaurantFeatureLinksPanel } from '../restaurant-feature-links-panel'
import { RestaurantImagesPanel } from '../restaurant-images-panel'
import { RestaurantOpeningSlotsPanel } from '../restaurant-opening-slots-panel'
import { RestaurantPhotosMenuPanel } from '../restaurant-photos-menu-panel'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type Params = { id: string }

export default async function AdminEditRestaurantPage({
  params,
}: {
  params: Promise<Params>
}) {
  if (!getSupabaseAdmin()) notFound()

  const { id } = await params
  if (!UUID_RE.test(id)) notFound()

  const restaurant = await fetchRestaurantAdminById(id)
  if (!restaurant) notFound()

  const [
    images,
    slots,
    cuisinesAssigned,
    deals,
    featureLinks,
    photosMenu,
    cuisineCatalog,
    featureCatalog,
  ] = await Promise.all([
    fetchRestaurantImagesAdmin(id),
    fetchRestaurantOpeningSlotsAdmin(id),
    fetchRestaurantCuisinesAdmin(id),
    fetchRestaurantDealsAdmin(id),
    fetchRestaurantFeatureLinksAdmin(id),
    fetchRestaurantPhotosMenuAdmin(id),
    fetchCuisinesCatalog(),
    fetchRestaurantFeaturesCatalog(),
  ])

  const openingSlotsKey = slots.length ? slots.map((s) => s.id).join('-') : 'none'

  return (
    <div>
      <Link
        href="/admin/restaurants"
        className="text-lg text-brand hover:underline"
      >
        ← Liste des restaurants
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-neutral-900">
        Modifier : {restaurant.name}
      </h1>
      <div className="mt-8">
        <RestaurantForm restaurant={restaurant} />
      </div>

      <RestaurantImagesPanel restaurantId={id} images={images} />
      <RestaurantPhotosMenuPanel restaurantId={id} photos={photosMenu} />
      <RestaurantCuisinesPanel
        restaurantId={id}
        assigned={cuisinesAssigned}
        catalog={cuisineCatalog}
      />
      <RestaurantFeatureLinksPanel
        restaurantId={id}
        linked={featureLinks}
        catalog={featureCatalog}
      />
      <RestaurantOpeningSlotsPanel key={openingSlotsKey} restaurantId={id} slots={slots} />
      <RestaurantDealsPanel restaurantId={id} deals={deals} />

      <div className="mt-12 border-t border-neutral-200 pt-8">
        <h2 className="text-xl font-bold text-red-900">Zone sensible</h2>
        <p className="mt-2 text-lg text-neutral-600">
          La suppression retire définitivement ce restaurant du catalogue.
        </p>
        <DeleteRestaurantForm id={restaurant.id} />
      </div>
    </div>
  )
}
