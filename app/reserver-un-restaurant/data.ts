export type Restaurant = {
  id: number
  slug: string
  nom: string
  cuisine: string
  ville: string
  note: string
  image: string
  description: string
}

export const restaurants: Restaurant[] = [
  {
    id: 1,
    slug: 'africalicious',
    nom: 'Africalicious',
    cuisine: 'Cuisine congolaise',
    ville: 'Bruxelles',
    note: '4.8',
    image:
      'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80',
    description: 'Saveurs authentiques et ambiance chaleureuse.',
  },
  {
    id: 2,
    slug: 'le-baobab',
    nom: 'Le Baobab',
    cuisine: 'Cuisine sénégalaise',
    ville: 'Ixelles',
    note: '4.7',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    description: 'Une carte généreuse avec des classiques d Afrique de l Ouest.',
  },
  {
    id: 3,
    slug: 'mama-douala',
    nom: 'Mama Douala',
    cuisine: 'Cuisine camerounaise',
    ville: 'Saint-Gilles',
    note: '4.6',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    description: 'Plats maison, produits frais et accueil familial.',
  },
  {
    id: 4,
    slug: 'nile-and-spice',
    nom: 'Nile & Spice',
    cuisine: 'Cuisine éthiopienne',
    ville: 'Etterbeek',
    note: '4.5',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    description: 'Experience gourmande autour des injeras et plats a partager.',
  },
  {
    id: 5,
    slug: 'kin-saveurs',
    nom: 'Kin Saveurs',
    cuisine: 'Cuisine congolaise',
    ville: 'Molenbeek',
    note: '4.7',
    image:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80',
    description: 'Cuisine généreuse, grillades afro et ambiance festive.',
  },
  {
    id: 6,
    slug: 'dakar-house',
    nom: 'Dakar House',
    cuisine: 'Cuisine sénégalaise',
    ville: 'Schaerbeek',
    note: '4.6',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    description: 'Thieb, yassa et spécialités maison dans un cadre cosy.',
  },
]
