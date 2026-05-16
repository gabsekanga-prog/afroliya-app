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

function parseDatabaseDefinition(definition: string): ColumnsByTable {
  const byTable: ColumnsByTable = {}

  // Example in file: CREATE TABLE public.restaurants ( ... );
  const createTableRe =
    /CREATE TABLE public\.([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\);\s*/g

  for (;;) {
    const match = createTableRe.exec(definition)
    if (!match) break

    const tableName = match[1]
    const body = match[2]
    const columns: TableColumns = {}

    for (const rawLine of body.split('\n')) {
      const line = rawLine.trim()
      if (!line) continue
      if (line.startsWith('CONSTRAINT ')) continue

      // Skip closing paren just in case.
      if (line === ');') continue

      // Column definitions like: "id uuid NOT NULL DEFAULT gen_random_uuid(),"
      const lineNoComma = line.endsWith(',')
        ? line.slice(0, -1).trim()
        : line
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

function getColumnsByTableCached(): ColumnsByTable {
  if (cachedColumnsByTable) return cachedColumnsByTable

  const definitionPath = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    'database_definition',
  )

  const raw = fs.readFileSync(definitionPath, 'utf8')
  cachedColumnsByTable = parseDatabaseDefinition(raw)
  return cachedColumnsByTable
}

export function getAdminTableColumnInputKinds(
  tableName: string,
): Record<string, ColumnInputKind> {
  const byTable = getColumnsByTableCached()
  return byTable[tableName] ?? {}
}

