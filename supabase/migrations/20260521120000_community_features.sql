-- Fonctionnalités communauté : réactions, votes réservation, suggestions d'adresses

CREATE TABLE IF NOT EXISTS public.restaurant_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  reaction_type text NOT NULL,
  client_id text NOT NULL,
  CONSTRAINT restaurant_reactions_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_reactions_type_check CHECK (
    reaction_type IN ('ate_here', 'love')
  ),
  CONSTRAINT restaurant_reactions_unique_client UNIQUE (restaurant_id, client_id, reaction_type)
);

CREATE INDEX restaurant_reactions_restaurant_id_idx
  ON public.restaurant_reactions (restaurant_id);

CREATE TABLE IF NOT EXISTS public.restaurant_reservation_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  client_id text NOT NULL,
  CONSTRAINT restaurant_reservation_votes_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_reservation_votes_unique_client UNIQUE (restaurant_id, client_id)
);

CREATE INDEX restaurant_reservation_votes_restaurant_id_idx
  ON public.restaurant_reservation_votes (restaurant_id);

CREATE TABLE IF NOT EXISTS public.address_suggestions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  guide_slug text,
  restaurant_name text NOT NULL,
  commune text NOT NULL,
  details text,
  email text,
  CONSTRAINT address_suggestions_pkey PRIMARY KEY (id)
);

CREATE INDEX address_suggestions_created_at_idx
  ON public.address_suggestions (created_at DESC);

CREATE TABLE IF NOT EXISTS public.restaurant_community_stats (
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  ate_here_count integer NOT NULL DEFAULT 0,
  love_count integer NOT NULL DEFAULT 0,
  reservation_vote_count integer NOT NULL DEFAULT 0,
  CONSTRAINT restaurant_community_stats_pkey PRIMARY KEY (restaurant_id),
  CONSTRAINT restaurant_community_stats_counts_nonneg CHECK (
    ate_here_count >= 0
    AND love_count >= 0
    AND reservation_vote_count >= 0
  )
);

CREATE OR REPLACE FUNCTION public.bump_restaurant_reaction_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.restaurant_community_stats (restaurant_id)
  VALUES (NEW.restaurant_id)
  ON CONFLICT (restaurant_id) DO NOTHING;

  IF NEW.reaction_type = 'ate_here' THEN
    UPDATE public.restaurant_community_stats
    SET ate_here_count = ate_here_count + 1
    WHERE restaurant_id = NEW.restaurant_id;
  ELSIF NEW.reaction_type = 'love' THEN
    UPDATE public.restaurant_community_stats
    SET love_count = love_count + 1
    WHERE restaurant_id = NEW.restaurant_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.bump_restaurant_reservation_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.restaurant_community_stats (restaurant_id)
  VALUES (NEW.restaurant_id)
  ON CONFLICT (restaurant_id) DO NOTHING;

  UPDATE public.restaurant_community_stats
  SET reservation_vote_count = reservation_vote_count + 1
  WHERE restaurant_id = NEW.restaurant_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restaurant_reactions_bump_stats ON public.restaurant_reactions;
CREATE TRIGGER restaurant_reactions_bump_stats
  AFTER INSERT ON public.restaurant_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.bump_restaurant_reaction_count();

DROP TRIGGER IF EXISTS restaurant_reservation_votes_bump_stats ON public.restaurant_reservation_votes;
CREATE TRIGGER restaurant_reservation_votes_bump_stats
  AFTER INSERT ON public.restaurant_reservation_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.bump_restaurant_reservation_vote_count();

ALTER TABLE public.restaurant_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_reservation_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.address_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_community_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS restaurant_reactions_insert_anon ON public.restaurant_reactions;
CREATE POLICY restaurant_reactions_insert_anon
  ON public.restaurant_reactions
  FOR INSERT
  TO anon
  WITH CHECK (char_length(client_id) >= 8);

DROP POLICY IF EXISTS restaurant_reservation_votes_insert_anon ON public.restaurant_reservation_votes;
CREATE POLICY restaurant_reservation_votes_insert_anon
  ON public.restaurant_reservation_votes
  FOR INSERT
  TO anon
  WITH CHECK (char_length(client_id) >= 8);

DROP POLICY IF EXISTS address_suggestions_insert_anon ON public.address_suggestions;
CREATE POLICY address_suggestions_insert_anon
  ON public.address_suggestions
  FOR INSERT
  TO anon
  WITH CHECK (
    char_length(trim(restaurant_name)) >= 2
    AND char_length(trim(commune)) >= 2
  );

DROP POLICY IF EXISTS restaurant_community_stats_select_anon ON public.restaurant_community_stats;
CREATE POLICY restaurant_community_stats_select_anon
  ON public.restaurant_community_stats
  FOR SELECT
  TO anon
  USING (true);
