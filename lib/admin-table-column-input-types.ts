import fs from 'node:fs'
import path from 'node:path'

export type ColumnInputKind =
  | 'boolean'
  | 'number'
  | 'json'
  | 'date'
  | 'time'
  | 'datetime'
  | 'text'

type TableColumns = Record<string, ColumnInputKind>
type ColumnsByTable = Record<string, TableColumns>

let cachedColumnsByTable: ColumnsByTable | null = null

function kindFromPostgresType(typeStr: string): ColumnInputKind {
  const s = typeStr.toLowerCase()

  if (s.includes('boolean')) return 'boolean'
  if (s.includes('jsonb')) return 'json'

  if (
    s.includes('double precision') ||
    /\b(bigint|integer|smallint|numeric)\b/.test(s)
  ) {
    return 'number'
  }

  if (s.includes('timestamp with time zone') || s.includes('timestamp')) {
    return 'datetime'
  }

  if (s.includes('date')) return 'date'

  if (s.includes('time without time zone') || s.includes('time')) return 'time'

  return 'text'
}

function parseTableDefinition(definition: string): ColumnsByTable {
  const byTable: ColumnsByTable = {}

  const createTableRe =
    /create\s+table\s+public\.([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*(?:tablespace\s+\w+)?\s*;/gi

  for (;;) {
    const match = createTableRe.exec(definition)
    if (!match) break

    const tableName = match[1]
    const body = match[2]
    const columns: TableColumns = {}

    for (const rawLine of body.split('\n')) {
      const line = rawLine.trim()
      if (!line) continue
      if (line.toLowerCase().startsWith('constraint ')) continue
      if (line === ');') continue

      const lineNoComma = line.endsWith(',') ? line.slice(0, -1).trim() : line
      const colNameMatch = /^([a-zA-Z_][a-zA-Z0-9_]*)\s+(.+)$/.exec(lineNoComma)
      if (!colNameMatch) continue

      const colName = colNameMatch[1]
      const remainder = colNameMatch[2]
      columns[colName] = kindFromPostgresType(remainder)
    }

    byTable[tableName] = columns
  }

  return byTable
}

function loadTableDefinitions(): ColumnsByTable {
  const dir = path.join(process.cwd(), 'supabase', 'table_definitions')
  if (!fs.existsSync(dir)) return {}

  const merged: ColumnsByTable = {}
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.sql')) continue
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const parsed = parseTableDefinition(raw)
    for (const [table, cols] of Object.entries(parsed)) {
      merged[table] = { ...merged[table], ...cols }
    }
  }
  return merged
}

function getColumnsByTableCached(): ColumnsByTable {
  if (cachedColumnsByTable) return cachedColumnsByTable
  cachedColumnsByTable = loadTableDefinitions()
  return cachedColumnsByTable
}

export function getAdminTableColumnInputKinds(
  tableName: string,
): Record<string, ColumnInputKind> {
  const byTable = getColumnsByTableCached()
  return byTable[tableName] ?? {}
}
