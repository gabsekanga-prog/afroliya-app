-- Menu structuré (texte) : sections + plats, lecture publique

CREATE TABLE IF NOT EXISTS public.restaurant_menu_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  sort_order bigint DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT restaurant_menu_sections_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_menu_sections_restaurant_id_fkey
    FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.restaurant_menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  price text,
  sort_order bigint DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT restaurant_menu_items_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_menu_items_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.restaurant_menu_sections(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS restaurant_menu_sections_restaurant_id_idx
  ON public.restaurant_menu_sections (restaurant_id);

CREATE INDEX IF NOT EXISTS restaurant_menu_items_section_id_idx
  ON public.restaurant_menu_items (section_id);

ALTER TABLE public.restaurant_menu_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_menu_sections_select_anon ON public.restaurant_menu_sections;
CREATE POLICY restaurant_menu_sections_select_anon
  ON public.restaurant_menu_sections
  FOR SELECT
  TO anon
  USING (
    published IS NOT FALSE
    AND EXISTS (
      SELECT 1
      FROM public.restaurants r
      WHERE r.id = restaurant_menu_sections.restaurant_id
        AND r.active IS TRUE
    )
  );

ALTER TABLE public.restaurant_menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_menu_items_select_anon ON public.restaurant_menu_items;
CREATE POLICY restaurant_menu_items_select_anon
  ON public.restaurant_menu_items
  FOR SELECT
  TO anon
  USING (
    published IS NOT FALSE
    AND EXISTS (
      SELECT 1
      FROM public.restaurant_menu_sections s
      JOIN public.restaurants r ON r.id = s.restaurant_id
      WHERE s.id = restaurant_menu_items.section_id
        AND s.published IS NOT FALSE
        AND r.active IS TRUE
    )
  );
