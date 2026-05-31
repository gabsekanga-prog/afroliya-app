import { Globe, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Restaurant } from '@/lib/restaurants'
import { formatBelgianPhoneDisplay, formatBelgianPhoneTelHref } from '@/lib/format-phone'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import { RestaurantReservationLink } from '@/app/components/restaurant-reservation-link'

function formatAccessAddress(restaurant: Restaurant): string {
  return restaurant.adresse.trim()
}

function buildMapEmbedSrc(restaurant: Restaurant, address: string): string | null {
  const { latitude, longitude } = restaurant
  if (latitude != null && longitude != null) {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&hl=fr&output=embed`
  }
  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&hl=fr&output=embed`
  }
  return null
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.3l.7-3H13V9c0-.6.4-1 1-1z" />
    </svg>
  )
}

function externalHref(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

type ContactRowProps = {
  icon: ReactNode
  label: string
  children: ReactNode
}

function ContactRow({ icon, label, children }: ContactRowProps) {
  return (
    <li className="flex gap-3 text-lg">
      <span className="mt-0.5 shrink-0 text-[#8D5524]" aria-hidden>
        {icon}
      </span>
      <div>
        <span className="font-bold text-neutral-900">{label}</span>
        <div className="mt-0.5 text-neutral-700">{children}</div>
      </div>
    </li>
  )
}

function ReserveButton({ restaurant }: { restaurant: Restaurant }) {
  return (
    <RestaurantReservationLink
      restaurant={restaurant}
      wrapperClassName="mt-6"
      className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
    />
  )
}

function ContactList({ rows }: { rows: ContactRowProps[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-lg text-neutral-600">Coordonnées non renseignées pour le moment.</p>
    )
  }

  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <ContactRow key={row.label} icon={row.icon} label={row.label}>
          {row.children}
        </ContactRow>
      ))}
    </ul>
  )
}

function AddressMap({
  restaurant,
  address,
  mapsHref,
}: {
  restaurant: Restaurant
  address: string
  mapsHref: string
}) {
  const embedSrc = buildMapEmbedSrc(restaurant, address)
  if (!embedSrc) return null

  return (
    <div className="flex h-full min-h-[min(420px,70vh)] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm lg:min-h-[min(480px,75vh)]">
      <iframe
        title={`Carte — ${restaurant.nom}`}
        src={embedSrc}
        className="min-h-[min(420px,70vh)] w-full flex-1 border-0 lg:min-h-[min(480px,75vh)]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {mapsHref ? (
        <p className="border-t border-neutral-200 bg-white px-4 py-2 text-center text-sm">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={restaurantPageTextLinkClass}
          >
            Ouvrir dans Google Maps
          </a>
        </p>
      ) : null}
    </div>
  )
}

type Props = {
  restaurant: Restaurant
}

export function RestaurantContactAccess({ restaurant }: Props) {
  const address = formatAccessAddress(restaurant)
  const mapsHref =
    restaurant.lienGoogleMaps ||
    (address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : '')
  const mapEmbedSrc = buildMapEmbedSrc(restaurant, address)
  const showMap = Boolean(mapEmbedSrc)

  const rows: ContactRowProps[] = []

  if (address) {
    rows.push({
      icon: <MapPin className="h-5 w-5" strokeWidth={1.75} />,
      label: 'Adresse',
      children: mapsHref ? (
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={restaurantPageTextLinkClass}
        >
          {address}
        </a>
      ) : (
        <span>{address}</span>
      ),
    })
  }

  if (restaurant.telephone) {
    rows.push({
      icon: <Phone className="h-5 w-5" strokeWidth={1.75} />,
      label: 'Téléphone',
      children: (
        <a
          href={formatBelgianPhoneTelHref(restaurant.telephone)}
          className={restaurantPageTextLinkClass}
        >
          {formatBelgianPhoneDisplay(restaurant.telephone)}
        </a>
      ),
    })
  }

  if (restaurant.siteWeb) {
    const href = externalHref(restaurant.siteWeb)
    rows.push({
      icon: <Globe className="h-5 w-5" strokeWidth={1.75} />,
      label: 'Site web',
      children: (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={restaurantPageTextLinkClass}
        >
          {restaurant.siteWeb.replace(/^https?:\/\//i, '')}
        </a>
      ),
    })
  }

  if (restaurant.instagram || restaurant.facebook) {
    const linkClass = restaurantPageTextLinkClass
    rows.push({
      icon: <FacebookIcon className="h-6 w-6" />,
      label: 'Réseaux sociaux',
      children: (
        <span>
          {restaurant.instagram ? (
            <a
              href={externalHref(restaurant.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Instagram
            </a>
          ) : null}
          {restaurant.instagram && restaurant.facebook ? (
            <span className="text-neutral-500"> · </span>
          ) : null}
          {restaurant.facebook ? (
            <a
              href={externalHref(restaurant.facebook)}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Facebook
            </a>
          ) : null}
        </span>
      ),
    })
  }

  if (!showMap && rows.length === 0) {
    return (
      <div className="mt-6">
        <p className="text-lg text-neutral-600">Coordonnées non renseignées pour le moment.</p>
        <ReserveButton restaurant={restaurant} />
      </div>
    )
  }

  if (!showMap) {
    return (
      <div className="mt-6">
        <ContactList rows={rows} />
        <ReserveButton restaurant={restaurant} />
      </div>
    )
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-stretch">
      <div>
        <ContactList rows={rows} />
        <ReserveButton restaurant={restaurant} />
      </div>
      <AddressMap restaurant={restaurant} address={address} mapsHref={mapsHref} />
    </div>
  )
}
