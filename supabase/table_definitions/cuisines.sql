CREATE TABLE public.cuisines (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  key text NOT NULL,
  description text,
  CONSTRAINT cuisines_pkey PRIMARY KEY (key)
);
