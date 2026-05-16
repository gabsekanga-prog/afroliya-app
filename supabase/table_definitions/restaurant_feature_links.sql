CREATE TABLE public.restaurant_feature_links (
  restaurant_id uuid NOT NULL,
  feature_key text,
  CONSTRAINT restaurant_feature_links_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
  CONSTRAINT restaurant_feature_links_feature_key_fkey FOREIGN KEY (feature_key) REFERENCES public.restaurant_features(key)
);
