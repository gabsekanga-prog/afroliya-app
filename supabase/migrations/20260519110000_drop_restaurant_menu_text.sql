-- Suppression du menu texte structuré (sections / plats en accordéon).
DROP POLICY IF EXISTS restaurant_menu_items_select_anon ON public.restaurant_menu_items;
DROP POLICY IF EXISTS restaurant_menu_sections_select_anon ON public.restaurant_menu_sections;

DROP TABLE IF EXISTS public.restaurant_menu_items;
DROP TABLE IF EXISTS public.restaurant_menu_sections;
