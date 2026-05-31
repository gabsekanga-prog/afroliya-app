-- Résumé textuel des avis Google (fiche restaurant + admin).
alter table public.restaurants
  add column if not exists google_reviews_summary text null;
