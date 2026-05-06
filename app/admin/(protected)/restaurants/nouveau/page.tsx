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
    </div>
  )
}
