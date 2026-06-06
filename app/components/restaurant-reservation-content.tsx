import { CalendarCheck, Phone } from 'lucide-react'

import { RestaurantReservationVote } from '@/app/components/restaurant-reservation-vote'
import { RestaurantTrackedLink } from '@/app/components/restaurant-tracked-link'
import {
  RestaurantReservationWidget,
  reservationPanelClassName,
} from '@/app/components/restaurant-reservation-widget'
import type { Restaurant, RestaurantOpeningHoursDay } from '@/lib/restaurants'
import { formatBelgianPhoneDisplay, formatBelgianPhoneTelHref } from '@/lib/format-phone'
import {
  getRestaurantPartnerBookingUrl,
  getRestaurantReservationMode,
} from '@/lib/restaurant-reservation-cta'
import { RESTAURANT_STATS_CLICK_LABELS } from '@/lib/restaurant-stats-events'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import {
  restaurantDetailPanelClass,
  siteBodyClass,
  communityActionButtonClass,
  siteButtonPrimaryClass,
  siteHeading3Class,
  siteSectionTwoColumnGridClass,
} from '@/lib/site-styles'

type Props = {
  restaurant: Pick<
    Restaurant,
    'id' | 'nom' | 'sponsored' | 'bookingUrl' | 'telephone'
  >
  openingHours: RestaurantOpeningHoursDay[]
  reservationVoteCount?: number
}

function PhoneReservationBlock({
  telephone,
  restaurantId,
  reservationVoteCount,
}: {
  telephone: string
  restaurantId: string
  reservationVoteCount: number
}) {
  const phone = telephone.trim()
  const displayPhone = formatBelgianPhoneDisplay(phone)
  const telHref = phone ? formatBelgianPhoneTelHref(phone) : ''

  return (
    <div className={`mt-6 ${siteSectionTwoColumnGridClass} lg:items-start`}>
      <div className="min-w-0">
        <div className={restaurantDetailPanelClass}>
          {phone ? (
            <>
              <h3 className={`flex items-center gap-3 ${siteHeading3Class}`}>
                {displayPhone}
              </h3>
              <RestaurantTrackedLink
                href={telHref}
                restaurantId={restaurantId}
                eventKey={RESTAURANT_STATS_CLICK_LABELS.call}
                className={`mt-6 ${communityActionButtonClass}`}
              >
                <Phone className="h-5 w-5 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
                Appeler
              </RestaurantTrackedLink>
            </>
          ) : (
            <p className={siteBodyClass}>
              Numéro non renseigné pour le moment. Consultez la section{' '}
              <a href="#contact-acces" className={restaurantPageTextLinkClass}>
                Contact et accès
              </a>
              .
            </p>
          )}
        </div>
      </div>

      <RestaurantReservationVote
        restaurantId={restaurantId}
        initialVoteCount={reservationVoteCount}
        embedded
      />
    </div>
  )
}

function PartnerReservationBlock({
  bookingUrl,
  restaurantId,
}: {
  bookingUrl: string
  restaurantId: string
}) {
  return (
    <div className={reservationPanelClassName}>
      <CalendarCheck
        className="h-16 w-16 text-[#8D5524]"
        strokeWidth={1.5}
        aria-hidden
      />
      <RestaurantTrackedLink
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        restaurantId={restaurantId}
        eventKey={RESTAURANT_STATS_CLICK_LABELS.reservePartner}
        className={`mt-6 inline-flex ${siteButtonPrimaryClass}`}
      >
        Réserver via le partenaire
      </RestaurantTrackedLink>
    </div>
  )
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

export function RestaurantReservationContent({
  restaurant,
  openingHours,
  reservationVoteCount,
}: Props) {
  const mode = getRestaurantReservationMode(restaurant)
  const normalizedReservationVoteCount = Math.max(
    0,
    Number(reservationVoteCount) || 0,
  )

  if (mode === 'phone') {
    return (
      <>
        <p className={`mt-2 ${siteBodyClass}`}>
          Pour ce restaurant, les réservations se font par téléphone.
        </p>
        <PhoneReservationBlock
          telephone={restaurant.telephone}
          restaurantId={restaurant.id}
          reservationVoteCount={normalizedReservationVoteCount}
        />
      </>
    )
  }

  if (mode === 'partner') {
    return (
      <>
        <p className={`mt-2 ${siteBodyClass}`}>
          Vous allez être redirigé vers le module officiel du restaurant.
        </p>
        <PartnerReservationBlock
          bookingUrl={getRestaurantPartnerBookingUrl(restaurant)}
          restaurantId={restaurant.id}
        />
      </>
    )
  }

  return (
    <>
      <p className={`mt-2 ${siteBodyClass}`}>
        Remplissez ce formulaire pour bloquer votre table. Le restaurant vous confirmera la
        réservation au plus vite.
      </p>
      <FormReservationBlock
        restaurantId={restaurant.id}
        restaurantName={restaurant.nom}
        openingHours={openingHours}
      />
    </>
  )
}
