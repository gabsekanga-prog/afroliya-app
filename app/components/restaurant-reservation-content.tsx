import { CalendarCheck, Phone } from 'lucide-react'

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
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import { siteBodyClass, siteButtonPrimaryClass } from '@/lib/site-styles'

type Props = {
  restaurant: Pick<
    Restaurant,
    'id' | 'nom' | 'sponsored' | 'bookingUrl' | 'telephone'
  >
  openingHours: RestaurantOpeningHoursDay[]
}

function PhoneReservationBlock({ telephone }: { telephone: string }) {
  const phone = telephone.trim()
  const displayPhone = formatBelgianPhoneDisplay(phone)
  const telHref = phone ? formatBelgianPhoneTelHref(phone) : ''

  if (!phone) {
    return (
      <p className={`mt-6 ${siteBodyClass}`}>
        Numéro non renseigné pour le moment. Consultez la section{' '}
        <a href="#contact-acces" className={restaurantPageTextLinkClass}>
          Contact et accès
        </a>
        .
      </p>
    )
  }

  return (
    <div className={reservationPanelClassName}>
      <p className="flex items-center gap-3 text-2xl font-bold tracking-tight text-neutral-900">
        <Phone className="h-7 w-7 shrink-0 text-[#8D5524]" strokeWidth={1.75} aria-hidden />
        {displayPhone}
      </p>
      <a href={telHref} className={`mt-6 inline-flex ${siteButtonPrimaryClass}`}>
        Appeler
      </a>
    </div>
  )
}

function PartnerReservationBlock({ bookingUrl }: { bookingUrl: string }) {
  return (
    <div className={reservationPanelClassName}>
      <CalendarCheck
        className="h-16 w-16 text-[#8D5524]"
        strokeWidth={1.5}
        aria-hidden
      />
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 inline-flex ${siteButtonPrimaryClass}`}
      >
        Réserver une table
      </a>
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

export function RestaurantReservationContent({ restaurant, openingHours }: Props) {
  const mode = getRestaurantReservationMode(restaurant)

  if (mode === 'phone') {
    return (
      <>
        <p className={`mt-2 ${siteBodyClass}`}>
          Pour ce restaurant, les réservations se font par téléphone.
        </p>
        <PhoneReservationBlock telephone={restaurant.telephone} />
      </>
    )
  }

  if (mode === 'partner') {
    return (
      <>
        <p className={`mt-2 ${siteBodyClass}`}>
          Vous allez être redirigé vers le module officiel du restaurant.
        </p>
        <PartnerReservationBlock bookingUrl={getRestaurantPartnerBookingUrl(restaurant)} />
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
