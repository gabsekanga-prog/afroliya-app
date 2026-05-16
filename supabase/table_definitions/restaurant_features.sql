CREATE TABLE public.restaurant_features (
  key text UNIQUE,
  label text,
  sort_order bigint,
  is_active boolean,
  id uuid NOT NULL,
  CONSTRAINT restaurant_features_pkey PRIMARY KEY (id)
);
