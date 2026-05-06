-- Table des guides thématiques (contenu éditable depuis Supabase)
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  image_src text not null,
  image_alt text,
  excerpt text,
  body text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guides_published_sort_idx
  on public.guides (published, sort_order);

alter table public.guides enable row level security;

drop policy if exists "guides_select_published" on public.guides;

create policy "guides_select_published"
  on public.guides
  for select
  to anon, authenticated
  using (published = true);

-- Données initiales (facultatif : commenter si vous préférez tout saisir à la main)
insert into public.guides (slug, title, image_src, image_alt, excerpt, body, sort_order, published)
values
  (
    'restaurants-camerounais-bruxelles',
    '4 restaurants camerounais bien notés à Bruxelles',
    '/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp',
    'Ambiance de restaurant africain à Bruxelles',
    null,
    '<p>Notre sélection détaillée sera bientôt disponible ici. En attendant, parcourez les restaurants partenaires sur Afroliya.</p>',
    0,
    true
  ),
  (
    'diner-amoureux-restaurants-africains-bruxelles',
    '3 restaurants africains pour un dîner en amoureux à Bruxelles',
    '/images/Couple%20manger%20restaurant%20africain.jpg',
    'Couple au restaurant africain',
    null,
    '<p>Notre sélection détaillée sera bientôt disponible ici. En attendant, parcourez les restaurants partenaires sur Afroliya.</p>',
    1,
    true
  ),
  (
    'restaurants-congolais-bruxelles',
    '3 restaurants congolais bien notés à Bruxelles et autour',
    '/images/Nourriture%20congolaise.jpg',
    'Plat de cuisine congolaise',
    null,
    '<p>Notre sélection détaillée sera bientôt disponible ici. En attendant, parcourez les restaurants partenaires sur Afroliya.</p>',
    2,
    true
  )
on conflict (slug) do nothing;
