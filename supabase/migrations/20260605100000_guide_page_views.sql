-- Vues des pages guides thématiques

CREATE TABLE IF NOT EXISTS public.guide_page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  page_path text,
  referer text,
  user_agent text,
  CONSTRAINT guide_page_views_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS guide_page_views_guide_id_idx
  ON public.guide_page_views (guide_id);

CREATE INDEX IF NOT EXISTS guide_page_views_created_at_desc_idx
  ON public.guide_page_views (created_at DESC);

ALTER TABLE public.guide_page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS guide_page_views_insert_anon ON public.guide_page_views;
CREATE POLICY guide_page_views_insert_anon
  ON public.guide_page_views
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.guides g
      WHERE g.id = guide_page_views.guide_id
        AND g.published IS TRUE
    )
  );
