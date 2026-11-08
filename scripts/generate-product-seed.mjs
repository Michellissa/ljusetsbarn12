import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (ch !== '\r') {
      field += ch
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

const input = resolve('product-import.csv')
const output = resolve('supabase/seed-products.sql')
const rows = parseCsv(readFileSync(input, 'utf8'))
const [header, ...data] = rows
const column = Object.fromEntries(header.map((name, index) => [name.trim(), index]))

const escapeSql = (value) => `'${value.replace(/'/g, "''")}'`
const seenNames = new Set()
const statements = []

for (const row of data) {
  if (!row.some((value) => value.trim())) continue

  const get = (key) => (row[column[key]] ?? '').trim()
  const image = get('image_file')
  const name = get('name')
  const price = Number(get('price').replace(',', '.'))

  if (!image || !name || !Number.isFinite(price) || price <= 0) continue
  if (seenNames.has(name.toLowerCase())) continue

  seenNames.add(name.toLowerCase())

  const description = get('description')
  const stock = Number.parseInt(get('stock') || '0', 10)
  const category = get('category_slug')
  const featured = /^(true|1|ja|yes)$/i.test(get('featured'))
  const imagePath = `/images/ljusetsbarn/${image}`
  const categorySql = category
    ? `(SELECT id FROM categories WHERE slug = ${escapeSql(category)})`
    : 'NULL'

  statements.push(
    `  SELECT ${escapeSql(name)}, ${escapeSql(description)}, ${price}, ${Number.isFinite(stock) ? stock : 0}, ${featured}, ${categorySql}, ${escapeSql(imagePath)}, ARRAY[${escapeSql(imagePath)}]\n  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = ${escapeSql(name)})`
  )
}

if (statements.length === 0) {
  writeFileSync(output, '-- Inga giltiga produkter i product-import.csv\n')
  console.log('Inga giltiga produkter hittades. Fyll i namn och pris i product-import.csv.')
  process.exit(0)
}

const sql = `-- Genererad från product-import.csv\nINSERT INTO products (name, description, price, stock, featured, category_id, image_url, image_urls)\n${statements.join('\n  UNION ALL\n')}\n;\n`

writeFileSync(output, sql)
console.log(`Skrev ${statements.length} produkter till supabase/seed-products.sql`)
