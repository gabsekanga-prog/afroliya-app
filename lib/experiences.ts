import type { Restaurant } from '@/lib/restaurants'

export type ExperienceTypeTag = {
  key: string
  label: string
}

export type Experience = {
  id: string
  slug: string
  title: string
  description: string
  imageSrc: string
  location: string
  type: ExperienceTypeTag
  /** Affiché sous le titre (ex. date, durée, cuisine). */
  meta?: string
  href: string
}

export type ExperienceCategory = 'restaurants' | 'evenements' | 'activites'

export type ExperienceFilterOptions = {
  types: ExperienceTypeTag[]
  lieux: string[]
}

export type ExperienceFilters = {
  query: string
  typeKey: string
  lieu: string
}

const PUBLISHED_EVENTS: Experience[] = [
  {
    id: 'evt-1',
    slug: 'soiree-afrobeat-live',
    title: 'Soirée Afrobeat Live',
    description: 'Concert et DJ set jusqu\'au bout de la nuit.',
    imageSrc: '/images/Couple%20manger%20restaurant%20africain.jpg',
    location: 'Ixelles',
    type: { key: 'concert-soiree', label: 'Concert & soirée' },
    meta: 'Ven. 20 juin · 21h',
    href: '/evenements',
  },
  {
    id: 'evt-2',
    slug: 'festival-saveurs-afrique',
    title: 'Festival Saveurs d\'Afrique',
    description: 'Street food, musique live et artisans locaux.',
    imageSrc: '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp',
    location: 'Tour & Taxis',
    type: { key: 'festival', label: 'Festival' },
    meta: 'Sam. 5 juil. · journée',
    href: '/evenements',
  },
  {
    id: 'evt-3',
    slug: 'brunch-dimanche-afro',
    title: 'Brunch dimanche afro',
    description: 'Buffet, cocktails sans alcool et ambiance lounge.',
    imageSrc:
      '/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp',
    location: 'Saint-Gilles',
    type: { key: 'brunch-food', label: 'Brunch & food' },
    meta: 'Dim. 15 juin · 11h–15h',
    href: '/evenements',
  },
  {
    id: 'evt-4',
    slug: 'marche-nocturne-matonge',
    title: 'Marché nocturne Matongé',
    description: 'Découvertes culinaires et performances de rue.',
    imageSrc: '/images/Couple%20manger%20restaurant%20africain.jpg',
    location: 'Ixelles',
    type: { key: 'marche', label: 'Marché' },
    meta: 'Jeu. 26 juin · 18h–23h',
    href: '/evenements',
  },
  {
    id: 'evt-5',
    slug: 'cinema-afrique-plein-air',
    title: 'Cinéma Afrique en plein air',
    description: 'Projection et débat avec réalisateurs invités.',
    imageSrc: '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp',
    location: 'Forest',
    type: { key: 'cinema', label: 'Cinéma' },
    meta: 'Sam. 12 juil. · 21h',
    href: '/evenements',
  },
  {
    id: 'evt-6',
    slug: 'jam-session-gospel',
    title: 'Jam session gospel',
    description: 'Chorale participative et chants traditionnels.',
    imageSrc:
      '/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp',
    location: 'Molenbeek',
    type: { key: 'musique', label: 'Musique' },
    meta: 'Dim. 29 juin · 17h',
    href: '/evenements',
  },
  {
    id: 'evt-7',
    slug: 'expo-contemporaine-diaspora',
    title: 'Expo contemporaine Diaspora',
    description: 'Œuvres d\'artistes afro-belges et talks curatoriaux.',
    imageSrc: '/images/Couple%20manger%20restaurant%20africain.jpg',
    location: 'Schaerbeek',
    type: { key: 'exposition', label: 'Exposition' },
    meta: 'Jusqu\'au 30 août',
    href: '/evenements',
  },
  {
    id: 'evt-8',
    slug: 'soiree-comedy-club-afro',
    title: 'Soirée Comedy Club afro',
    description: 'Humoristes francophones et open mic.',
    imageSrc: '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp',
    location: 'Etterbeek',
    type: { key: 'humour', label: 'Humour' },
    meta: 'Ven. 4 juil. · 20h30',
    href: '/evenements',
  },
]

const PUBLISHED_ACTIVITIES: Experience[] = [
  {
    id: 'act-1',
    slug: 'cours-danse-afro',
    title: 'Cours de danse afro',
    description: 'Initiation couverte et rythmes afro-cubains.',
    imageSrc: '/images/Couple%20manger%20restaurant%20africain.jpg',
    location: 'Ixelles',
    type: { key: 'danse', label: 'Danse' },
    meta: '1h30 · tous niveaux',
    href: '/activites',
  },
  {
    id: 'act-2',
    slug: 'atelier-cuisine-senegalaise',
    title: 'Atelier cuisine sénégalaise',
    description: 'Préparez thiéboudienne avec un chef invité.',
    imageSrc: '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp',
    location: 'Anderlecht',
    type: { key: 'cuisine', label: 'Cuisine' },
    meta: '3h · en groupe',
    href: '/activites',
  },
  {
    id: 'act-3',
    slug: 'visite-guidee-matonge',
    title: 'Visite guidée Matongé',
    description: 'Parcours gourmand et histoires de quartier.',
    imageSrc:
      '/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp',
    location: 'Ixelles',
    type: { key: 'visite', label: 'Visite' },
    meta: '2h · petit groupe',
    href: '/activites',
  },
  {
    id: 'act-4',
    slug: 'percussions-djembe',
    title: 'Percussions djembe',
    description: 'Rythmes mandingues et polyrythmies en cercle.',
    imageSrc: '/images/Couple%20manger%20restaurant%20africain.jpg',
    location: 'Saint-Josse',
    type: { key: 'musique', label: 'Musique' },
    meta: '1h · matériel fourni',
    href: '/activites',
  },
  {
    id: 'act-5',
    slug: 'degustation-cafes-africains',
    title: 'Dégustation cafés africains',
    description: 'Origines, torréfaction et méthodes d\'extraction.',
    imageSrc: '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp',
    location: 'Uccle',
    type: { key: 'degustation', label: 'Dégustation' },
    meta: '1h15 · dégustation',
    href: '/activites',
  },
  {
    id: 'act-6',
    slug: 'initiation-langues-locales',
    title: 'Initiation langues locales',
    description: 'Expressions du quotidien en wolof et lingala.',
    imageSrc:
      '/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp',
    location: 'Etterbeek',
    type: { key: 'langues', label: 'Langues' },
    meta: '1h · débutant',
    href: '/activites',
  },
  {
    id: 'act-7',
    slug: 'yoga-sonores-africains',
    title: 'Yoga & sons africains',
    description: 'Séance douce accompagnée de instruments live.',
    imageSrc: '/images/Couple%20manger%20restaurant%20africain.jpg',
    location: 'Watermael-Boitsfort',
    type: { key: 'bien-etre', label: 'Bien-être' },
    meta: '1h · tapis fourni',
    href: '/activites',
  },
  {
    id: 'act-8',
    slug: 'atelier-mode-wax',
    title: 'Atelier mode wax',
    description: 'Créez un accessoire avec tissus wax authentiques.',
    imageSrc: '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp',
    location: 'Forest',
    type: { key: 'mode', label: 'Mode & créatif' },
    meta: '2h30 · créatif',
    href: '/activites',
  },
]

export function getPublishedEvents(): Experience[] {
  return PUBLISHED_EVENTS
}

export function getPublishedActivities(): Experience[] {
  return PUBLISHED_ACTIVITIES
}

export function restaurantToExperience(restaurant: Restaurant): Experience {
  const cuisineLabel =
    restaurant.cuisines.length > 0
      ? restaurant.cuisines.map((c) => c.label).join(', ')
      : restaurant.cuisine

  return {
    id: restaurant.id,
    slug: restaurant.slug,
    title: restaurant.nom,
    description: cuisineLabel,
    imageSrc: restaurant.image,
    location: restaurant.commune,
    type: { key: 'restaurant', label: 'Restaurant' },
    meta: `★ ${restaurant.note}${restaurant.tarif ? ` · ${restaurant.tarif}` : ''}`,
    href: `/restaurants/${restaurant.slug}`,
  }
}

export function buildExperienceFilterOptions(
  experiences: Experience[],
): ExperienceFilterOptions {
  const typeMap = new Map<string, string>()
  const lieux = new Set<string>()

  for (const experience of experiences) {
    typeMap.set(experience.type.key, experience.type.label)
    const lieu = experience.location.trim()
    if (lieu) lieux.add(lieu)
  }

  return {
    types: [...typeMap.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, 'fr')),
    lieux: [...lieux].sort((a, b) => a.localeCompare(b, 'fr')),
  }
}

export function filterExperiences(
  items: Experience[],
  filters: ExperienceFilters,
): Experience[] {
  const query = filters.query.trim().toLowerCase()
  const typeKey = filters.typeKey.trim()
  const lieu = filters.lieu.trim().toLowerCase()

  return items.filter((item) => {
    if (typeKey && item.type.key !== typeKey) {
      return false
    }

    if (lieu && item.location.trim().toLowerCase() !== lieu) {
      return false
    }

    if (!query) return true

    const haystack = [
      item.title,
      item.description,
      item.location,
      item.type.label,
      item.meta ?? '',
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}

export const EXPERIENCE_HUB_PREVIEW_COUNT = 5

export const EXPERIENCES_LIST_PAGE_SIZE = 12

export function exploreAllLabel(category: ExperienceCategory): string {
  switch (category) {
    case 'restaurants':
      return 'Voir tous les restaurants'
    case 'evenements':
      return 'Voir tous les événements'
    case 'activites':
      return 'Explorer toutes les activités'
  }
}

export function exploreAllHref(category: ExperienceCategory): string {
  switch (category) {
    case 'restaurants':
      return '/restaurants'
    case 'evenements':
      return '/evenements'
    case 'activites':
      return '/activites'
  }
}
