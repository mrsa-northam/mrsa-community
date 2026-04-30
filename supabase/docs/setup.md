# MRSA Supabase Setup

These migrations make the project full-stack ready while keeping the schema flexible for future sports.

## Migrations

Run these in order:

1. `supabase/migrations/202604280001_initial_schema.sql`
2. `supabase/migrations/202604280002_seed_historical_tennis_data.sql`
3. `supabase/migrations/202604280003_profile_photo_storage.sql`

## Supabase SQL Editor

Open Supabase Dashboard → SQL Editor, then paste and run each migration file in order.

## Supabase CLI

From the project root:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

If the CLI asks for local config first:

```bash
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

## Make Yourself Admin

After creating your user through Supabase Auth, run this in SQL Editor with your auth user id:

```sql
insert into public.member_roles (auth_user_id, role)
values ('YOUR_AUTH_USER_ID', 'admin')
on conflict (auth_user_id) do update set role = excluded.role;
```

## What This Sets Up

- Multi-sport foundation through `sports`
- Tennis players loaded from the historical CSVs
- Claimed vs unclaimed player profile support
- Claim review table for admins to approve or reject false claims
- Player profile updates through RLS
- Tournaments and tournament registrations
- Payment ledger for charges, payments, refunds, and adjustments
- Historical matches, match participants, rating logs, rankings, and summaries
- Active `MRSA 2025` tournament at Forest Sports Club with `$110` registration fee

## App Environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Then restart the Next.js dev server.

## Auth

The app now uses Supabase email OTP:

- Login sends an OTP through Supabase Auth SMTP/email settings.
- OTP verification creates a Supabase session.
- Returning players can request to claim an unclaimed historical profile.
- New players create a claimed player profile tied to their auth user.

### Send OTP Instead Of Magic Link

Supabase uses the same `signInWithOtp` API for both magic links and one-time codes. The email template decides which one users receive.

In Supabase Dashboard:

1. Go to `Authentication` → `Email Templates`
2. Open the `Magic Link` template
3. Remove the confirmation link / `{{ .ConfirmationURL }}`
4. Add `{{ .Token }}`

You can paste the template from:

```text
supabase/docs/email-otp-template.html
```

The app already verifies with:

```ts
supabase.auth.verifyOtp({
  email,
  token,
  type: "email"
})
```

Supabase Auth supports email OTP lengths from 6 to 10 digits. If your project sends 8 digits, the app accepts that. To shorten it, check `Authentication` → `Providers` → `Email` for the OTP length setting. For local/self-hosted Supabase, set:

```toml
[auth.email]
otp_length = 6
```
