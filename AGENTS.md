# Project Context

This repository is a private Next.js application named `tennis-tournament`. It uses Next.js 15, React 19, Tailwind CSS, Supabase, Stripe, TypeScript, and an npm lockfile.

## Structure

- `app/` contains the Next.js App Router pages, API routes, shared UI, and Supabase client helpers.
- `app/lib/supabase.ts` is the browser Supabase client helper.
- `app/lib/supabase-server.ts` is the server-side Supabase helper.
- `app/api/stripe/` contains Stripe checkout, checkout status, and webhook routes.
- `app/admin/` contains admin-facing tournament, claims, players, and payments screens.
- `supabase/migrations/` contains database migrations and seed data.
- `supabase/docs/` contains setup and email template documentation.
- `public/` contains static assets.

## Commands

- Start local development with `npm run dev`.
- Build with `npm run build`.
- Start a production build with `npm run start`.
- Run lint with `npm run lint`.

## Environment

Runtime secrets and service keys belong in `.env.local` at the repo root. This file is ignored by Git and must not be committed.

Expected environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Use `.env.example` for placeholder values only.

## Development Notes

- Prefer existing App Router patterns in `app/` before introducing new structure.
- Keep database changes in timestamped files under `supabase/migrations/`.
- Treat service-role Supabase access and Stripe secret/webhook keys as server-only.
- Avoid exposing secret environment variables through client components or `NEXT_PUBLIC_` names.
- Preserve unrelated user changes in the worktree.
- Keep UI changes consistent with the existing Tailwind and component style in `app/components.tsx` and nearby pages.
