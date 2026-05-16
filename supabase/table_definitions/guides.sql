CREATE TABLE public.guides (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  image_src text NOT NULL,
  image_alt text,
  excerpt text,
  body text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  intro text,
  subsections jsonb NOT NULL DEFAULT '[]'::jsonb,
  CONSTRAINT guides_pkey PRIMARY KEY (id)
);
