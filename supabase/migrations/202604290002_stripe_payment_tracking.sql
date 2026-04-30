-- Stripe Checkout tracking for tournament registration payments.

alter table public.payment_ledger
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

create index if not exists payment_ledger_stripe_checkout_session_idx
  on public.payment_ledger (stripe_checkout_session_id);

create index if not exists payment_ledger_player_tournament_status_idx
  on public.payment_ledger (player_id, tournament_id, status, occurred_at desc);
