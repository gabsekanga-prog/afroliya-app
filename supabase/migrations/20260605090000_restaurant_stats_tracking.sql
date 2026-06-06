-- Tracking des pages restaurants (vues + clics CTA)

CREATE TABLE IF NOT EXISTS public.restaurant_stats_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_key text NOT NULL,
  page_path text,
  referer text,
  user_agent text,
  CONSTRAINT restaurant_stats_events_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_stats_events_type_check CHECK (event_type IN ('page_view', 'click')),
  CONSTRAINT restaurant_stats_events_key_len_check CHECK (char_length(trim(event_key)) BETWEEN 1 AND 80)
);

CREATE INDEX IF NOT EXISTS restaurant_stats_events_restaurant_id_idx
  ON public.restaurant_stats_events (restaurant_id);

CREATE INDEX IF NOT EXISTS restaurant_stats_events_created_at_desc_idx
  ON public.restaurant_stats_events (created_at DESC);

CREATE INDEX IF NOT EXISTS restaurant_stats_events_restaurant_type_idx
  ON public.restaurant_stats_events (restaurant_id, event_type);

ALTER TABLE public.restaurant_stats_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_stats_events_insert_anon ON public.restaurant_stats_events;
CREATE POLICY restaurant_stats_events_insert_anon
  ON public.restaurant_stats_events
  FOR INSERT
  TO anon
  WITH CHECK (
    event_type IN ('page_view', 'click')
    AND char_length(trim(event_key)) BETWEEN 1 AND 80
    AND EXISTS (
      SELECT 1
      FROM public.restaurants r
      WHERE r.id = restaurant_stats_events.restaurant_id
        AND r.active IS TRUE
    )
  );
