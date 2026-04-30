-- Admin panel query helpers. These keep heavy admin pages fast without
-- affecting player-facing routes.

create index if not exists players_claim_status_idx on public.players (claim_status);
create index if not exists players_full_name_idx on public.players (full_name);
create index if not exists player_claims_status_created_idx on public.player_claims (status, created_at);
create index if not exists payment_ledger_status_occurred_idx on public.payment_ledger (status, occurred_at desc);
create index if not exists payment_ledger_tournament_idx on public.payment_ledger (tournament_id);
create index if not exists tournament_registrations_status_idx on public.tournament_registrations (status);
