-- Lecture publique des horaires d'ouverture (restaurants actifs)

ALTER TABLE public.restaurant_opening_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_opening_slots_select_anon ON public.restaurant_opening_slots;
CREATE POLICY restaurant_opening_slots_select_anon
  ON public.restaurant_opening_slots
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.restaurants r
      WHERE r.id = restaurant_opening_slots.restaurant_id
        AND r.active IS TRUE
    )
  );
