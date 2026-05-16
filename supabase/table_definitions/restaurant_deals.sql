CREATE TABLE public.restaurant_deals (
  title text,
  description text,
  validity_text text,
  is_active boolean,
  sort_order bigint,
  restaurant_id uuid,
  id uuid NOT NULL,
  CONSTRAINT restaurant_deals_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_deals_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
