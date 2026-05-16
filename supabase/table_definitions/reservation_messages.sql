CREATE TABLE public.reservation_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reservation_id uuid NOT NULL,
  sender_type USER-DEFINED NOT NULL,
  message text NOT NULL CHECK (length(message) <= 500),
  CONSTRAINT reservation_messages_pkey PRIMARY KEY (id),
  CONSTRAINT reservation_messages_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id)
);
