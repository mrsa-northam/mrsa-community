-- Apply the four highlighted Day 1 Red-format matchup changes while leaving
-- every other tournament schedule row untouched.

with target_tournament as (
  select id
  from public.tournaments
  where status in ('draft', 'registration_open', 'registration_closed', 'live')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
schedule_item_changes(sort_order, team_a_sort_order, team_b_sort_order) as (
  values
    (112, 5, 8),
    (120, 3, 6),
    (151, 1, 4),
    (152, 2, 3)
)
update public.tournament_schedule_items schedule_item
set
  match_label = format('Team %s vs Team %s', change.team_a_sort_order, change.team_b_sort_order),
  team_a_sort_order = change.team_a_sort_order,
  team_b_sort_order = change.team_b_sort_order,
  team_a_label = format('Team %s', change.team_a_sort_order),
  team_b_label = format('Team %s', change.team_b_sort_order)
from target_tournament, schedule_item_changes change
where schedule_item.tournament_id = target_tournament.id
  and schedule_item.day_number = 1
  and schedule_item.item_type = 'match'
  and schedule_item.sort_order = change.sort_order;

with target_tournament as (
  select id
  from public.tournaments
  where status in ('draft', 'registration_open', 'registration_closed', 'live')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
match_changes(external_match_id, team_a_name, players_a, team_b_name, players_b) as (
  values
    ('7', 'Team Jannik', array['Qusai Lukmanji']::text[], 'Team Sampras', array['Huzefa Gulamhusein']::text[]),
    ('8', 'Team Jannik', array['Abdeali Yamani']::text[], 'Team Sampras', array['Huzefa Raja']::text[]),
    ('9', 'Team Jannik', array['Aliasger Lukmanji', 'Mehlam Tapal']::text[], 'Team Sampras', array['Adnan Bohri', 'Murtaza Hussain']::text[]),
    ('10', 'Team Alcaraz', array['Mohammed Danish']::text[], 'Team Federer', array['Moiz Broachwala']::text[]),
    ('11', 'Team Alcaraz', array['Taha Jamali']::text[], 'Team Federer', array['Shabbir Halai']::text[]),
    ('12', 'Team Alcaraz', array['Abduzzahir Anjarwala', 'Husain Attarwala']::text[], 'Team Federer', array['Najmuddin Valika', 'Fida Husain Abadin']::text[]),
    ('31', 'Team Laver', array['Taha Zirapury']::text[], 'Team Nadal', array['Mohamed Lukmanji']::text[]),
    ('32', 'Team Laver', array['Hamza Kagalwala']::text[], 'Team Nadal', array['Hatim Jafferji']::text[]),
    ('33', 'Team Laver', array['Qasim Hussain', 'Hashim Hussain']::text[], 'Team Nadal', array['Mustafa Kanchwala', 'Taher Bohri']::text[]),
    ('34', 'Team Agassi', array['Mustafa Zirapury']::text[], 'Team Alcaraz', array['Mohammed Danish']::text[]),
    ('35', 'Team Agassi', array['Hussain Morbiwala']::text[], 'Team Alcaraz', array['Taha Jamali']::text[]),
    ('36', 'Team Agassi', array['Taher Hasanali', 'Burhanuddin Moosabhoy']::text[], 'Team Alcaraz', array['Abduzzahir Anjarwala', 'Husain Attarwala']::text[])
),
prepared_matches as (
  select
    target_tournament.id as tournament_id,
    match_changes.*,
    team_a.id as team_a_id,
    team_a.sort_order as team_a_sort_order,
    team_b.id as team_b_id,
    team_b.sort_order as team_b_sort_order
  from target_tournament
  join match_changes on true
  join public.tournament_teams team_a
    on team_a.tournament_id = target_tournament.id
   and lower(trim(team_a.name)) = lower(trim(match_changes.team_a_name))
  join public.tournament_teams team_b
    on team_b.tournament_id = target_tournament.id
   and lower(trim(team_b.name)) = lower(trim(match_changes.team_b_name))
)
update public.tournament_schedule_matches schedule_match
set
  team_a_id = prepared.team_a_id,
  team_b_id = prepared.team_b_id,
  team_a_sort_order = prepared.team_a_sort_order,
  team_b_sort_order = prepared.team_b_sort_order,
  team_a_label = prepared.team_a_name,
  team_b_label = prepared.team_b_name
from prepared_matches prepared
where schedule_match.tournament_id = prepared.tournament_id
  and schedule_match.day_number = 1
  and schedule_match.external_match_id = prepared.external_match_id;

with target_tournament as (
  select id
  from public.tournaments
  where status in ('draft', 'registration_open', 'registration_closed', 'live')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
match_changes(external_match_id, team_a_name, players_a, team_b_name, players_b) as (
  values
    ('7', 'Team Jannik', array['Qusai Lukmanji']::text[], 'Team Sampras', array['Huzefa Gulamhusein']::text[]),
    ('8', 'Team Jannik', array['Abdeali Yamani']::text[], 'Team Sampras', array['Huzefa Raja']::text[]),
    ('9', 'Team Jannik', array['Aliasger Lukmanji', 'Mehlam Tapal']::text[], 'Team Sampras', array['Adnan Bohri', 'Murtaza Hussain']::text[]),
    ('10', 'Team Alcaraz', array['Mohammed Danish']::text[], 'Team Federer', array['Moiz Broachwala']::text[]),
    ('11', 'Team Alcaraz', array['Taha Jamali']::text[], 'Team Federer', array['Shabbir Halai']::text[]),
    ('12', 'Team Alcaraz', array['Abduzzahir Anjarwala', 'Husain Attarwala']::text[], 'Team Federer', array['Najmuddin Valika', 'Fida Husain Abadin']::text[]),
    ('31', 'Team Laver', array['Taha Zirapury']::text[], 'Team Nadal', array['Mohamed Lukmanji']::text[]),
    ('32', 'Team Laver', array['Hamza Kagalwala']::text[], 'Team Nadal', array['Hatim Jafferji']::text[]),
    ('33', 'Team Laver', array['Qasim Hussain', 'Hashim Hussain']::text[], 'Team Nadal', array['Mustafa Kanchwala', 'Taher Bohri']::text[]),
    ('34', 'Team Agassi', array['Mustafa Zirapury']::text[], 'Team Alcaraz', array['Mohammed Danish']::text[]),
    ('35', 'Team Agassi', array['Hussain Morbiwala']::text[], 'Team Alcaraz', array['Taha Jamali']::text[]),
    ('36', 'Team Agassi', array['Taher Hasanali', 'Burhanuddin Moosabhoy']::text[], 'Team Alcaraz', array['Abduzzahir Anjarwala', 'Husain Attarwala']::text[])
),
prepared_matches as (
  select
    schedule_match.id as schedule_match_id,
    target_tournament.id as tournament_id,
    match_changes.*,
    team_a.id as team_a_id,
    team_b.id as team_b_id
  from target_tournament
  join match_changes on true
  join public.tournament_schedule_matches schedule_match
    on schedule_match.tournament_id = target_tournament.id
   and schedule_match.day_number = 1
   and schedule_match.external_match_id = match_changes.external_match_id
  join public.tournament_teams team_a
    on team_a.tournament_id = target_tournament.id
   and lower(trim(team_a.name)) = lower(trim(match_changes.team_a_name))
  join public.tournament_teams team_b
    on team_b.tournament_id = target_tournament.id
   and lower(trim(team_b.name)) = lower(trim(match_changes.team_b_name))
),
player_rows as (
  select
    prepared.schedule_match_id,
    prepared.tournament_id,
    prepared.team_a_id as team_id,
    'A'::text as side,
    player_name.source_player_name,
    player_name.slot
  from prepared_matches prepared
  cross join lateral unnest(prepared.players_a) with ordinality as player_name(source_player_name, slot)
  union all
  select
    prepared.schedule_match_id,
    prepared.tournament_id,
    prepared.team_b_id as team_id,
    'B'::text as side,
    player_name.source_player_name,
    player_name.slot
  from prepared_matches prepared
  cross join lateral unnest(prepared.players_b) with ordinality as player_name(source_player_name, slot)
),
resolved_players as (
  select
    player_rows.*,
    player.id as player_id,
    member.tier_at_draft
  from player_rows
  left join public.players player
    on lower(trim(player.full_name)) = lower(trim(player_rows.source_player_name))
  left join public.tournament_team_members member
    on member.tournament_id = player_rows.tournament_id
   and member.team_id = player_rows.team_id
   and member.player_id = player.id
)
insert into public.tournament_schedule_match_players (
  tournament_id,
  schedule_match_id,
  team_id,
  player_id,
  side,
  slot,
  tier_at_match,
  source_player_name
)
select
  tournament_id,
  schedule_match_id,
  team_id,
  player_id,
  side,
  slot::integer,
  tier_at_draft,
  source_player_name
from resolved_players
on conflict (schedule_match_id, side, slot)
do update set
  tournament_id = excluded.tournament_id,
  team_id = excluded.team_id,
  player_id = excluded.player_id,
  tier_at_match = excluded.tier_at_match,
  source_player_name = excluded.source_player_name;
