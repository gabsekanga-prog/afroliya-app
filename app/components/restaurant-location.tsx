import { MapPin } from 'lucide-react'

import type { Restaurant } from '@/lib/restaurants'
import {
  buildRestaurantMapEmbedSrc,
  formatFullRestaurantAddress,
} from '@/lib/restaurant-location'
import { siteBodyClass } from '@/lib/site-styles'

type Props = {
  restaurant: Restaurant
}

export function RestaurantLocation({ restaurant }: Props) {
  const fullAddress = formatFullRestaurantAddress(restaurant)
  const mapEmbedSrc = buildRestaurantMapEmbedSrc(restaurant, fullAddress)

  if (!fullAddress && !mapEmbedSrc) {
    return <p className={`mt-4 ${siteBodyClass}`}>Adresse non renseignée pour le moment.</p>
  }

  return (
    <div className="mt-4 w-full">
      {fullAddress ? (
        <p className="flex items-start gap-3 text-lg text-neutral-800">
          <MapPin
            className="mt-0.5 h-5 w-5 shrink-0 text-[#8D5524]"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>{fullAddress}</span>
        </p>
      ) : null}

      {mapEmbedSrc ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm">
          <iframe
            title={`Carte — ${restaurant.nom}`}
            src={mapEmbedSrc}
            className="h-[300px] w-full border-0 sm:h-auto sm:min-h-[min(360px,55vh)] lg:min-h-[min(480px,75vh)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}
    </div>
  )
}
