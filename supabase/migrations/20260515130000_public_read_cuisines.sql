-- Lecture publique des cuisines liées aux restaurants (liste / fiches)

ALTER TABLE public.cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_cuisines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cuisines_select_anon ON public.cuisines;
CREATE POLICY cuisines_select_anon
  ON public.cuisines
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS restaurant_cuisines_select_anon ON public.restaurant_cuisines;
CREATE POLICY restaurant_cuisines_select_anon
  ON public.restaurant_cuisines
  FOR SELECT
  TO anon
  USING (true);
