CREATE TABLE public.restaurant_cuisines (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  restaurant_id uuid NOT NULL,
  cuisine_key text NOT NULL,
  CONSTRAINT restaurant_cuisines_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
  CONSTRAINT restaurant_cuisines_cuisine_key_fkey FOREIGN KEY (cuisine_key) REFERENCES public.cuisines(key)
);
