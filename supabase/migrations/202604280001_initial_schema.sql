-- MRSA multi-sport tournament schema for Supabase.
-- Run this before importing historical data.

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.member_role as enum ('player', 'admin');
create type public.claim_status as enum ('unclaimed', 'pending', 'claimed', 'rejected');
create type public.tournament_status as enum ('draft', 'registration_open', 'registration_closed', 'live', 'completed', 'cancelled');
create type public.registration_status as enum ('registered', 'waitlisted', 'cancelled', 'checked_in');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'waived');
create type public.payment_entry_type as enum ('charge', 'payment', 'refund', 'adjustment');
create type public.match_format as enum ('Singles', 'Doubles');
create type public.match_side as enum ('A', 'B');
create type public.claim_review_status as enum ('pending', 'approved', 'rejected', 'cancelled');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.sports (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.member_roles (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  role public.member_role not null default 'player',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.member_roles
    where auth_user_id = auth.uid()
      and role = 'admin'
  );
$$;

create table public.players (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports(id),
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  normalized_name text generated always as (lower(regexp_replace(trim(full_name), '\s+', ' ', 'g'))) stored,
  email citext,
  phone text,
  profile_photo_url text,
  jamaat_city text,
  self_assessment text check (self_assessment is null or self_assessment in ('Recreational', 'Intermediate', 'Advanced')),
  dominant_hand text,
  jersey_size text,
  tier integer not null default 1,
  rating numeric(6,3),
  rating_provisional boolean not null default false,
  tournaments_played integer not null default 0,
  matches_played integer not null default 0,
  claim_status public.claim_status not null default 'unclaimed',
  claim_requested_by uuid references auth.users(id) on delete set null,
  claim_reviewed_by uuid references auth.users(id) on delete set null,
  claimed_at timestamptz,
  claim_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sport_id, normalized_name)
);

create trigger players_set_updated_at
before update on public.players
for each row execute function public.set_updated_at();

create table public.player_claims (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete cascade,
  status public.claim_review_status not null default 'pending',
  requester_note text,
  admin_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.player_season_tiers (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  season_year integer not null,
  tier integer not null,
  created_at timestamptz not null default now(),
  unique (player_id, season_year)
);

create table public.player_rating_summaries (
  player_id uuid primary key references public.players(id) on delete cascade,
  mrsa_rating numeric(6,3),
  provisional boolean not null default false,
  matches_total integer not null default 0,
  wins_total integer not null default 0,
  singles_matches integer not null default 0,
  singles_wins integer not null default 0,
  doubles_matches integer not null default 0,
  doubles_wins integer not null default 0,
  matches_2024 integer not null default 0,
  wins_2024 integer not null default 0,
  singles_matches_2024 integer not null default 0,
  singles_wins_2024 integer not null default 0,
  doubles_matches_2024 integer not null default 0,
  doubles_wins_2024 integer not null default 0,
  matches_2025 integer not null default 0,
  wins_2025 integer not null default 0,
  singles_matches_2025 integer not null default 0,
  singles_wins_2025 integer not null default 0,
  doubles_matches_2025 integer not null default 0,
  doubles_wins_2025 integer not null default 0,
  imported_at timestamptz not null default now()
);

create table public.rankings (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports(id),
  player_id uuid not null references public.players(id) on delete cascade,
  ranking_scope text not null default 'overall',
  rank integer not null,
  mrsa_rating numeric(6,3),
  provisional boolean not null default false,
  matches_total integer not null default 0,
  wins_total integer not null default 0,
  singles_matches integer not null default 0,
  singles_wins integer not null default 0,
  doubles_matches integer not null default 0,
  doubles_wins integer not null default 0,
  imported_at timestamptz not null default now(),
  unique (sport_id, ranking_scope, rank)
);

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports(id),
  name text not null,
  season_year integer,
  status public.tournament_status not null default 'draft',
  venue_name text,
  venue_address text,
  venue_maps_url text,
  starts_on date,
  ends_on date,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  registration_fee_cents integer not null default 0,
  currency text not null default 'USD',
  max_players integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sport_id, name, season_year)
);

create trigger tournaments_set_updated_at
before update on public.tournaments
for each row execute function public.set_updated_at();

create table public.tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  status public.registration_status not null default 'registered',
  payment_status public.payment_status not null default 'pending',
  registered_at timestamptz not null default now(),
  cancelled_at timestamptz,
  notes text,
  unique (tournament_id, player_id)
);

create table public.payment_ledger (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete restrict,
  tournament_id uuid references public.tournaments(id) on delete set null,
  registration_id uuid references public.tournament_registrations(id) on delete set null,
  entry_type public.payment_entry_type not null,
  status public.payment_status not null default 'pending',
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD',
  method text,
  reference text,
  notes text,
  recorded_by uuid references auth.users(id) on delete set null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports(id),
  tournament_id uuid references public.tournaments(id) on delete set null,
  historical_match_number integer,
  season_year integer,
  format public.match_format not null,
  winner_side public.match_side not null,
  sets_a integer,
  sets_b integer,
  games_a integer,
  games_b integer,
  played_at timestamptz,
  imported_at timestamptz not null default now(),
  unique (sport_id, season_year, historical_match_number)
);

create table public.match_participants (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete restrict,
  side public.match_side not null,
  slot integer not null check (slot in (1, 2)),
  unique (match_id, side, slot)
);

create table public.match_rating_logs (
  match_id uuid primary key references public.matches(id) on delete cascade,
  team_a text not null,
  team_b text not null,
  team_a_rating_pre numeric(8,3),
  team_b_rating_pre numeric(8,3),
  expected_team_a numeric(8,4),
  margin_factor numeric(8,4),
  confidence_mode text,
  loss_confidence numeric(8,4),
  delta_a numeric(8,5),
  delta_b numeric(8,5),
  anchor_lambda numeric(8,5),
  imported_at timestamptz not null default now()
);

create index players_sport_name_idx on public.players (sport_id, normalized_name);
create index players_auth_user_idx on public.players (auth_user_id);
create index tournaments_sport_status_idx on public.tournaments (sport_id, status);
create index registrations_player_idx on public.tournament_registrations (player_id);
create index registrations_tournament_idx on public.tournament_registrations (tournament_id);
create index payment_ledger_player_idx on public.payment_ledger (player_id);
create index matches_sport_year_idx on public.matches (sport_id, season_year);

alter table public.sports enable row level security;
alter table public.member_roles enable row level security;
alter table public.players enable row level security;
alter table public.player_claims enable row level security;
alter table public.player_season_tiers enable row level security;
alter table public.player_rating_summaries enable row level security;
alter table public.rankings enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_registrations enable row level security;
alter table public.payment_ledger enable row level security;
alter table public.matches enable row level security;
alter table public.match_participants enable row level security;
alter table public.match_rating_logs enable row level security;

create policy "Sports are readable by everyone" on public.sports for select using (true);
create policy "Players are readable by everyone" on public.players for select using (true);
create policy "Rankings are readable by everyone" on public.rankings for select using (true);
create policy "Tournaments are readable by everyone" on public.tournaments for select using (true);
create policy "Registrations are readable by everyone" on public.tournament_registrations for select using (true);
create policy "Match history is readable by everyone" on public.matches for select using (true);
create policy "Match participants are readable by everyone" on public.match_participants for select using (true);
create policy "Match rating logs are readable by everyone" on public.match_rating_logs for select using (true);
create policy "Season tiers are readable by everyone" on public.player_season_tiers for select using (true);
create policy "Rating summaries are readable by everyone" on public.player_rating_summaries for select using (true);

create policy "Users can request claims" on public.player_claims
for insert with check (auth.uid() = requested_by);

create policy "Users can read their claims or admins read all" on public.player_claims
for select using (auth.uid() = requested_by or public.is_admin());

create policy "Admins manage claims" on public.player_claims
for update using (public.is_admin()) with check (public.is_admin());

create policy "Users update their claimed player profile" on public.players
for update using (auth.uid() = auth_user_id or public.is_admin())
with check (auth.uid() = auth_user_id or public.is_admin());

create policy "Authenticated users can create their own player profile" on public.players
for insert with check (auth.uid() = auth_user_id or public.is_admin());

create policy "Players create their own registrations" on public.tournament_registrations
for insert with check (
  public.is_admin()
  or exists (
    select 1
    from public.players
    where players.id = tournament_registrations.player_id
      and players.auth_user_id = auth.uid()
  )
);

create policy "Players update their own registrations or admins manage all" on public.tournament_registrations
for update using (
  public.is_admin()
  or exists (
    select 1
    from public.players
    where players.id = tournament_registrations.player_id
      and players.auth_user_id = auth.uid()
  )
) with check (
  public.is_admin()
  or exists (
    select 1
    from public.players
    where players.id = tournament_registrations.player_id
      and players.auth_user_id = auth.uid()
  )
);

create policy "Players read their payments and admins read all" on public.payment_ledger
for select using (
  public.is_admin()
  or exists (
    select 1
    from public.players
    where players.id = payment_ledger.player_id
      and players.auth_user_id = auth.uid()
  )
);

create policy "Admins manage payments" on public.payment_ledger
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage sports" on public.sports for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage tournaments" on public.tournaments for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage rankings" on public.rankings for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage match history" on public.matches for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage match participants" on public.match_participants for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage match logs" on public.match_rating_logs for all using (public.is_admin()) with check (public.is_admin());

insert into public.sports (slug, name)
values ('tennis', 'Tennis')
on conflict (slug) do nothing;
