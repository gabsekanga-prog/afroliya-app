import {
  formatMenuDisplayText,
  formatMenuDisplayTextRequired,
  formatMenuPrice,
} from '@/lib/format-menu-text'

export type MenuCsvRow = {
  category: string
  name: string
  description: string | null
  price: string | null
}

export type ParseMenuCsvResult =
  | { ok: true; rows: MenuCsvRow[] }
  | { ok: false; error: string }

const HEADER_ALIASES: Record<string, keyof Omit<MenuCsvRow, 'name'> | 'name'> = {
  category: 'category',
  section: 'category',
  categorie: 'category',
  catégorie: 'category',
  name: 'name',
  nom: 'name',
  plat: 'name',
  description: 'description',
  desc: 'description',
  price: 'price',
  prix: 'price',
}

function normalizeHeader(cell: string): string {
  return cell
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function detectDelimiter(headerLine: string): ',' | ';' {
  const semicolons = (headerLine.match(/;/g) ?? []).length
  const commas = (headerLine.match(/,/g) ?? []).length
  return semicolons > commas ? ';' : ','
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (char === delimiter && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += char
  }

  cells.push(current.trim())
  return cells
}

function unquote(value: string): string {
  const trimmed = value.trim()
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/""/g, '"').trim()
  }
  return trimmed
}

export function parseMenuCsv(rawText: string): ParseMenuCsvResult {
  const text = rawText.replace(/^\uFEFF/, '').trim()
  if (!text) {
    return { ok: false, error: 'Le fichier CSV est vide.' }
  }

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (lines.length < 2) {
    return {
      ok: false,
      error: 'Le CSV doit contenir une ligne d’en-tête et au moins une ligne de plat.',
    }
  }

  const delimiter = detectDelimiter(lines[0]!)
  const headerCells = parseCsvLine(lines[0]!, delimiter).map(unquote)
  const columnIndex: Partial<Record<keyof MenuCsvRow, number>> = {}

  headerCells.forEach((cell, index) => {
    const key = HEADER_ALIASES[normalizeHeader(cell)]
    if (key && columnIndex[key] === undefined) {
      columnIndex[key] = index
    }
  })

  if (columnIndex.category === undefined || columnIndex.name === undefined) {
    return {
      ok: false,
      error:
        'En-têtes requis : category (ou section) et name (ou nom). Colonnes optionnelles : description, price.',
    }
  }

  const rows: MenuCsvRow[] = []

  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    const cells = parseCsvLine(lines[lineIndex]!, delimiter).map(unquote)
    const read = (field: keyof MenuCsvRow) => {
      const index = columnIndex[field]
      if (index === undefined) return ''
      return cells[index] ?? ''
    }

    const category = read('category')
    const name = read('name')
    if (!category && !name) continue

    if (!category) {
      return {
        ok: false,
        error: `Ligne ${lineIndex + 1} : la catégorie est obligatoire.`,
      }
    }
    if (!name) {
      return {
        ok: false,
        error: `Ligne ${lineIndex + 1} : le nom du plat est obligatoire.`,
      }
    }

    const description = read('description').trim()
    const price = read('price').trim()

    rows.push({
      category: formatMenuDisplayTextRequired(category),
      name: formatMenuDisplayTextRequired(name),
      description: formatMenuDisplayText(description || null),
      price: formatMenuPrice(price || null),
    })
  }

  if (rows.length === 0) {
    return { ok: false, error: 'Aucune ligne de plat valide trouvée dans le CSV.' }
  }

  return { ok: true, rows }
}
