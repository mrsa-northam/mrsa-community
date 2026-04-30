-- Extra Stripe metadata for retry/failure messaging and idempotent lookups.

alter table public.payment_ledger
  add column if not exists stripe_failure_code text,
  add column if not exists stripe_failure_message text;

create unique index if not exists payment_ledger_stripe_checkout_session_unique_idx
  on public.payment_ledger (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create index if not exists payment_ledger_player_occurred_idx
  on public.payment_ledger (player_id, occurred_at desc);
