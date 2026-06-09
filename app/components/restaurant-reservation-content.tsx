import { CalendarX } from 'lucide-react'

import { RestaurantReservationVote } from '@/app/components/restaurant-reservation-vote'
import { RestaurantReservationWidget } from '@/app/components/restaurant-reservation-widget'
import type { Restaurant, RestaurantOpeningHoursDay } from '@/lib/restaurants'
import { getRestaurantReservationDisplayState } from '@/lib/restaurant-reservation-capacity'
import {
  restaurantDetailPanelClass,
  siteBodyClass,
  siteHeading3Class,
  siteSectionTwoColumnGridClass,
} from '@/lib/site-styles'

type Props = {
  restaurant: Pick<
    Restaurant,
    | 'id'
    | 'nom'
    | 'sponsored'
    | 'sponsorshipStartDate'
    | 'sponsorshipEndDate'
  >
  openingHours: RestaurantOpeningHoursDay[]
  reservationVoteCount?: number
  monthlyReservationCount?: number
}

function FormReservationBlock({
  restaurantId,
  restaurantName,
  openingHours,
}: {
  restaurantId: string
  restaurantName: string
  openingHours: RestaurantOpeningHoursDay[]
}) {
  return (
    <RestaurantReservationWidget
      restaurantId={restaurantId}
      restaurantName={restaurantName}
      openingHours={openingHours}
    />
  )
}

function MonthlyCapacityFullBlock({
  restaurantId,
  reservationVoteCount,
}: {
  restaurantId: string
  reservationVoteCount: number
}) {
  return (
    <div className={`mt-6 ${siteSectionTwoColumnGridClass} lg:items-start`}>
      <div className={restaurantDetailPanelClass}>
        <h3 className={`flex items-center gap-3 ${siteHeading3Class}`}>
          <CalendarX className="h-6 w-6 shrink-0 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
          Complet ce mois-ci sur Afroliya
        </h3>
        <p className={`mt-4 ${siteBodyClass}`}>
          Ce restaurant a atteint sa capacité de réservations Afroliya pour ce mois. Revenez le mois
          prochain ou votez pour demander plus de places.
        </p>
      </div>

      <RestaurantReservationVote
        restaurantId={restaurantId}
        initialVoteCount={reservationVoteCount}
        embedded
        purpose="more_capacity"
      />
    </div>
  )
}

export function RestaurantReservationContent({
  restaurant,
  openingHours,
  reservationVoteCount,
  monthlyReservationCount = 0,
}: Props) {
  const displayState = getRestaurantReservationDisplayState(
    restaurant,
    Math.max(0, Number(monthlyReservationCount) || 0),
  )
  const normalizedReservationVoteCount = Math.max(
    0,
    Number(reservationVoteCount) || 0,
  )

  if (displayState === 'monthly_full') {
    return (
      <MonthlyCapacityFullBlock
        restaurantId={restaurant.id}
        reservationVoteCount={normalizedReservationVoteCount}
      />
    )
  }

  return (
    <>
      <p className={`mt-2 ${siteBodyClass}`}>
        Gratuit 24h/24 | Moins d&apos;attente et de ruptures de stock | Confirmation par e-mail
      </p>
      <FormReservationBlock
        restaurantId={restaurant.id}
        restaurantName={restaurant.nom}
        openingHours={openingHours}
      />
    </>
  )
}
