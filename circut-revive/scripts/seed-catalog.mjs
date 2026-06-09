/**
 * Upload the local seed catalog to Supabase.
 *
 * Usage:
 *   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/seed-catalog.mjs
 *
 * Requires an admin session — sign in via the app first, then use the service role
 * key for seeding, OR use the Admin panel "Upload seed catalog" button.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  try {
    const envFile = readFileSync(join(root, '.env'), 'utf8')
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      if (!process.env[key]) process.env[key] = rest.join('=').trim()
    }
  } catch {
    // .env optional when vars are already exported
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const { seedProducts } = await import(join(root, 'src/data/products.js'))

const supabase = createClient(url, key)

function toRow(product) {
  return {
    id: product.id,
    name: product.name,
    era: product.era,
    category: product.category,
    base_price: product.basePrice,
    description: product.description,
    condition: product.condition,
    condition_grade: product.conditionGrade,
    image_url: product.imageUrl,
    customization_options: product.customizationOptions,
    stock_count: product.stockCount ?? 0,
    active: true,
  }
}

console.log(`Seeding ${seedProducts.length} products…`)

for (const product of seedProducts) {
  const { error } = await supabase.from('products').upsert(toRow(product))
  if (error) {
    console.error(`Failed: ${product.id}`, error.message)
    process.exit(1)
  }
  console.log(`  ✓ ${product.id}`)
}

console.log('Done.')
