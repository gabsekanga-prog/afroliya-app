-- Événements et activités publiés (listes publiques + admin tables)

CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_src text NOT NULL,
  location text NOT NULL DEFAULT '',
  type_key text NOT NULL,
  type_label text NOT NULL,
  meta text,
  external_url text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_slug_key UNIQUE (slug)
);

CREATE TABLE IF NOT EXISTS public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_src text NOT NULL,
  location text NOT NULL DEFAULT '',
  type_key text NOT NULL,
  type_label text NOT NULL,
  meta text,
  external_url text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_slug_key UNIQUE (slug)
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS events_select_anon ON public.events;
CREATE POLICY events_select_anon
  ON public.events
  FOR SELECT
  TO anon
  USING (published = true);

DROP POLICY IF EXISTS activities_select_anon ON public.activities;
CREATE POLICY activities_select_anon
  ON public.activities
  FOR SELECT
  TO anon
  USING (published = true);
