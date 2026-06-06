import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type RestaurantImageAdminRow = {
  created_at: string
  restaurant_id: string
  image_url: string
  cover: boolean | null
  description: string | null
}

export type RestaurantOpeningSlotAdminRow = {
  id: string
  restaurant_id: string | null
  day: number | null
  open_time: string | null
  close_time: string | null
  sort_order: number | null
}

export type CuisineCatalogRow = {
  key: string
  description: string | null
}

export type RestaurantCuisineAdminRow = {
  created_at: string
  restaurant_id: string
  cuisine_key: string
  cuisines:
    | { key: string; description: string | null }
    | { key: string; description: string | null }[]
    | null
}

export type TarifCatalogRow = {
  key: string
  label: string | null
}

export type RestaurantTarifAdminRow = {
  restaurant_id: string
  tarif_key: string
  tarifs:
    | { key: string; label: string | null }
    | { key: string; label: string | null }[]
    | null
}

export type RestaurantDealAdminRow = {
  id: string
  restaurant_id: string | null
  title: string | null
  description: string | null
  validity_text: string | null
  is_active: boolean | null
  sort_order: number | null
}

export type RestaurantFeatureCatalogRow = {
  key: string
  label: string | null
  sort_order: number | null
  is_active: boolean | null
}

export type RestaurantFeatureLinkAdminRow = {
  restaurant_id: string
  feature_key: string | null
  restaurant_features:
    | { key: string; label: string | null }
    | { key: string; label: string | null }[]
    | null
}

export type RestaurantPhotoMenuAdminRow = {
  id: string
  created_at: string
  restaurant_id: string
  image_src: string
  caption: string | null
  sort_order: number | null
  published: boolean | null
}

export type RestaurantStatsEventAdminRow = {
  created_at: string
  event_type: 'page_view' | 'click'
  event_key: string
}

export type RestaurantStatsPeriodDays = 7 | 30

export type RestaurantStatsDayPoint = {
  date: string
  label: string
  pageViews: number
  clicks: number
}

export type RestaurantStatsSummaryAdmin = {
  periodDays: RestaurantStatsPeriodDays
  pageViews: number
  totalClicks: number
  clicksByKey: Array<{ key: string; count: number }>
  latestEventAt: string | null
  daily: RestaurantStatsDayPoint[]
}

export type RestaurantStatsByRestaurantAdmin = {
  restaurantId: string
  restaurantName: string
  pageViews: number
  totalClicks: number
}

export type RestaurantStatsOverviewAdmin = RestaurantStatsSummaryAdmin & {
  byRestaurant: RestaurantStatsByRestaurantAdmin[]
}

export type RestaurantStatsDetailAdmin = RestaurantStatsSummaryAdmin & {
  restaurantId: string
  restaurantName: string
}

export type RestaurantStatsPickerOption = {
  id: string
  name: string
  city: string
  commune: string | null
  pageViews: number
  totalClicks: number
}

const STATS_TIMEZONE = 'Europe/Brussels'

function dayKeyBrussels(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: STATS_TIMEZONE })
}

function dayLabelFr(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day, 12))
  return new Intl.DateTimeFormat('fr-BE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: STATS_TIMEZONE,
  }).format(date)
}

function buildDayKeys(days: RestaurantStatsPeriodDays): string[] {
  const keys: string[] = []
  const now = new Date()

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now)
    date.setDate(date.getDate() - offset)
    keys.push(dayKeyBrussels(date))
  }

  return keys
}

function emptyDailySeries(periodDays: RestaurantStatsPeriodDays): RestaurantStatsDayPoint[] {
  return buildDayKeys(periodDays).map((date) => ({
    date,
    label: dayLabelFr(date),
    pageViews: 0,
    clicks: 0,
  }))
}

function emptyRestaurantStatsSummary(
  periodDays: RestaurantStatsPeriodDays,
): RestaurantStatsSummaryAdmin {
  return {
    periodDays,
    pageViews: 0,
    totalClicks: 0,
    clicksByKey: [],
    latestEventAt: null,
    daily: emptyDailySeries(periodDays),
  }
}

function emptyRestaurantStatsOverview(
  periodDays: RestaurantStatsPeriodDays,
): RestaurantStatsOverviewAdmin {
  return {
    ...emptyRestaurantStatsSummary(periodDays),
    byRestaurant: [],
  }
}

type RestaurantStatsEventRow = RestaurantStatsEventAdminRow & {
  restaurant_id?: string
}

function buildStatsSummaryFromRows(
  rows: RestaurantStatsEventRow[],
  periodDays: RestaurantStatsPeriodDays,
): Omit<RestaurantStatsSummaryAdmin, 'periodDays'> & {
  byRestaurantMap: Map<string, { pageViews: number; clicks: number }>
} {
  const dayKeys = buildDayKeys(periodDays)
  const dayKeySet = new Set(dayKeys)
  const inPeriod = rows.filter((row) => dayKeySet.has(dayKeyBrussels(new Date(row.created_at))))

  const clickRows = inPeriod.filter((row) => row.event_type === 'click')
  const clicksMap = new Map<string, number>()
  const dailyMap = new Map(
    dayKeys.map((date) => [date, { date, label: dayLabelFr(date), pageViews: 0, clicks: 0 }]),
  )
  const byRestaurantMap = new Map<string, { pageViews: number; clicks: number }>()

  for (const row of inPeriod) {
    const key = dayKeyBrussels(new Date(row.created_at))
    const point = dailyMap.get(key)
    if (point) {
      if (row.event_type === 'page_view') {
        point.pageViews += 1
      } else {
        point.clicks += 1
      }
    }

    if (row.restaurant_id) {
      const restaurantStats = byRestaurantMap.get(row.restaurant_id) ?? {
        pageViews: 0,
        clicks: 0,
      }
      if (row.event_type === 'page_view') {
        restaurantStats.pageViews += 1
      } else {
        restaurantStats.clicks += 1
      }
      byRestaurantMap.set(row.restaurant_id, restaurantStats)
    }
  }

  for (const row of clickRows) {
    clicksMap.set(row.event_key, (clicksMap.get(row.event_key) ?? 0) + 1)
  }

  const clicksByKey = [...clicksMap.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)

  return {
    pageViews: inPeriod.filter((row) => row.event_type === 'page_view').length,
    totalClicks: clickRows.length,
    clicksByKey,
    latestEventAt: inPeriod[0]?.created_at ?? null,
    daily: dayKeys.map((date) => dailyMap.get(date)!),
    byRestaurantMap,
  }
}

function periodStartIso(days: RestaurantStatsPeriodDays): string {
  const start = new Date()
  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  return start.toISOString()
}

export async function fetchRestaurantImagesAdmin(
  restaurantId: string,
): Promise<RestaurantImageAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_images')
    .select('created_at, restaurant_id, image_url, cover, description')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[restaurant-images-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantImageAdminRow[]
}

export async function fetchRestaurantOpeningSlotsAdmin(
  restaurantId: string,
): Promise<RestaurantOpeningSlotAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_opening_slots')
    .select('id, restaurant_id, day, open_time, close_time, sort_order')
    .eq('restaurant_id', restaurantId)
    .order('day', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurant-opening-slots-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantOpeningSlotAdminRow[]
}

export async function fetchCuisinesCatalog(): Promise<CuisineCatalogRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin.from('cuisines').select('key, description').order('key')

  if (error) {
    console.error('[cuisines-catalog]', error.message)
    return []
  }

  return (data ?? []) as CuisineCatalogRow[]
}

export async function fetchTarifsCatalog(): Promise<TarifCatalogRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin.from('tarifs').select('key, label').order('key')

  if (error) {
    console.error('[tarifs-catalog]', error.message)
    return []
  }

  return (data ?? []) as TarifCatalogRow[]
}

export async function fetchRestaurantTarifsAdmin(
  restaurantId: string,
): Promise<RestaurantTarifAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurants_tarifs')
    .select('restaurant_id, tarif_key, tarifs ( key, label )')
    .eq('restaurant_id', restaurantId)
    .order('tarif_key')

  if (error) {
    console.error('[restaurants-tarifs-admin]', error.message)
    return []
  }

  return (data ?? []) as unknown as RestaurantTarifAdminRow[]
}

export async function fetchRestaurantCuisinesAdmin(
  restaurantId: string,
): Promise<RestaurantCuisineAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_cuisines')
    .select('created_at, restaurant_id, cuisine_key, cuisines ( key, description )')
    .eq('restaurant_id', restaurantId)
    .order('cuisine_key')

  if (error) {
    console.error('[restaurant-cuisines-admin]', error.message)
    return []
  }

  return (data ?? []) as unknown as RestaurantCuisineAdminRow[]
}

export async function fetchRestaurantDealsAdmin(
  restaurantId: string,
): Promise<RestaurantDealAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_deals')
    .select('id, restaurant_id, title, description, validity_text, is_active, sort_order')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurant-deals-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantDealAdminRow[]
}

export async function fetchRestaurantFeaturesCatalog(): Promise<RestaurantFeatureCatalogRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_features')
    .select('key, label, sort_order, is_active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[restaurant-features-catalog]', error.message)
    return []
  }

  const rows = (data ?? []) as RestaurantFeatureCatalogRow[]
  return rows.filter((r) => r.is_active !== false)
}

export async function fetchRestaurantFeatureLinksAdmin(
  restaurantId: string,
): Promise<RestaurantFeatureLinkAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_feature_links')
    .select('restaurant_id, feature_key, restaurant_features ( key, label )')
    .eq('restaurant_id', restaurantId)

  if (error) {
    console.error('[restaurant-feature-links-admin]', error.message)
    return []
  }

  return (data ?? []) as unknown as RestaurantFeatureLinkAdminRow[]
}

export async function fetchRestaurantPhotosMenuAdmin(
  restaurantId: string,
): Promise<RestaurantPhotoMenuAdminRow[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurant_photos_menu')
    .select('id, created_at, restaurant_id, image_src, caption, sort_order, published')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[restaurant-photos-menu-admin]', error.message)
    return []
  }

  return (data ?? []) as RestaurantPhotoMenuAdminRow[]
}

export async function fetchRestaurantStatsOverviewAdmin(
  periodDays: RestaurantStatsPeriodDays = 7,
): Promise<RestaurantStatsOverviewAdmin> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return emptyRestaurantStatsOverview(periodDays)
  }

  const { data, error } = await admin
    .from('restaurant_stats_events')
    .select('created_at, event_type, event_key, restaurant_id')
    .gte('created_at', periodStartIso(periodDays))
    .order('created_at', { ascending: false })
    .limit(50000)

  if (error) {
    console.error('[restaurant-stats-admin]', error.message)
    return emptyRestaurantStatsOverview(periodDays)
  }

  const rows = (data ?? []) as RestaurantStatsEventRow[]
  const aggregated = buildStatsSummaryFromRows(rows, periodDays)

  const restaurantIds = [...aggregated.byRestaurantMap.keys()]
  const nameById = new Map<string, string>()

  if (restaurantIds.length) {
    const { data: restaurants, error: restaurantsError } = await admin
      .from('restaurants')
      .select('id, name')
      .in('id', restaurantIds)

    if (restaurantsError) {
      console.error('[restaurant-stats-admin-names]', restaurantsError.message)
    } else {
      for (const restaurant of restaurants ?? []) {
        nameById.set(restaurant.id, restaurant.name)
      }
    }
  }

  const byRestaurant = [...aggregated.byRestaurantMap.entries()]
    .map(([restaurantId, counts]) => ({
      restaurantId,
      restaurantName: nameById.get(restaurantId) ?? 'Restaurant inconnu',
      pageViews: counts.pageViews,
      totalClicks: counts.clicks,
    }))
    .sort((a, b) => b.pageViews - a.pageViews || b.totalClicks - a.totalClicks)

  const { byRestaurantMap, ...summary } = aggregated

  return {
    periodDays,
    ...summary,
    byRestaurant,
  }
}

export async function fetchRestaurantStatsSummaryAdmin(
  restaurantId: string,
  periodDays: RestaurantStatsPeriodDays = 7,
): Promise<RestaurantStatsDetailAdmin | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const [{ data, error }, restaurantResult] = await Promise.all([
    admin
      .from('restaurant_stats_events')
      .select('created_at, event_type, event_key, restaurant_id')
      .eq('restaurant_id', restaurantId)
      .gte('created_at', periodStartIso(periodDays))
      .order('created_at', { ascending: false })
      .limit(10000),
    admin.from('restaurants').select('name').eq('id', restaurantId).maybeSingle(),
  ])

  if (error) {
    console.error('[restaurant-stats-admin-detail]', error.message)
    return null
  }

  if (restaurantResult.error) {
    console.error('[restaurant-stats-admin-detail-name]', restaurantResult.error.message)
    return null
  }

  if (!restaurantResult.data) return null

  const rows = (data ?? []) as RestaurantStatsEventRow[]
  const { byRestaurantMap: _ignored, ...summary } = buildStatsSummaryFromRows(rows, periodDays)

  return {
    periodDays,
    restaurantId,
    restaurantName: restaurantResult.data.name,
    ...summary,
  }
}

export async function fetchRestaurantsForStatsPickerAdmin(): Promise<
  Omit<RestaurantStatsPickerOption, 'pageViews' | 'totalClicks'>[]
> {
  const admin = getSupabaseAdmin()
  if (!admin) return []

  const { data, error } = await admin
    .from('restaurants')
    .select('id, name, city, commune')
    .order('name', { ascending: true })

  if (error) {
    console.error('[restaurant-stats-picker]', error.message)
    return []
  }

  return (data ?? []) as Omit<RestaurantStatsPickerOption, 'pageViews' | 'totalClicks'>[]
}
