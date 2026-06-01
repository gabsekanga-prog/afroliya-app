-- Post ou reel Instagram « La touche Afroliya » (fiche restaurant)

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS afroliya_instagram_post_url text;

COMMENT ON COLUMN public.restaurants.afroliya_instagram_post_url IS
  'URL d''un post ou reel Instagram Afroliya pour la section « La touche Afroliya ».';
