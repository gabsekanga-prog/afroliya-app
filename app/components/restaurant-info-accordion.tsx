'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { RestaurantReservationLink } from '@/app/components/restaurant-reservation-link'
import type { Restaurant } from '@/lib/restaurants'
import { formatBelgianPhoneDisplay } from '@/lib/format-phone'
import { formatFullRestaurantAddress } from '@/lib/restaurant-location'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'

type Props = {
  restaurant: Restaurant
}

export function RestaurantInfoAccordion({ restaurant }: Props) {
  const fullAddress = formatFullRestaurantAddress(restaurant)
  const [open, setOpen] = useState(false)
  const phone = restaurant.telephone.trim()
  const displayPhone = phone ? formatBelgianPhoneDisplay(phone) : '—'

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 ${restaurantPageTextLinkClass}`}
      >
        Informations sur le commerce
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {open ? (
        <ul className="mt-3 space-y-2 text-base text-neutral-600">
          <li className="flex gap-2">
            <span className="shrink-0 font-bold text-neutral-900">Nom :</span>
            <span>{restaurant.nom}</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-bold text-neutral-900">Adresse :</span>
            <span>{fullAddress || '—'}</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-bold text-neutral-900">Téléphone :</span>
            <span>{displayPhone}</span>
          </li>
        </ul>
      ) : null}

      <RestaurantReservationLink
        trackingRestaurantId={restaurant.id}
        wrapperClassName="mt-8"
        className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
      />
    </div>
  )
}
