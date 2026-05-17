CREATE TABLE public.restaurants_tarifs (
  restaurant_id uuid NOT NULL,
  tarif_key text NOT NULL,
  CONSTRAINT restaurants_tarifs_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
  CONSTRAINT restaurants_tarifs_tarif_key_fkey FOREIGN KEY (tarif_key) REFERENCES public.tarifs(key)
) TABLESPACE pg_default;
