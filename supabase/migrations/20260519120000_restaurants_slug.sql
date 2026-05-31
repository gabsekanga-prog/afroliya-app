-- Slug public pour les fiches restaurant (/restaurants/[slug]).
alter table public.restaurants
  add column if not exists slug text null;

create unique index if not exists restaurants_slug_key
  on public.restaurants (slug)
  where slug is not null;

-- Rétro-remplissage depuis le nom (gestion des doublons via suffixe numérique).
do $$
declare
  row record;
  base_slug text;
  candidate text;
  suffix int;
  taken boolean;
begin
  for row in
    select id, name
    from public.restaurants
    where slug is null or trim(slug) = ''
    order by created_at nulls last, id
  loop
    base_slug := trim(both '-' from regexp_replace(
      lower(translate(
        coalesce(nullif(trim(row.name), ''), 'restaurant'),
        'àâäáéèêëíïîóôùûüçñÀÂÄÁÉÈÊËÍÏÎÓÔÙÛÜÇÑ',
        'aaaáeeeeiiiooouuuçnaaaáeeeeiiiooouuuçn'
      )),
      '[^a-z0-9]+',
      '-',
      'g'
    ));

    if base_slug = '' then
      base_slug := 'restaurant';
    end if;

    candidate := base_slug;
    suffix := 2;

    loop
      select exists(
        select 1 from public.restaurants r where r.slug = candidate and r.id <> row.id
      ) into taken;

      exit when not taken;
      candidate := base_slug || '-' || suffix::text;
      suffix := suffix + 1;
    end loop;

    update public.restaurants set slug = candidate where id = row.id;
  end loop;
end $$;
