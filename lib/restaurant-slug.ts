import { slugify } from '@/lib/slug'
import type { getSupabaseAdmin } from '@/lib/supabase-admin'

type AdminClient = NonNullable<ReturnType<typeof getSupabaseAdmin>>

export function restaurantSlugFromName(name: string): string {
  return slugify(name.trim() || 'restaurant')
}

export async function ensureUniqueRestaurantSlug(
  admin: AdminClient,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  const normalized = slugify(baseSlug)
  let candidate = normalized
  let suffix = 2

  while (true) {
    let query = admin.from('restaurants').select('id').eq('slug', candidate).limit(1)
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.maybeSingle()
    if (error && !error.message.toLowerCase().includes('slug')) {
      return normalized
    }
    if (!data) return candidate

    candidate = `${normalized}-${suffix}`
    suffix += 1
  }
}

export async function resolveRestaurantSlug(
  admin: AdminClient,
  rawSlug: string,
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(rawSlug.trim()) || restaurantSlugFromName(name)
  return ensureUniqueRestaurantSlug(admin, base, excludeId)
}
