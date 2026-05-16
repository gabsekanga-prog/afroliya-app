CREATE TABLE public.partner_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  restaurant text NOT NULL,
  restaurant_details text,
  offer text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  CONSTRAINT partner_applications_pkey PRIMARY KEY (id),
  CONSTRAINT partner_applications_offer_check CHECK (
    offer IN ('basique', 'standard', 'premium')
  )
);
