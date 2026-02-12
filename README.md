# Freelancer Micro-CRM

Lean multi-tenant CRM for freelancers and solo agencies.

## Stack
- Next.js 14 (App Router) + TypeScript
- Postgres + Prisma
- Auth.js with Google OAuth
- Tailwind CSS
- PayPlus billing skeleton

## Features in scaffold
- Google login + workspace bootstrap
- Multi-tenant model (`workspaceId` on business entities)
- CRUD APIs and pages for Clients, Deals, Tasks
- Dashboard summary + search endpoint
- Billing page placeholder + PayPlus webhook skeleton
- Daily reminder cron endpoint + console mailer
- Seed script with demo data
- Basic tests (tenancy + CRUD flow)

## Quick start
1. Install deps:
   ```bash
   pnpm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Run migrations + generate client:
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

## Deployment
Recommended: **Vercel** + **Neon/Supabase Postgres**.
- Set env vars from `.env.example` in Vercel project settings.
- Configure Vercel Cron to call `POST /api/cron/daily-reminders` with `x-cron-secret`.

## Billing flow (PayPlus)
- Trial (14 days) is set when first workspace is created.
- User selects monthly/yearly on billing page.
- `POST /api/billing/subscribe` creates checkout intent (stubbed in scaffold).
- Webhook endpoint: `POST /api/billing/webhook/payplus`.

