-- Restaurant fictif pour tests de réservation (widget interne, e-mail, SMS).
-- URL publique : /restaurants/restaurant-test-afroliya

INSERT INTO public.restaurants (
  id,
  name,
  slug,
  city,
  commune,
  postal_code,
  country_code,
  address,
  description,
  bookable,
  sponsored,
  active,
  booking_url,
  phone,
  email,
  whatsapp_phone
)
VALUES (
  'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234',
  'Restaurant Test Afroliya',
  'restaurant-test-afroliya',
  'Bruxelles',
  'Ixelles',
  '1050',
  'BE',
  'Rue de Test 1',
  'Restaurant fictif pour tester les réservations en ligne, les e-mails et les SMS.',
  true,
  true,
  true,
  null,
  '+32456880787',
  'gabsekanga@gmail.com',
  '+32456880787'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  city = EXCLUDED.city,
  commune = EXCLUDED.commune,
  postal_code = EXCLUDED.postal_code,
  country_code = EXCLUDED.country_code,
  address = EXCLUDED.address,
  description = EXCLUDED.description,
  bookable = EXCLUDED.bookable,
  sponsored = EXCLUDED.sponsored,
  active = EXCLUDED.active,
  booking_url = EXCLUDED.booking_url,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  whatsapp_phone = EXCLUDED.whatsapp_phone;

DELETE FROM public.restaurant_opening_slots
WHERE restaurant_id = 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234';

INSERT INTO public.restaurant_opening_slots (id, restaurant_id, day, open_time, close_time, sort_order)
VALUES
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 1, '12:00', '14:00', 0),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 1, '18:00', '22:00', 1),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 2, '12:00', '14:00', 0),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 2, '18:00', '22:00', 1),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 3, '12:00', '14:00', 0),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 3, '18:00', '22:00', 1),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 4, '12:00', '14:00', 0),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 4, '18:00', '22:00', 1),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 5, '12:00', '14:00', 0),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 5, '18:00', '02:00', 1),
  (gen_random_uuid(), 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234', 6, '18:00', '23:00', 0);
