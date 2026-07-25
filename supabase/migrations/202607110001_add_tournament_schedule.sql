create table if not exists public.tournament_schedule_notes (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  body text not null check (char_length(trim(body)) > 0),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tournament_schedule_notes_set_updated_at on public.tournament_schedule_notes;
create trigger tournament_schedule_notes_set_updated_at
before update on public.tournament_schedule_notes
for each row execute function public.set_updated_at();

create table if not exists public.tournament_schedule_items (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  item_type text not null default 'match' check (item_type in ('match', 'event')),
  day_number integer not null check (day_number in (1, 2, 3, 4, 5)),
  day_label text not null,
  start_time time,
  end_time time,
  time_label text not null,
  pod_label text,
  court_label text,
  phase text,
  match_label text,
  team_a_sort_order integer,
  team_b_sort_order integer,
  team_a_label text,
  team_b_label text,
  detail text,
  status text not null default 'scheduled',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tournament_schedule_items_set_updated_at on public.tournament_schedule_items;
create trigger tournament_schedule_items_set_updated_at
before update on public.tournament_schedule_items
for each row execute function public.set_updated_at();

create index if not exists tournament_schedule_notes_tournament_idx
  on public.tournament_schedule_notes (tournament_id, sort_order);

create index if not exists tournament_schedule_items_tournament_idx
  on public.tournament_schedule_items (tournament_id, day_number, sort_order);

create index if not exists tournament_schedule_items_team_a_idx
  on public.tournament_schedule_items (tournament_id, team_a_sort_order);

create index if not exists tournament_schedule_items_team_b_idx
  on public.tournament_schedule_items (tournament_id, team_b_sort_order);

alter table public.tournament_schedule_notes enable row level security;
alter table public.tournament_schedule_items enable row level security;

drop policy if exists "Published schedule notes are readable" on public.tournament_schedule_notes;
drop policy if exists "Admins manage schedule notes" on public.tournament_schedule_notes;
drop policy if exists "Published schedule items are readable" on public.tournament_schedule_items;
drop policy if exists "Admins manage schedule items" on public.tournament_schedule_items;

create policy "Published schedule notes are readable" on public.tournament_schedule_notes
for select using (public.is_admin() or is_published);

create policy "Admins manage schedule notes" on public.tournament_schedule_notes
for all using (public.is_admin()) with check (public.is_admin());

create policy "Published schedule items are readable" on public.tournament_schedule_items
for select using (public.is_admin() or is_published);

create policy "Admins manage schedule items" on public.tournament_schedule_items
for all using (public.is_admin()) with check (public.is_admin());

with target_tournament as (
  select id
  from public.tournaments
  where status in ('registration_open', 'registration_closed', 'live', 'draft')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
note_rows(title, body, sort_order) as (
  values
    ('Court availability', 'Sat: all 11 courts from open until needed. Sun: all 11 courts from open until 11:30 AM, 9 courts from 11:30 AM-12:30 PM, 6 courts from 12:30 PM-3 PM, all 11 courts from 3 PM until needed.', 10),
    ('Day 1 matchups', 'Each team plays 5 other teams. If even team plays even team or odd team plays odd team, Tiers 1/2 play doubles and Tiers 3/4 play singles: 2 matchups. If even team plays odd team or vice versa, Tiers 1/2 play singles and Tiers 3/4 play doubles: 3 matchups.', 20),
    ('QF, advantage, survival, and re-entry rounds', 'QF winners move to Advantage Round; QF losers move to Survival Round. Advantage winners go directly to Semifinals. Advantage losers get one more chance in Re-entry Round. Survival winners move to Re-entry Round; Survival losers are eliminated. Re-entry winners qualify for Semifinals; Re-entry losers are eliminated.', 30),
    ('Day 2 matchups', 'QF / Advantage / Survival / Re-entry rounds use singles or doubles. Which tiers play singles or doubles will be determined by coin toss.', 40),
    ('Finals', 'All players play both singles and doubles. If a team gets 4 wins, the 5th and 6th games will be paused and will not be played.', 50),
    ('Match format', 'Each match is Fast 4 and timed for 1 hour. Warmup is strictly 5 minutes. First alarm at 50 minutes to complete the set. Second alarm at 60 minutes to complete the match. USTA timed match rules apply, with a 5-point tiebreaker instead of 7.', 60)
)
insert into public.tournament_schedule_notes (tournament_id, title, body, sort_order, is_published)
select target_tournament.id, note_rows.title, note_rows.body, note_rows.sort_order, true
from target_tournament, note_rows
where not exists (
  select 1
  from public.tournament_schedule_notes existing
  where existing.tournament_id = target_tournament.id
);

with target_tournament as (
  select id
  from public.tournaments
  where status in ('registration_open', 'registration_closed', 'live', 'draft')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
schedule_rows(item_type, day_number, day_label, start_time, end_time, time_label, pod_label, court_label, phase, match_label, team_a_sort_order, team_b_sort_order, team_a_label, team_b_label, detail, sort_order) as (
  values
    ('event', 1, 'Day 1: Sat', '08:00'::time, '09:30'::time, '8:00-9:30', null, null, 'Event', 'Breakfast / briefing / warmup / team meetup', null, null, null, null, 'Breakfast, briefing, warmup, and team meetup.', 100),
    ('match', 1, 'Day 1: Sat', '09:30'::time, '10:30'::time, '9:30-10:30', 'Pod A', 'Courts 3-5', 'Round robin', 'Team 4 vs Team 7', 4, 7, 'Team 4', 'Team 7', 'Red format', 110),
    ('match', 1, 'Day 1: Sat', '09:30'::time, '10:30'::time, '9:30-10:30', 'Pod B', 'Courts 6-8', 'Round robin', 'Team 1 vs Team 2', 1, 2, 'Team 1', 'Team 2', 'Red format', 111),
    ('match', 1, 'Day 1: Sat', '09:30'::time, '10:30'::time, '9:30-10:30', 'Pod C', 'Courts 9-11', 'Round robin', 'Team 3 vs Team 6', 3, 6, 'Team 3', 'Team 6', 'Red format', 112),
    ('match', 1, 'Day 1: Sat', '10:40'::time, '11:40'::time, '10:40-11:40', 'Pod A', 'Courts 3-5', 'Round robin', 'Team 1 vs Team 4', 1, 4, 'Team 1', 'Team 4', 'Red format', 120),
    ('match', 1, 'Day 1: Sat', '10:40'::time, '11:40'::time, '10:40-11:40', 'Pod B', 'Courts 6-8', 'Round robin', 'Team 2 vs Team 5', 2, 5, 'Team 2', 'Team 5', 'Red format', 121),
    ('match', 1, 'Day 1: Sat', '10:40'::time, '11:40'::time, '10:40-11:40', 'Pod C', 'Courts 9-11', 'Round robin', 'Team 7 vs Team 8', 7, 8, 'Team 7', 'Team 8', 'Red format', 122),
    ('match', 1, 'Day 1: Sat', '11:50'::time, '12:50'::time, '11:50-12:50', 'Pod A', 'Courts 3-5', 'Round robin', 'Team 1 vs Team 6', 1, 6, 'Team 1', 'Team 6', 'Red format', 130),
    ('match', 1, 'Day 1: Sat', '11:50'::time, '12:50'::time, '11:50-12:50', 'Pod B', 'Courts 6-8', 'Round robin', 'Team 4 vs Team 5', 4, 5, 'Team 4', 'Team 5', 'Red format', 131),
    ('match', 1, 'Day 1: Sat', '11:50'::time, '12:50'::time, '11:50-12:50', 'Pod C', 'Courts 9-11', 'Round robin', 'Team 3 vs Team 8', 3, 8, 'Team 3', 'Team 8', 'Red format', 132),
    ('event', 1, 'Day 1: Sat', '12:50'::time, '13:30'::time, '12:50-1:30', null, null, 'Event', 'Lunch', null, null, null, null, 'Lunch break.', 140),
    ('match', 1, 'Day 1: Sat', '13:30'::time, '14:30'::time, '1:30-2:30', 'Pod A', 'Courts 3-5', 'Round robin', 'Team 6 vs Team 7', 6, 7, 'Team 6', 'Team 7', 'Red format', 150),
    ('match', 1, 'Day 1: Sat', '13:30'::time, '14:30'::time, '1:30-2:30', 'Pod B', 'Courts 6-8', 'Round robin', 'Team 2 vs Team 3', 2, 3, 'Team 2', 'Team 3', 'Red format', 151),
    ('match', 1, 'Day 1: Sat', '13:30'::time, '14:30'::time, '1:30-2:30', 'Pod C', 'Courts 9-11', 'Round robin', 'Team 5 vs Team 8', 5, 8, 'Team 5', 'Team 8', 'Red format', 152),
    ('match', 1, 'Day 1: Sat', '14:40'::time, '15:40'::time, '2:40-3:40', 'Pod A', 'Courts 3-5', 'Round robin', 'Team 1 vs Team 7', 1, 7, 'Team 1', 'Team 7', 'Green format', 160),
    ('match', 1, 'Day 1: Sat', '14:40'::time, '15:40'::time, '2:40-3:40', 'Pod B', 'Courts 6-8', 'Round robin', 'Team 4 vs Team 6', 4, 6, 'Team 4', 'Team 6', 'Green format', 161),
    ('match', 1, 'Day 1: Sat', '14:40'::time, '15:40'::time, '2:40-3:40', 'Pod C', 'Courts 9-11', 'Round robin', 'Team 3 vs Team 5', 3, 5, 'Team 3', 'Team 5', 'Green format', 162),
    ('match', 1, 'Day 1: Sat', '15:50'::time, '16:50'::time, '3:50-4:50', 'Pod A', 'Courts 3-5', 'Round robin', 'Team 1 vs Team 3', 1, 3, 'Team 1', 'Team 3', 'Green format', 170),
    ('match', 1, 'Day 1: Sat', '15:50'::time, '16:50'::time, '3:50-4:50', 'Pod B', 'Courts 6-8', 'Round robin', 'Team 2 vs Team 4', 2, 4, 'Team 2', 'Team 4', 'Green format', 171),
    ('match', 1, 'Day 1: Sat', '15:50'::time, '16:50'::time, '3:50-4:50', 'Pod C', 'Courts 9-11', 'Round robin', 'Team 6 vs Team 8', 6, 8, 'Team 6', 'Team 8', 'Green format', 172),
    ('match', 1, 'Day 1: Sat', '17:00'::time, '18:00'::time, '5:00-6:00', 'Pod B', 'Courts 6-8', 'Round robin', 'Team 2 vs Team 8', 2, 8, 'Team 2', 'Team 8', 'Green format', 180),
    ('match', 1, 'Day 1: Sat', '17:00'::time, '18:00'::time, '5:00-6:00', 'Pod C', 'Courts 9-11', 'Round robin', 'Team 5 vs Team 7', 5, 7, 'Team 5', 'Team 7', 'Green format', 181),
    ('event', 2, 'Day 2: Sun', '08:00'::time, '09:00'::time, '8:00-9:00', null, null, 'Event', 'Breakfast / briefing / warmup / team meetup', null, null, null, null, 'Breakfast, briefing, warmup, and team meetup.', 200),
    ('match', 2, 'Day 2: Sun', '09:00'::time, '10:00'::time, '9:00-10:00', 'Pod B', 'Courts 6-8', 'Quarterfinal', 'QF1: Seed 1 vs Seed 8', null, null, 'Seed 1', 'Seed 8', null, 210),
    ('match', 2, 'Day 2: Sun', '09:00'::time, '10:00'::time, '9:00-10:00', 'Pod C', 'Courts 9-11', 'Quarterfinal', 'QF2: Seed 4 vs Seed 5', null, null, 'Seed 4', 'Seed 5', null, 211),
    ('match', 2, 'Day 2: Sun', '10:10'::time, '11:10'::time, '10:10-11:10', 'Pod A', 'Courts 3-5', 'Quarterfinal', 'QF3: Seed 3 vs Seed 6', null, null, 'Seed 3', 'Seed 6', null, 220),
    ('match', 2, 'Day 2: Sun', '10:10'::time, '11:10'::time, '10:10-11:10', 'Pod B', 'Courts 6-8', 'Quarterfinal', 'QF4: Seed 2 vs Seed 7', null, null, 'Seed 2', 'Seed 7', null, 221),
    ('event', 2, 'Day 2: Sun', '11:20'::time, '12:20'::time, '11:20-12:20', 'Pod A', null, 'Event', 'Lunch', null, null, null, null, 'Lunch break.', 230),
    ('match', 2, 'Day 2: Sun', '11:20'::time, '12:20'::time, '11:20-12:20', 'Pod B', 'Courts 6-8', 'Survival', 'Survival 1: QF1 Loser vs QF2 Loser', null, null, 'QF1 Loser', 'QF2 Loser', null, 231),
    ('match', 2, 'Day 2: Sun', '11:20'::time, '12:20'::time, '11:20-12:20', 'Pod C', 'Courts 9-11', 'Survival', 'Survival 2: QF3 Loser vs QF4 Loser', null, null, 'QF3 Loser', 'QF4 Loser', null, 232),
    ('event', 2, 'Day 2: Sun', '12:30'::time, '13:30'::time, '12:30-1:30', 'Pod A', null, 'Event', 'Lunch', null, null, null, null, 'Lunch break.', 240),
    ('match', 2, 'Day 2: Sun', '12:30'::time, '13:30'::time, '12:30-1:30', 'Pod B', 'Courts 6-8', 'Advantage', 'Advantage 1: QF1 Winner vs QF2 Winner', null, null, 'QF1 Winner', 'QF2 Winner', null, 241),
    ('match', 2, 'Day 2: Sun', '12:30'::time, '13:30'::time, '12:30-1:30', 'Pod C', 'Courts 9-11', 'Advantage', 'Advantage 2: QF3 Winner vs QF4 Winner', null, null, 'QF3 Winner', 'QF4 Winner', null, 242),
    ('match', 2, 'Day 2: Sun', '13:40'::time, '14:40'::time, '1:40-2:40', 'Pod B', 'Courts 6-8', 'Re-entry', 'Re-entry 1: Survival 1 Winner vs Advantage 2 Loser', null, null, 'Survival 1 Winner', 'Advantage 2 Loser', null, 250),
    ('match', 2, 'Day 2: Sun', '13:40'::time, '14:40'::time, '1:40-2:40', 'Pod C', 'Courts 9-11', 'Re-entry', 'Re-entry 2: Survival 2 Winner vs Advantage 1 Loser', null, null, 'Survival 2 Winner', 'Advantage 1 Loser', null, 251),
    ('match', 2, 'Day 2: Sun', '14:50'::time, '15:50'::time, '2:50-3:50', 'Pod B', 'Courts 6-8', 'Semifinal', 'SF1: Advantage 1 Winner vs Re-entry 2 Winner', null, null, 'Advantage 1 Winner', 'Re-entry 2 Winner', null, 260),
    ('match', 2, 'Day 2: Sun', '14:50'::time, '15:50'::time, '2:50-3:50', 'Pod C', 'Courts 9-11', 'Semifinal', 'SF2: Advantage 2 Winner vs Re-entry 1 Winner', null, null, 'Advantage 2 Winner', 'Re-entry 1 Winner', null, 261),
    ('match', 2, 'Day 2: Sun', '16:00'::time, '17:00'::time, '4:00-5:00', null, null, 'Final', 'Final Doubles', null, null, 'Finalist 1', 'Finalist 2', 'Final doubles.', 270),
    ('match', 2, 'Day 2: Sun', '17:10'::time, '18:10'::time, '5:10-6:10', null, 'Courts 6-9', 'Final', 'Final Singles', null, null, 'Finalist 1', 'Finalist 2', 'Final singles on courts 6-9.', 280),
    ('event', 2, 'Day 2: Sun', '18:15'::time, '19:00'::time, '6:15-7:00', null, null, 'Event', 'Awards / wrapup', null, null, null, null, 'Awards and wrapup.', 290)
)
insert into public.tournament_schedule_items (
  tournament_id,
  item_type,
  day_number,
  day_label,
  start_time,
  end_time,
  time_label,
  pod_label,
  court_label,
  phase,
  match_label,
  team_a_sort_order,
  team_b_sort_order,
  team_a_label,
  team_b_label,
  detail,
  sort_order,
  is_published
)
select
  target_tournament.id,
  schedule_rows.item_type,
  schedule_rows.day_number,
  schedule_rows.day_label,
  schedule_rows.start_time,
  schedule_rows.end_time,
  schedule_rows.time_label,
  schedule_rows.pod_label,
  schedule_rows.court_label,
  schedule_rows.phase,
  schedule_rows.match_label,
  schedule_rows.team_a_sort_order,
  schedule_rows.team_b_sort_order,
  schedule_rows.team_a_label,
  schedule_rows.team_b_label,
  schedule_rows.detail,
  schedule_rows.sort_order,
  true
from target_tournament, schedule_rows
where not exists (
  select 1
  from public.tournament_schedule_items existing
  where existing.tournament_id = target_tournament.id
);
