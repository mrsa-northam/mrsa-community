create table if not exists public.tournament_schedule_matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  schedule_item_id uuid references public.tournament_schedule_items(id) on delete set null,
  day_number integer not null check (day_number in (1, 2, 3, 4, 5)),
  day_label text not null,
  start_time time,
  end_time time,
  time_label text not null,
  court_label text not null,
  pod_label text,
  format text not null check (format in ('Singles', 'Doubles')),
  match_type text,
  match_color text check (match_color in ('Green', 'Red')),
  tier_rule text,
  team_a_id uuid references public.tournament_teams(id) on delete set null,
  team_b_id uuid references public.tournament_teams(id) on delete set null,
  team_a_sort_order integer,
  team_b_sort_order integer,
  team_a_label text,
  team_b_label text,
  external_match_id text,
  status text not null default 'scheduled',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tournament_schedule_matches_set_updated_at
before update on public.tournament_schedule_matches
for each row execute function public.set_updated_at();

create table if not exists public.tournament_schedule_match_players (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  schedule_match_id uuid not null references public.tournament_schedule_matches(id) on delete cascade,
  team_id uuid references public.tournament_teams(id) on delete set null,
  player_id uuid references public.players(id) on delete set null,
  side text not null check (side in ('A', 'B')),
  slot integer not null check (slot in (1, 2)),
  tier_at_match integer check (tier_at_match between 1 and 4),
  source_player_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (schedule_match_id, side, slot)
);

create trigger tournament_schedule_match_players_set_updated_at
before update on public.tournament_schedule_match_players
for each row execute function public.set_updated_at();

create index if not exists tournament_schedule_matches_tournament_idx
  on public.tournament_schedule_matches (tournament_id, day_number, sort_order);

create index if not exists tournament_schedule_matches_time_idx
  on public.tournament_schedule_matches (tournament_id, start_time, court_label);

create index if not exists tournament_schedule_match_players_player_idx
  on public.tournament_schedule_match_players (tournament_id, player_id);

create index if not exists tournament_schedule_match_players_match_idx
  on public.tournament_schedule_match_players (schedule_match_id, side, slot);

alter table public.tournament_schedule_matches enable row level security;
alter table public.tournament_schedule_match_players enable row level security;

drop policy if exists "Published player schedule matches are readable" on public.tournament_schedule_matches;
drop policy if exists "Admins manage player schedule matches" on public.tournament_schedule_matches;
drop policy if exists "Published player schedule participants are readable" on public.tournament_schedule_match_players;
drop policy if exists "Admins manage player schedule participants" on public.tournament_schedule_match_players;

create policy "Published player schedule matches are readable" on public.tournament_schedule_matches
for select using (public.is_admin() or is_published);

create policy "Admins manage player schedule matches" on public.tournament_schedule_matches
for all using (public.is_admin()) with check (public.is_admin());

create policy "Published player schedule participants are readable" on public.tournament_schedule_match_players
for select using (
  public.is_admin()
  or exists (
    select 1
    from public.tournament_schedule_matches match
    where match.id = tournament_schedule_match_players.schedule_match_id
      and match.is_published
  )
);

create policy "Admins manage player schedule participants" on public.tournament_schedule_match_players
for all using (public.is_admin()) with check (public.is_admin());
