-- Tarification événements & activités (gratuit / payant)

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;

ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;
