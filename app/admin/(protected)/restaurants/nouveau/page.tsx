import Link from 'next/link'

import { RestaurantForm } from '../restaurant-form'

export default function AdminNewRestaurantPage() {
  return (
    <div>
      <Link
        href="/admin/restaurants"
        className="text-lg text-brand hover:underline"
      >
        ← Liste des restaurants
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-neutral-900">
        Nouveau restaurant
      </h1>
      <div className="mt-8">
        <RestaurantForm restaurant={null} />
      </div>
      <p className="mt-8 max-w-2xl text-lg text-neutral-600">
        Après la création, vous serez redirigé vers la fiche du restaurant : vous pourrez y gérer les images,
        photos de menu, cuisines, caractéristiques, horaires, offres et autres tables liées.
      </p>
    </div>
  )
}
