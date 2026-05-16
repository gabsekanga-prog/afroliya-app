CREATE TABLE public.newsletter (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  opt_in_date timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  CONSTRAINT newsletter_pkey PRIMARY KEY (id)
);
