CREATE TABLE public.restaurant_stats_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  restaurant_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type = ANY (ARRAY['page_view'::text, 'click'::text])),
  event_key text NOT NULL CHECK (char_length(TRIM(BOTH FROM event_key)) >= 1 AND char_length(TRIM(BOTH FROM event_key)) <= 80),
  page_path text,
  referer text,
  user_agent text,
  CONSTRAINT restaurant_stats_events_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_stats_events_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE
);
