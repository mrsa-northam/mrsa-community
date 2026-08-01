create table if not exists public.tournament_day2_coin_tosses (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  bracket_node_key text not null check (bracket_node_key in ('reentry1', 'reentry2', 'semifinal1', 'semifinal2')),
  winning_team_id uuid not null references public.tournament_teams(id) on delete cascade,
  format_choice text not null check (format_choice in ('tiers_1_2_singles', 'tiers_3_4_singles')),
  submitted_by uuid references public.players(id) on delete set null,
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id, bracket_node_key)
);

drop trigger if exists tournament_day2_coin_tosses_set_updated_at on public.tournament_day2_coin_tosses;
create trigger tournament_day2_coin_tosses_set_updated_at
before update on public.tournament_day2_coin_tosses
for each row execute function public.set_updated_at();

create index if not exists tournament_day2_coin_tosses_tournament_idx
  on public.tournament_day2_coin_tosses (tournament_id, bracket_node_key);

alter table public.tournament_day2_coin_tosses enable row level security;

drop policy if exists "Day 2 coin tosses are readable" on public.tournament_day2_coin_tosses;
drop policy if exists "Admins manage Day 2 coin tosses" on public.tournament_day2_coin_tosses;

create policy "Day 2 coin tosses are readable" on public.tournament_day2_coin_tosses
for select using (true);

create policy "Admins manage Day 2 coin tosses" on public.tournament_day2_coin_tosses
for all using (public.is_admin()) with check (public.is_admin());
