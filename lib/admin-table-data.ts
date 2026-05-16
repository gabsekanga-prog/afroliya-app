import type { AdminTableConfig } from '@/lib/admin-table-config'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type JsonRecord = Record<string, unknown>
export type RowKey = Record<string, string>

type QueryBuilder = {
  eq: (column: string, value: string) => QueryBuilder
}

export function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseRowKey(raw: string): RowKey | null {
  try {
    const parsed = JSON.parse(raw)
    if (!isJsonRecord(parsed)) return null
    const key: RowKey = {}
    for (const [name, val] of Object.entries(parsed)) {
      if (val === null || val === undefined) return null
      key[name] = String(val)
    }
    return key
  } catch {
    return null
  }
}

export function applyKeyFilters<T extends QueryBuilder>(
  query: T,
  key: RowKey,
  config: AdminTableConfig,
): T {
  let next: QueryBuilder = query
  for (const col of config.primaryKey) {
    if (!(col in key)) {
      throw new Error(`Clé ${col} manquante`)
    }
    next = next.eq(col, key[col])
  }
  return next as T
}

export function buildRowKey(
  row: JsonRecord,
  config: AdminTableConfig,
): RowKey | null {
  const key: RowKey = {}
  for (const col of config.primaryKey) {
    const value = row[col]
    if (value === null || value === undefined) return null
    key[col] = String(value)
  }
  return key
}

export async function fetchAdminTableRows(
  config: AdminTableConfig,
  limit = 200,
): Promise<{ rows: JsonRecord[]; error: string | null }> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { rows: [], error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }
  }

  let query = admin.from(config.name).select('*').limit(limit)
  if (config.defaultOrder) {
    query = query.order(config.defaultOrder, { ascending: false })
  }

  const { data, error } = await query
  if (error) {
    return { rows: [], error: error.message }
  }

  return { rows: ((data ?? []) as JsonRecord[]) ?? [], error: null }
}

export async function fetchAdminTableColumns(
  config: AdminTableConfig,
): Promise<{ columns: string[]; error: string | null }> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { columns: [], error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }
  }

  const { data, error } = await admin
    .schema('information_schema')
    .from('columns')
    .select('column_name, ordinal_position')
    .eq('table_schema', 'public')
    .eq('table_name', config.name)
    .order('ordinal_position', { ascending: true })

  if (error) {
    return { columns: [], error: error.message }
  }

  const columns = (data ?? [])
    .map((row) => row.column_name)
    .filter((value): value is string => typeof value === 'string' && value.length > 0)

  return { columns, error: null }
}
