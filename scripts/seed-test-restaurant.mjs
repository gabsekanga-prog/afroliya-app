/**
 * Insère ou met à jour le restaurant test (upsert Supabase).
 * Usage : node scripts/seed-test-restaurant.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const RESTAURANT_ID = 'f4e8c2a1-9b3d-4f6e-a8c1-2d5e7f901234'

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local')
  const content = readFileSync(path, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) process.env[match[1].trim()] = match[2].trim()
  }
}

loadEnvLocal()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const restaurant = {
  id: RESTAURANT_ID,
  name: 'Restaurant Test Afroliya',
  slug: 'restaurant-test-afroliya',
  city: 'Bruxelles',
  commune: 'Ixelles',
  postal_code: '1050',
  country_code: 'BE',
  address: 'Rue de Test 1',
  description:
    'Restaurant fictif pour tester les réservations en ligne, les e-mails et les SMS.',
  bookable: true,
  sponsored: true,
  active: true,
  booking_url: null,
  phone: '+32456880787',
  email: 'gabsekanga@gmail.com',
  whatsapp_phone: '+32456880787',
}

const openingSlots = [
  { day: 1, open_time: '12:00', close_time: '14:00', sort_order: 0 },
  { day: 1, open_time: '18:00', close_time: '22:00', sort_order: 1 },
  { day: 2, open_time: '12:00', close_time: '14:00', sort_order: 0 },
  { day: 2, open_time: '18:00', close_time: '22:00', sort_order: 1 },
  { day: 3, open_time: '12:00', close_time: '14:00', sort_order: 0 },
  { day: 3, open_time: '18:00', close_time: '22:00', sort_order: 1 },
  { day: 4, open_time: '12:00', close_time: '14:00', sort_order: 0 },
  { day: 4, open_time: '18:00', close_time: '22:00', sort_order: 1 },
  { day: 5, open_time: '12:00', close_time: '14:00', sort_order: 0 },
  { day: 5, open_time: '18:00', close_time: '02:00', sort_order: 1 },
  { day: 6, open_time: '18:00', close_time: '23:00', sort_order: 0 },
]

const { error: upsertError } = await admin.from('restaurants').upsert(restaurant, { onConflict: 'id' })
if (upsertError) {
  console.error('Erreur restaurant:', upsertError.message)
  process.exit(1)
}

const { error: deleteError } = await admin
  .from('restaurant_opening_slots')
  .delete()
  .eq('restaurant_id', RESTAURANT_ID)

if (deleteError) {
  console.error('Erreur suppression horaires:', deleteError.message)
  process.exit(1)
}

const { error: slotsError } = await admin.from('restaurant_opening_slots').insert(
  openingSlots.map((slot) => ({
    id: randomUUID(),
    restaurant_id: RESTAURANT_ID,
    ...slot,
  })),
)

if (slotsError) {
  console.error('Erreur horaires:', slotsError.message)
  process.exit(1)
}

console.log('Restaurant test prêt : /restaurants/restaurant-test-afroliya')
console.log('E-mail resto : gabsekanga@gmail.com')
console.log('Téléphone / WhatsApp : +32 456 88 07 87')
