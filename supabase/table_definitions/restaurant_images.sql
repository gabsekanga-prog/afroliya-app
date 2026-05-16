CREATE TABLE public.restaurant_images (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  restaurant_id uuid NOT NULL,
  image_url text NOT NULL,
  cover boolean,
  description text,
  CONSTRAINT restaurant_images_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
