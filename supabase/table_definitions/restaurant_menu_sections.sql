CREATE TABLE public.restaurant_menu_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  sort_order bigint DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT restaurant_menu_sections_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_menu_sections_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
