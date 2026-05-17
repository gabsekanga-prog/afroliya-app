-- Lecture publique des images de couverture (liste / fiches restaurants)

ALTER TABLE public.restaurant_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_images_select_anon ON public.restaurant_images;
CREATE POLICY restaurant_images_select_anon
  ON public.restaurant_images
  FOR SELECT
  TO anon
  USING (true);
