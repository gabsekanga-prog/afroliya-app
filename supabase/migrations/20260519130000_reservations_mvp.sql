-- Réservations MVP : statuts, table principale, vérification e-mail.

DO $$ BEGIN
  CREATE TYPE public.reservation_status AS ENUM (
    'pending',
    'confirmed',
    'declined',
    'cancelled',
    'no_show'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.reservation_sender_type AS ENUM ('client', 'restaurant', 'system');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.reservations (
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
  status public.reservation_status NOT NULL DEFAULT 'pending',
  updated_at timestamp with time zone DEFAULT now(),
  public_code text NOT NULL UNIQUE CHECK (public_code ~ '^[A-Za-z0-9]{8}$'),
  public_code_expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS reservations_restaurant_id_booking_date_idx
  ON public.reservations (restaurant_id, booking_date);

CREATE TABLE IF NOT EXISTS public.reservation_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reservation_id uuid NOT NULL,
  sender_type public.reservation_sender_type NOT NULL,
  message text NOT NULL CHECK (length(message) <= 500),
  CONSTRAINT reservation_messages_pkey PRIMARY KEY (id),
  CONSTRAINT reservation_messages_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.email_verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL CHECK (code ~ '^\d{6}$'),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT email_verification_codes_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS email_verification_codes_email_idx
  ON public.email_verification_codes (email, created_at DESC);

CREATE TABLE IF NOT EXISTS public.verified_client_emails (
  email text NOT NULL PRIMARY KEY,
  verified_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_client_emails ENABLE ROW LEVEL SECURITY;
