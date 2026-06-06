CREATE TABLE public.guide_page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  guide_id uuid NOT NULL,
  page_path text,
  referer text,
  user_agent text,
  CONSTRAINT guide_page_views_pkey PRIMARY KEY (id),
  CONSTRAINT guide_page_views_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.guides(id) ON DELETE CASCADE
);

CREATE INDEX guide_page_views_guide_id_idx ON public.guide_page_views USING btree (guide_id);
CREATE INDEX guide_page_views_created_at_desc_idx ON public.guide_page_views USING btree (created_at DESC);
