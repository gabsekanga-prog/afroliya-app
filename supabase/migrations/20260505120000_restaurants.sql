create table if not exists public.restaurants (
  id serial primary key,
  slug text not null unique,
  nom text not null,
  cuisine text not null,
  ville text not null,
  note text not null,
  image text not null,
  description text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists restaurants_published_sort_idx
  on public.restaurants (published, sort_order);

alter table public.restaurants enable row level security;

drop policy if exists "restaurants_select_published" on public.restaurants;

create policy "restaurants_select_published"
  on public.restaurants
  for select
  to anon, authenticated
  using (published = true);

insert into public.restaurants (slug, nom, cuisine, ville, note, image, description, sort_order, published)
values
  (
    'africalicious',
    'Africalicious',
    'Cuisine congolaise',
    'Bruxelles',
    '4.8',
    'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80',
    'Saveurs authentiques et ambiance chaleureuse.',
    0,
    true
  ),
  (
    'le-baobab',
    'Le Baobab',
    'Cuisine sénégalaise',
    'Ixelles',
    '4.7',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'Une carte généreuse avec des classiques d Afrique de l Ouest.',
    1,
    true
  ),
  (
    'mama-douala',
    'Mama Douala',
    'Cuisine camerounaise',
    'Saint-Gilles',
    '4.6',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'Plats maison, produits frais et accueil familial.',
    2,
    true
  ),
  (
    'nile-and-spice',
    'Nile & Spice',
    'Cuisine éthiopienne',
    'Etterbeek',
    '4.5',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    'Experience gourmande autour des injeras et plats a partager.',
    3,
    true
  ),
  (
    'kin-saveurs',
    'Kin Saveurs',
    'Cuisine congolaise',
    'Molenbeek',
    '4.7',
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80',
    'Cuisine généreuse, grillades afro et ambiance festive.',
    4,
    true
  ),
  (
    'dakar-house',
    'Dakar House',
    'Cuisine sénégalaise',
    'Schaerbeek',
    '4.6',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    'Thieb, yassa et spécialités maison dans un cadre cosy.',
    5,
    true
  )
on conflict (slug) do nothing;
