export type RestaurantReservationCta = {
  label: 'Réserver en ligne'
  href: '#reserver'
}

export function getRestaurantReservationChannelLabel(): 'Réservable en ligne' {
  return 'Réservable en ligne'
}

export function getRestaurantReservationCta(): RestaurantReservationCta {
  return {
    label: 'Réserver en ligne',
    href: '#reserver',
  }
}
