export type ExperienceCategoryCard = {
  title: string
  description: string
  href: string
  imageSrc: string
  imageAlt: string
  cta: string
}

export const experienceCategoryCards: ExperienceCategoryCard[] = [
  {
    title: 'Restaurants',
    description: 'Cuisines authentiques, street-food, gastronomie, brunchs, cafés, etc.',
    href: '/restaurants',
    imageSrc: '/images/famille restaurant.webp',
    imageAlt: 'Restaurant sénégalais à Bruxelles',
    cta: 'Explorer',
  },
  {
    title: 'Événements',
    description: 'Festivals, expositions, conférences, défilés, concerts, etc..',
    href: '/evenements',
    imageSrc: '/images/Défilé.webp',
    imageAlt: 'Couple profitant d une soirée dans un restaurant africain',
    cta: 'Explorer',
  },
  {
    title: 'Activités',
    description: 'Cours et ateliers de danses, musiques, cuisines, langues, etc.',
    href: '/activites',
    imageSrc:
      '/images/Cours Djembé.webp',
    imageAlt: 'Ambiance dans un lieu afro à Bruxelles',
    cta: 'Explorer',
  },
]
