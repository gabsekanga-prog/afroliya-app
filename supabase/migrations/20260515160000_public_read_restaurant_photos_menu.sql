-- Lecture publique des pages de menu publiées

ALTER TABLE public.restaurant_photos_menu ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_photos_menu_select_anon ON public.restaurant_photos_menu;
CREATE POLICY restaurant_photos_menu_select_anon
  ON public.restaurant_photos_menu
  FOR SELECT
  TO anon
  USING (published IS NOT FALSE);
