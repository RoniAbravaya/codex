# Freelancer Micro-CRM

Lean multi-tenant CRM for freelancers and solo agencies.

## Stack
- Next.js 14 (App Router) + TypeScript
- Postgres + Prisma
- Auth.js with Credentials (email/password) + optional Google OAuth
- Tailwind CSS
- PayPlus billing skeleton

## Features in scaffold
- Google or Email/Password login + workspace bootstrap (owner workspace + 14-day trial)
- Multi-tenant model (`workspaceId` on business entities)
- CRUD APIs and pages for Clients, Deals, Tasks
- Dashboard summary + search endpoint
- Billing page placeholder + PayPlus webhook skeleton (HMAC verification)
- Daily reminder cron endpoint + console mailer
- Seed script with demo data
- Basic tests (tenancy + CRUD flow)

## Local quick start
1. Install deps:
   ```bash
   pnpm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client + run migration:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```
4. Seed demo data:
   ```bash
   pnpm prisma:seed
   ```
5. Run app:
   ```bash
   pnpm dev
   ```

## Scripts
- `pnpm dev` - local dev server
- `pnpm build` - production build
- `pnpm lint` - ESLint
- `pnpm test` - Vitest
- `pnpm prisma:generate`
- `pnpm prisma:migrate`
- `pnpm prisma:seed`

## Deploy to Vercel (ready-to-run)
Recommended DB: **Neon** or **Supabase Postgres**.

### 1) Create production database
- Create a Postgres instance in Neon/Supabase.
- Copy the pooled connection string into `DATABASE_URL`.

### 2) Create Auth credentials
- Email/password sign-in works by default once DB is configured.
- Google sign-in is optional; if configured, add:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - redirect URI: `https://YOUR_DOMAIN/api/auth/callback/google`

### 3) Configure Vercel project
- Import this repository into Vercel.
- Framework preset: Next.js.
- Add env vars from `.env.example`:
  - `DATABASE_URL` (or Vercel `POSTGRES_PRISMA_URL` / `POSTGRES_URL` / `PRISMA_DATABASE_URL`)
  - `NEXTAUTH_URL` (use your production URL)
  - `AUTH_SECRET` (random long secret)
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `PAYPLUS_API_KEY`
  - `PAYPLUS_SECRET`
  - `PAYPLUS_WEBHOOK_SECRET`
  - `CRON_SECRET`

### 4) Run database migration on production
Use one of these:
- Preferred: CI/CD step with `pnpm prisma migrate deploy`
- Manual one-time:
  ```bash
  DATABASE_URL="..." pnpm prisma migrate deploy
  ```

### 5) Set up daily reminders cron
- `vercel.json` already includes the daily cron path.
- Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically when configured.

### 6) Configure PayPlus webhook
- In PayPlus dashboard, set webhook URL:
  - `https://YOUR_DOMAIN/api/billing/webhook/payplus`
- Ensure webhook signature is sent in `x-payplus-signature`.
- Set the same secret in `PAYPLUS_WEBHOOK_SECRET`.

### 7) Final production checks
Run before/after deploy:
```bash
pnpm test
pnpm lint
pnpm build
```

## Production readiness notes
- Migration SQL is now materialized in `prisma/migrations/20261101000000_init/migration.sql`.
- Unauthenticated page access redirects to `/signin`.
- API handlers return JSON errors for auth/validation/runtime failures.
- PayPlus webhook uses HMAC SHA256 verification with timing-safe comparison.

## Billing flow (PayPlus)
- Trial (14 days) is set when first workspace is created.
- User selects monthly/yearly on billing page.
- `POST /api/billing/subscribe` creates checkout intent (currently provider-call stub).
- Webhook endpoint: `POST /api/billing/webhook/payplus`.


## Troubleshooting (Vercel)
- If `POST /api/auth/register` returns 500/503 after adding email auth, your DB schema may be behind the code.
- Run migrations on the target database used by that deployment:
  ```bash
  DATABASE_URL="..." pnpm prisma migrate deploy
  ```
- In Vercel, ensure the preview/prod environment is connected to the same Postgres project you migrated.


## Vercel CLI checklist (recommended)
```bash
vercel link
vercel env pull .env.development.local
pnpm prisma:migrate
pnpm prisma:seed
vercel deploy
```
