-- Vignette manuelle pour la carte « La touche Afroliya » (oEmbed ne fournit plus thumbnail_url)

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS afroliya_instagram_thumbnail_url text;

COMMENT ON COLUMN public.restaurants.afroliya_instagram_thumbnail_url IS
  'URL image de couverture pour la vignette vidéo Instagram (section La touche Afroliya).';
