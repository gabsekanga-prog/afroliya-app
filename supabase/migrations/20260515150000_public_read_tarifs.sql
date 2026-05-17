-- Lecture publique des tarifs liés aux restaurants (liste / fiches)

ALTER TABLE public.tarifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants_tarifs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tarifs_select_anon ON public.tarifs;
CREATE POLICY tarifs_select_anon
  ON public.tarifs
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS restaurants_tarifs_select_anon ON public.restaurants_tarifs;
CREATE POLICY restaurants_tarifs_select_anon
  ON public.restaurants_tarifs
  FOR SELECT
  TO anon
  USING (true);
