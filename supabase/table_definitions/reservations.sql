CREATE TABLE public.reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  booking_date date NOT NULL,
  booking_time time without time zone NOT NULL,
  group_size bigint NOT NULL CHECK (group_size > 0),
  created_at timestamp with time zone DEFAULT now(),
  remarks text,
  client_phone text,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::reservation_status,
  updated_at timestamp with time zone DEFAULT now(),
  public_code text NOT NULL UNIQUE CHECK (public_code ~ '^[A-Za-z0-9]{8}$'::text),
  public_code_expires_at timestamp with time zone NOT NULL DEFAULT (now() + '24:00:00'::interval),
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);
