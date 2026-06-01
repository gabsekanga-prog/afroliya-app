-- Galerie photos (événements & activités)

CREATE TABLE IF NOT EXISTS public.experience_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  event_id uuid,
  activity_id uuid,
  image_url text NOT NULL,
  cover boolean,
  description text,
  CONSTRAINT experience_images_pkey PRIMARY KEY (id),
  CONSTRAINT experience_images_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT experience_images_activity_id_fkey
    FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE CASCADE,
  CONSTRAINT experience_images_parent_check CHECK (
    (event_id IS NOT NULL AND activity_id IS NULL)
    OR (event_id IS NULL AND activity_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS experience_images_event_id_idx
  ON public.experience_images (event_id);

CREATE INDEX IF NOT EXISTS experience_images_activity_id_idx
  ON public.experience_images (activity_id);

ALTER TABLE public.experience_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS experience_images_select_anon ON public.experience_images;
CREATE POLICY experience_images_select_anon
  ON public.experience_images
  FOR SELECT
  TO anon
  USING (
    (
      event_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.events e
        WHERE e.id = event_id AND e.published = true
      )
    )
    OR (
      activity_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.activities a
        WHERE a.id = activity_id AND a.published = true
      )
    )
  );
