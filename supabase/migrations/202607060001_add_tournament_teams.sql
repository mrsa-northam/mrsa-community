alter table public.tournament_registrations
  add column if not exists shirt_name text;

create table public.tournament_teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id, name)
);

create trigger tournament_teams_set_updated_at
before update on public.tournament_teams
for each row execute function public.set_updated_at();

create table public.tournament_team_members (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  team_id uuid not null references public.tournament_teams(id) on delete cascade,
  registration_id uuid not null references public.tournament_registrations(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  is_captain boolean not null default false,
  draft_order integer,
  tier_at_draft integer check (tier_at_draft between 1 and 4),
  shirt_name_snapshot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id, registration_id),
  unique (team_id, player_id)
);

create trigger tournament_team_members_set_updated_at
before update on public.tournament_team_members
for each row execute function public.set_updated_at();

create unique index tournament_team_members_one_captain_idx
  on public.tournament_team_members (team_id)
  where is_captain;

create index tournament_teams_tournament_idx
  on public.tournament_teams (tournament_id, sort_order);

create index tournament_team_members_team_idx
  on public.tournament_team_members (team_id, draft_order);

create index tournament_team_members_player_idx
  on public.tournament_team_members (player_id);

create or replace function public.validate_tournament_team_member()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.tournament_teams team
    where team.id = new.team_id
      and team.tournament_id = new.tournament_id
  ) then
    raise exception 'Team does not belong to this tournament.';
  end if;

  if not exists (
    select 1
    from public.tournament_registrations registration
    where registration.id = new.registration_id
      and registration.tournament_id = new.tournament_id
      and registration.player_id = new.player_id
      and registration.status <> 'cancelled'
  ) then
    raise exception 'Registration does not belong to this tournament/player.';
  end if;

  return new;
end;
$$;

create trigger tournament_team_members_validate
before insert or update on public.tournament_team_members
for each row execute function public.validate_tournament_team_member();

alter table public.tournament_teams enable row level security;
alter table public.tournament_team_members enable row level security;

create policy "Published teams are readable" on public.tournament_teams
for select using (public.is_admin() or is_published);

create policy "Admins manage tournament teams" on public.tournament_teams
for all using (public.is_admin()) with check (public.is_admin());

create policy "Published team members are readable" on public.tournament_team_members
for select using (
  public.is_admin()
  or exists (
    select 1
    from public.tournament_teams team
    where team.id = tournament_team_members.team_id
      and team.is_published
  )
);

create policy "Admins manage tournament team members" on public.tournament_team_members
for all using (public.is_admin()) with check (public.is_admin());
