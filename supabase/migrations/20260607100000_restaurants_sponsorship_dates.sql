-- Période de sponsorisation pour activer les options de réservation en ligne.
alter table public.restaurants
  add column if not exists sponsorship_start_date date null;

alter table public.restaurants
  add column if not exists sponsorship_end_date date null;
