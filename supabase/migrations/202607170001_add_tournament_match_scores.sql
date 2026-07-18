create table if not exists public.tournament_match_scores (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  schedule_match_id uuid not null references public.tournament_schedule_matches(id) on delete cascade,
  side_a_set1 integer check (side_a_set1 between 0 and 99),
  side_b_set1 integer check (side_b_set1 between 0 and 99),
  side_a_set2 integer check (side_a_set2 between 0 and 99),
  side_b_set2 integer check (side_b_set2 between 0 and 99),
  side_a_set3 integer check (side_a_set3 between 0 and 99),
  side_b_set3 integer check (side_b_set3 between 0 and 99),
  winner_side text check (winner_side in ('A', 'B')),
  submitted_by uuid references public.players(id) on delete set null,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (schedule_match_id)
);

create trigger tournament_match_scores_set_updated_at
before update on public.tournament_match_scores
for each row execute function public.set_updated_at();

create index if not exists tournament_match_scores_tournament_idx
  on public.tournament_match_scores (tournament_id, schedule_match_id);

alter table public.tournament_match_scores enable row level security;

drop policy if exists "Published match scores are readable" on public.tournament_match_scores;
drop policy if exists "Admins manage match scores" on public.tournament_match_scores;
drop policy if exists "Match players submit match scores" on public.tournament_match_scores;

create policy "Published match scores are readable" on public.tournament_match_scores
for select using (
  public.is_admin()
  or exists (
    select 1
    from public.tournament_schedule_matches match
    where match.id = tournament_match_scores.schedule_match_id
      and match.is_published
  )
);

create policy "Admins manage match scores" on public.tournament_match_scores
for all using (public.is_admin()) with check (public.is_admin());

create policy "Match players submit match scores" on public.tournament_match_scores
for all using (
  exists (
    select 1
    from public.tournament_schedule_match_players participant
    join public.players player on player.id = participant.player_id
    where participant.schedule_match_id = tournament_match_scores.schedule_match_id
      and player.auth_user_id = auth.uid()
  )
  or exists (
    select 1
    from public.tournament_schedule_match_players participant
    join public.players current_player on current_player.auth_user_id = auth.uid()
    where participant.schedule_match_id = tournament_match_scores.schedule_match_id
      and lower(trim(current_player.full_name)) = 'mohammed segval'
      and lower(trim(participant.source_player_name)) = 'moiz broachwala'
  )
) with check (
  exists (
    select 1
    from public.tournament_schedule_match_players participant
    join public.players player on player.id = participant.player_id
    where participant.schedule_match_id = tournament_match_scores.schedule_match_id
      and player.auth_user_id = auth.uid()
  )
  or exists (
    select 1
    from public.tournament_schedule_match_players participant
    join public.players current_player on current_player.auth_user_id = auth.uid()
    where participant.schedule_match_id = tournament_match_scores.schedule_match_id
      and lower(trim(current_player.full_name)) = 'mohammed segval'
      and lower(trim(participant.source_player_name)) = 'moiz broachwala'
  )
);
