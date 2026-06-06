import type { Metadata } from 'next'

import { getSiteBaseUrl } from '@/lib/reservations'
import {
  formatRestaurantLocationLine,
  type Restaurant,
} from '@/lib/restaurants'

export const siteDefaultTitle =
  'Afroliya — Restaurants afro à Bruxelles et alentours'

export const siteTitleTemplate = '%s | Afroliya'

export const siteDefaultDescription =
  'Découvrez des adresses afro à tester, explorez nos guides thématiques et réservez votre table en ligne gratuitement.'

export const siteMetadataBase = new URL(getSiteBaseUrl())

export const rootLayoutMetadata: Metadata = {
  metadataBase: siteMetadataBase,
  title: {
    default: siteDefaultTitle,
    template: siteTitleTemplate,
  },
  description: siteDefaultDescription,
}

export const privatePageMetadata: Metadata = {
  robots: { index: false, follow: false },
}

export function truncateMetaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

export function buildRestaurantPageMetadata(restaurant: Restaurant): Metadata {
  const location = formatRestaurantLocationLine(
    restaurant.codePostal,
    restaurant.commune,
    restaurant.ville,
  )
  const placeLabel = restaurant.commune.trim() || restaurant.ville.trim()

  const title = placeLabel
    ? `${restaurant.nom} — ${restaurant.cuisine} à ${placeLabel}`
    : `${restaurant.nom} — ${restaurant.cuisine}`

  const description = restaurant.description.trim()
    ? truncateMetaDescription(restaurant.description)
    : truncateMetaDescription(
        `Réservez ${restaurant.nom}${location ? ` à ${location}` : ''}. Cuisine ${restaurant.cuisine} sur Afroliya.`,
      )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: restaurant.image ? [{ url: restaurant.image, alt: restaurant.nom }] : undefined,
    },
  }
}
