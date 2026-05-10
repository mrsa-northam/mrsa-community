alter table public.tournaments
  add column if not exists formats text[],
  add column if not exists allowed_tiers text[];
