-- Avis validés par Afroliya (affichés sur la fiche restaurant).
create table if not exists public.restaurant_afroliya_reviews (
  id uuid not null default gen_random_uuid(),
  restaurant_id uuid not null,
  author_display_name text not null,
  rating smallint not null,
  body text not null,
  validated_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  constraint restaurant_afroliya_reviews_pkey primary key (id),
  constraint restaurant_afroliya_reviews_restaurant_id_fkey foreign key (restaurant_id) references restaurants (id) on delete cascade,
  constraint restaurant_afroliya_reviews_rating_check check (
    (rating >= 1) and (rating <= 5)
  )
) tablespace pg_default;

create index if not exists restaurant_afroliya_reviews_restaurant_id_idx
  on public.restaurant_afroliya_reviews using btree (restaurant_id);
