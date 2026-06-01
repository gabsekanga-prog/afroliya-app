-- Pivot restaurants uniquement : suppression événements, activités et galeries associées

DROP POLICY IF EXISTS experience_images_select_anon ON public.experience_images;
DROP TABLE IF EXISTS public.experience_images;

DROP POLICY IF EXISTS events_select_anon ON public.events;
DROP POLICY IF EXISTS activities_select_anon ON public.activities;

DROP TABLE IF EXISTS public.activities;
DROP TABLE IF EXISTS public.events;
