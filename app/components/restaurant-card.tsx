import Link from 'next/link'

import { formatCuisineCommune, type Restaurant } from '@/lib/restaurants'

type Props = {
  restaurant: Restaurant
  openInNewTab?: boolean
}

export function RestaurantCard({ restaurant, openInNewTab = false }: Props) {
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      {...(openInNewTab
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className="block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]"
    >
      <img
        src={restaurant.image}
        alt={`Photo de couverture — ${restaurant.nom}`}
        className="aspect-[16/10] h-auto w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-neutral-900">{restaurant.nom}</h3>
          <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-sm font-semibold text-neutral-800">
            ★ {restaurant.note}
          </span>
        </div>
        <p className="text-lg text-neutral-600">
          {formatCuisineCommune(restaurant.cuisine, restaurant.commune)}
        </p>
        {restaurant.tarif ? (
          <p className="text-base font-medium text-[#8D5524]">{restaurant.tarif}</p>
        ) : null}
      </div>
    </Link>
  )
}
