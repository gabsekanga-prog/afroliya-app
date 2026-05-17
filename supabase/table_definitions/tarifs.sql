CREATE TABLE public.tarifs (
  key text NOT NULL,
  label text,
  CONSTRAINT tarifs_pkey PRIMARY KEY (key),
  CONSTRAINT tarifs_key_key UNIQUE (key)
) TABLESPACE pg_default;
