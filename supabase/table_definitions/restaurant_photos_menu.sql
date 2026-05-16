CREATE TABLE public.restaurant_photos_menu (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  restaurant_id uuid NOT NULL,
  image_src text NOT NULL,
  caption text,
  sort_order bigint DEFAULT '0'::bigint,
  published boolean DEFAULT true,
  id uuid NOT NULL,
  CONSTRAINT restaurant_photos_menu_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_photos_menu_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
