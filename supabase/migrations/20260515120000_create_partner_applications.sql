-- Demandes du formulaire « Devenir partenaire » (page /devenir-partenaire)

CREATE TABLE public.partner_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
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

COMMENT ON TABLE public.partner_applications IS
  'Soumissions du formulaire partenaire (page Devenir partenaire).';

CREATE INDEX partner_applications_created_at_idx
  ON public.partner_applications (created_at DESC);

CREATE INDEX partner_applications_email_idx
  ON public.partner_applications (email);

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- Insertion publique via la clé anon (formulaire site)
CREATE POLICY partner_applications_insert_anon
  ON public.partner_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);
