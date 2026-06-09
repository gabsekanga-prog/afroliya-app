import { Euro } from 'lucide-react'
import Link from 'next/link'

import { siteCardBgOnMutedClass, siteCardThumbnailImageClass } from '@/lib/site-styles'

import { RestaurantCuisineLocation } from '@/app/components/restaurant-cuisine-location'
import type { Restaurant } from '@/lib/restaurants'

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
      className={`block overflow-hidden rounded-2xl border border-neutral-200 ${siteCardBgOnMutedClass} shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]`}
    >
      <img
        src={restaurant.image}
        alt={`Photo de couverture — ${restaurant.nom}`}
        className={siteCardThumbnailImageClass}
        loading="lazy"
      />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-neutral-900">{restaurant.nom}</h3>
          <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-base font-semibold text-neutral-800">
            ★ {restaurant.note}
          </span>
        </div>
        <RestaurantCuisineLocation restaurant={restaurant} layout="stacked" />
        {restaurant.tarif ? (
          <p className="flex items-center gap-1.5 text-lg text-neutral-600">
            <Euro className="h-4 w-4 shrink-0 text-neutral-500" strokeWidth={1.75} aria-hidden />
            <span>{restaurant.tarif}</span>
          </p>
        ) : null}
      </div>
    </Link>
  )
}
