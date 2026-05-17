-- Lecture publique des caractéristiques (catalogue actif + liens restaurant)

ALTER TABLE public.restaurant_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_features_select_anon ON public.restaurant_features;
CREATE POLICY restaurant_features_select_anon
  ON public.restaurant_features
  FOR SELECT
  TO anon
  USING (is_active IS NOT FALSE);

ALTER TABLE public.restaurant_feature_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_feature_links_select_anon ON public.restaurant_feature_links;
CREATE POLICY restaurant_feature_links_select_anon
  ON public.restaurant_feature_links
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.restaurants r
      WHERE r.id = restaurant_feature_links.restaurant_id
        AND r.active IS TRUE
    )
  );
