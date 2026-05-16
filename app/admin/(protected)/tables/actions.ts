'use server'

import { revalidatePath } from 'next/cache'

import { getAdminTableConfig } from '@/lib/admin-table-config'
import {
  applyKeyFilters,
} from '@/lib/admin-table-data'
import { requireAdmin } from '@/lib/admin-session'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

type ActionState = { error?: string; ok?: boolean }

function parseRowKeyFromFormData(
  formData: FormData,
  keyColumns: string[],
): Record<string, string> | null {
  const key: Record<string, string> = {}
  for (const col of keyColumns) {
    const raw = formData.get(`key:${col}`)
    if (raw === null || raw === undefined) return null
    const value = String(raw)
    if (!value) return null
    key[col] = value
  }
  return key
}

function coerceValue(raw: string): unknown {
  const value = raw.trim()
  if (value === '') return undefined
  if (value === 'null') return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  if (
    (value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']'))
  ) {
    try {
      return JSON.parse(value)
    } catch {
      return raw
    }
  }
  return raw
}

function parseFieldPayload(formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const [key, val] of formData.entries()) {
    if (!key.startsWith('field:')) continue
    const column = key.slice('field:'.length)
    if (!column) continue
    const coerced = coerceValue(String(val ?? ''))
    if (coerced !== undefined) {
      payload[column] = coerced
    }
  }
  return payload
}

export async function createTableRowAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const table = String(formData.get('table') ?? '').trim()
  const config = getAdminTableConfig(table)
  if (!config) return { error: 'Table non autorisée' }

  const fieldPayload = parseFieldPayload(formData)
  if (Object.keys(fieldPayload).length === 0) return { error: 'Aucune donnée à insérer' }
  const payload = fieldPayload

  const { error } = await admin.from(config.name).insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/admin/tables')
  revalidatePath(`/admin/tables/${config.name}`)
  return { ok: true }
}

export async function updateTableRowAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) return { error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }

  const table = String(formData.get('table') ?? '').trim()
  const config = getAdminTableConfig(table)
  if (!config) return { error: 'Table non autorisée' }

  const key = parseRowKeyFromFormData(formData, config.primaryKey)
  if (!key) return { error: 'Clé de ligne invalide' }

  const payload = parseFieldPayload(formData)

  for (const keyCol of config.primaryKey) {
    delete payload[keyCol]
  }
  if (Object.keys(payload).length === 0) return { error: 'Aucune modification à enregistrer' }

  const query = applyKeyFilters(admin.from(config.name).update(payload), key, config)
  const { error } = await query
  if (error) return { error: error.message }

  revalidatePath('/admin/tables')
  revalidatePath(`/admin/tables/${config.name}`)
  return { ok: true }
}

export async function deleteTableRowAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const admin = getSupabaseAdmin()
  if (!admin) throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant')

  const table = String(formData.get('table') ?? '').trim()
  const config = getAdminTableConfig(table)
  if (!config) throw new Error('Table non autorisée')

  const key = parseRowKeyFromFormData(formData, config.primaryKey)
  if (!key) throw new Error('Clé de ligne invalide')

  const query = applyKeyFilters(admin.from(config.name).delete(), key, config)
  const { error } = await query
  if (error) throw new Error(error.message)

  revalidatePath('/admin/tables')
  revalidatePath(`/admin/tables/${config.name}`)
}
