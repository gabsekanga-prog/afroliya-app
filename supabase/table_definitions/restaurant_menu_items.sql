CREATE TABLE public.restaurant_menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  price text,
  sort_order bigint DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT restaurant_menu_items_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_menu_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.restaurant_menu_sections(id)
);
