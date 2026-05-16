CREATE TABLE public.restaurant_opening_slots (
  restaurant_id uuid,
  day integer,
  open_time time without time zone,
  close_time time without time zone,
  sort_order smallint,
  id uuid NOT NULL,
  CONSTRAINT restaurant_opening_slots_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_opening_slots_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
