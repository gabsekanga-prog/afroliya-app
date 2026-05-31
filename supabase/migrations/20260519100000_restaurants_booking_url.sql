-- Lien de réservation en ligne pour les restaurants sponsorisés.
alter table public.restaurants
  add column if not exists booking_url text null;
