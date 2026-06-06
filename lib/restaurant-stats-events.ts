/** Libellés affichés dans l’admin (stockés dans `event_key`). */
export const RESTAURANT_STATS_CLICK_LABELS = {
  pageView: 'Vue page restaurant',
  reserveOnline: 'Réserver en ligne',
  reservePhone: 'Réserver par téléphone',
  call: 'Appeler',
  reservePartner: 'Réserver via le partenaire',
  directions: "Voir l'itinéraire",
  website: 'Site web',
  instagram: 'Instagram',
  facebook: 'Facebook',
  googleReviews: 'Voir tous les avis Google',
  viewMenu: 'Voir le menu',
  viewPhotos: 'Voir les photos',
} as const

export type RestaurantStatsClickLabel =
  (typeof RESTAURANT_STATS_CLICK_LABELS)[keyof typeof RESTAURANT_STATS_CLICK_LABELS]
