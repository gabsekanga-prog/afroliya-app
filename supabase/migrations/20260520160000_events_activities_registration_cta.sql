-- Inscription obligatoire, lien CTA et Google Maps (événements & activités)

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS registration_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS google_maps_link text;

ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS registration_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS google_maps_link text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'events'
      AND column_name = 'external_url'
  ) THEN
    ALTER TABLE public.events RENAME COLUMN external_url TO cta_url;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'activities'
      AND column_name = 'external_url'
  ) THEN
    ALTER TABLE public.activities RENAME COLUMN external_url TO cta_url;
  END IF;
END $$;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS cta_url text;

ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS cta_url text;
