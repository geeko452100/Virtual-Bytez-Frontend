# Circut Revive

A full-stack vintage tech storefront with **user-customizable product options**, powered by **React + Vite** on the frontend and **Supabase** on the backend.

Browse restored classics — Commodore 64, Macintosh SE, Walkman, Game Boy, Model M — configure finishes, mods, and extras with live pricing, save builds, and place orders.

## Features

| Area | What's included |
|------|-----------------|
| **Shop** | Category filters, product images, condition grades (1–10), stock status |
| **Customization** | Select, checkbox, and text (engraving) options with live price updates |
| **Cart & checkout** | Persistent cart UI, Supabase order creation with line items |
| **Auth** | Email/password sign-up and sign-in via Supabase Auth |
| **Saved builds** | Logged-in users save and reload custom configurations |
| **Admin** | Manage catalog, stock, and order statuses (admin role required) |
| **Routing** | Shareable URLs — `/shop`, `/shop/c64`, `/checkout`, `/account`, `/admin` |

Without Supabase credentials the app falls back to the local seed catalog; auth, checkout, and saved builds require a configured backend.

## Quick start

### 1. Install and run the frontend

```bash
cd circut-revive
npm install
cp .env.example .env   # then fill in your Supabase values
npm run dev
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the migration:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. In **Project Settings → API**, copy the **Project URL** and **anon public** key into `.env`:

   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

4. Seed the product catalog (pick one):
   - **Admin UI:** sign up, promote yourself to admin (step 5), open `/admin` → **Upload seed catalog**
   - **CLI:** `npm run seed` (uses `SUPABASE_SERVICE_ROLE_KEY` from `.env` if set)

5. **Promote your account to admin** (SQL Editor):

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'you@example.com';
   ```

6. Enable **Email** auth under **Authentication → Providers** (enabled by default).

Restart `npm run dev` after changing `.env`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run seed` | Upload local catalog to Supabase |

## Project structure

```
circut-revive/
├── supabase/migrations/     # Database schema + RLS policies
├── scripts/seed-catalog.mjs # CLI seed helper
├── src/
│   ├── api/                 # Supabase queries (products, orders, saved builds)
│   ├── context/             # Auth, products, cart providers
│   ├── hooks/
│   ├── lib/                 # Supabase client, config, mappers
│   ├── data/products.js     # Local seed catalog (offline fallback)
│   ├── components/
│   └── pages/
└── .env.example
```

## Database schema

| Table | Purpose |
|-------|---------|
| `profiles` | User metadata + `customer` / `admin` role |
| `products` | Catalog, customization JSON, images, stock, condition grade |
| `saved_builds` | User-named configuration snapshots |
| `orders` | Checkout records with shipping address |
| `order_items` | Line items with selections and pricing |

Row Level Security is enabled on all tables. Products are publicly readable when `active = true`; admins have full catalog access.

## Customization model

Each product stores a `customization_options` JSON array:

| Type | Purpose |
|------|---------|
| `select` | Single choice (finish, RAM tier, etc.) |
| `checkbox` | Multiple add-ons |
| `text` | Optional engraving — charged when non-empty |

Each choice may include `priceModifier` (USD). Logic lives in `src/utils/pricing.js`.

## Checkout flow

1. User signs in and adds customized items to the cart.
2. `/checkout` collects a shipping address.
3. An `orders` row and related `order_items` are inserted via Supabase.
4. Order status starts as `pending` — admins update status in `/admin`.

Payment gateway integration (e.g. Stripe via Supabase Edge Functions) can be added later; orders are persisted regardless.

## Admin panel

At `/admin` (admin role only):

- Create, edit, and delete products
- Edit customization options as JSON
- Upload the seed catalog in one click
- View all orders and update status

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | For backend features | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | For backend features | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | For `npm run seed` only — never expose in frontend |

## Next steps

- Stripe checkout via Supabase Edge Function + webhook to set `orders.status = 'paid'`
- Upload product photos to the `product-images` storage bucket
- Email notifications on new orders (Supabase triggers + Resend/SendGrid)
- Load saved build selections from URL query params

## License

Private project — see repository owner for terms.
