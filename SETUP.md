# Dreams Happen — Local Setup & Deploy Guide

A Next.js 16 storefront with a Prisma/Postgres backend, an `/admin` CMS, Stripe
checkout (with a simulated fallback), and Resend email (with a console
fallback). This guide takes you from a fresh machine to a running local site,
then to a live Vercel deployment.

---

## 1. Prerequisites

Install these first:

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | 20 LTS or 22 | `node --version`. Next 16 needs ≥ 20.9. |
| **npm** | bundled with Node | |
| **Git** | any recent | |
| **PostgreSQL** | 16 | Local server, Docker, or [Postgres.app](https://postgresapp.com). |

Optional (only when you need them):
- **Vercel CLI** — `npm i -g vercel` (for deploying)
- **Stripe CLI** — for live payments / webhook testing

---

## 2. Clone & install

```bash
git clone https://github.com/benjaminroe/dreamshappen.git
cd dreamshappen
git checkout claude/dreamshappenltd-stripe-cms-PVgIS   # the active branch
npm install
```

`npm install` runs `prisma generate` automatically (via `postinstall`).

---

## 3. Start a local Postgres

Pick **one** option.

**Docker (simplest):**
```bash
docker run --name dreamshappen-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dreamshappen \
  -p 5432:5432 -d postgres:16
```

**Native install (macOS via Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb dreamshappen
```

Either way you want a database named `dreamshappen` reachable on
`localhost:5432`.

---

## 4. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`. For **local development**, the defaults already work — the app
runs without real Stripe/Resend keys (checkout is simulated, emails print to the
console). The only line you must match to your database is the connection string:

```bash
# Database — point both at your local Postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dreamshappen?schema=public
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/dreamshappen?schema=public

# Admin CMS login (used at /admin)
ADMIN_EMAIL=admin@dreamshappenltd.com
ADMIN_PASSWORD=changeme

# Signs admin sessions + download tokens. Fine to leave default locally;
# MUST be a real secret in production (see §9).
APP_SECRET=change-me
```

### What each variable does

| Variable | Required? | Purpose / fallback |
|----------|-----------|--------------------|
| `DATABASE_URL` | **yes** | Pooled DB connection (runtime). |
| `DIRECT_URL` | **yes** | Direct DB connection for migrations. Locally same as `DATABASE_URL`. |
| `APP_SECRET` | prod | Signs admin sessions & download links. Defaults to an insecure dev value. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | prod | `/admin` login. Defaults are public — **change for production**. |
| `NEXT_PUBLIC_SITE_URL` | no | Base URL for OG/sitemap metadata only. |
| `NEXT_PUBLIC_CURRENCY` | no | Storefront currency (default `AED`). |
| `STRIPE_SECRET_KEY` | no | Leave blank → **simulated checkout**. Set → real Stripe. |
| `STRIPE_WEBHOOK_SECRET` | no | Needed only for live Stripe webhooks. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | no | Stripe.js publishable key. |
| `RESEND_API_KEY` | no | Leave blank → emails logged to console. Set → real email. |
| `EMAIL_FROM` | no | From-address for transactional email. |

---

## 5. Create the schema & seed content

```bash
npx prisma migrate deploy   # applies the committed migration(s)
npm run seed                # adds 5 demo dossiers + the WELCOME10 discount
```

The seed is idempotent — re-running it skips products that already exist.

---

## 6. Run the dev server

```bash
npm run dev
```

- Storefront: <http://localhost:3000>
- Admin CMS: <http://localhost:3000/admin> (log in with `ADMIN_EMAIL` /
  `ADMIN_PASSWORD`)

Add/edit products, upload PDFs, and manage the catalog from `/admin`.

---

## 7. Production build (run it locally before deploying)

```bash
npm run build   # prisma generate → migrate (if DB set) → seed (if empty) → next build
npm start       # serves the production build on :3000
```

`npm run build` is exactly what Vercel runs. With a database configured it
applies migrations and seeds an empty catalog automatically; with no database
it skips both and still builds.

---

## 8. Optional extras

**Run the end-to-end tests** (spins up a separate test DB):
```bash
# Requires a Postgres role/db: dh / dh / dreamshappen_test, or override:
export TEST_DATABASE_URL=postgresql://dh:dh@localhost:5432/dreamshappen_test?schema=public
npm run test:e2e
```

**Sync products to Stripe** (needs a real `STRIPE_SECRET_KEY` in `.env`):
```bash
npm run stripe:sync   # creates Stripe products/prices, stores their IDs
```

**Regenerate the sample PDF assets:**
```bash
npm run generate:pdfs
```

---

## 9. Deploy to Vercel

The repo is already wired so a Vercel deploy "just works": the build maps the
env-var names a Vercel Postgres store injects to what Prisma expects, runs
migrations, and seeds an empty catalog.

### A. Create & link the project (CLI)
```bash
npm i -g vercel
vercel login
vercel link            # create a new project named "dreamshappen"
vercel git connect     # auto-deploy on every push to your branch
```

### B. Add a database
In the Vercel dashboard: **Project → Storage → Create Database → Postgres →
connect**. This injects `DATABASE_URL` / `POSTGRES_*` automatically. (There is
no clean CLI command to provision managed Postgres — this step is the dashboard.)

### C. Set environment variables
Generate real secrets:
```bash
openssl rand -hex 32   # use this value for APP_SECRET
```
Then set them (repeat per environment as needed):
```bash
printf '%s' '<your-app-secret>'  | vercel env add APP_SECRET production
printf '%s' 'you@example.com'    | vercel env add ADMIN_EMAIL production
printf '%s' '<strong-password>'  | vercel env add ADMIN_PASSWORD production
```
Add `STRIPE_*` and `RESEND_API_KEY` later, when you have live keys. Until then
checkout is simulated and emails log to the console.

> The production `APP_SECRET` and an admin password were generated for you in
> the chat session — reuse those rather than committing any secret to git.

### D. Deploy
```bash
vercel --prod
```
After the database is connected, redeploy once so migrations + seed run.

---

## Project layout (orientation)

```
src/app/            Next.js routes (storefront, /admin, /api/*)
src/lib/            prisma client, auth, products, marketing, email, stripe
prisma/schema.prisma   data model + migrations
scripts/            seed, stripe-sync, pdf generation, build helpers
content/            static site content
tests/              Playwright e2e specs
```

Key build helpers added for deploy:
- `scripts/db-env.mjs` — maps Vercel/Neon Postgres env vars → `DATABASE_URL`/`DIRECT_URL`.
- `scripts/migrate-if-configured.mjs` — runs migrations only when a DB is set.
- `scripts/seed-if-configured.mjs` — seeds demo content only on an empty DB.
