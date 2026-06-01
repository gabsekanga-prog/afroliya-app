-- Lieu structuré + créneaux horaires (événements & activités)

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS venue text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS postal_code text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS commune text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS starts_at timestamp without time zone,
  ADD COLUMN IF NOT EXISTS ends_at timestamp without time zone;

ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS venue text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS postal_code text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS commune text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS starts_at timestamp without time zone,
  ADD COLUMN IF NOT EXISTS ends_at timestamp without time zone;

UPDATE public.events
SET commune = location
WHERE commune = '' AND location <> '';

UPDATE public.activities
SET commune = location
WHERE commune = '' AND location <> '';

ALTER TABLE public.events DROP COLUMN IF EXISTS location;
ALTER TABLE public.activities DROP COLUMN IF EXISTS location;
