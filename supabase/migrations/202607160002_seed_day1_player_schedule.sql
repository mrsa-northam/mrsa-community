-- Seed Day 1 court-level player schedule from Day_1_Full_Tennis_Match_Schedule.xlsx.
-- This extends the team-level schedule with individual singles/doubles assignments.
with target_tournament as (
  select id
  from public.tournaments
  where status in ('draft', 'registration_open', 'registration_closed', 'live')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
match_rows(external_match_id, time_label, start_time, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_name, players_a, team_b_name, players_b, sort_order) as (
  values
    ('1', '9:30 AM', '09:30', 'Court 3', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Nadal', array['Mohamed Lukmanji']::text[], 'Team Djokovic', array['Hussain Malbari']::text[], 10),
    ('2', '9:30 AM', '09:30', 'Court 4', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Nadal', array['Hatim Jafferji']::text[], 'Team Djokovic', array['Hussain Boxwalla']::text[], 20),
    ('3', '9:30 AM', '09:30', 'Court 5', 'Pod A (3-5)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Nadal', array['Mustafa Kanchwala', 'Taher Bohri']::text[], 'Team Djokovic', array['Ammar Lukmanji', 'Hamza Hussain']::text[], 30),
    ('4', '9:30 AM', '09:30', 'Court 6', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Laver', array['Taha Zirapury']::text[], 'Team Agassi', array['Mustafa Zirapury']::text[], 40),
    ('5', '9:30 AM', '09:30', 'Court 7', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Laver', array['Hamza Kagalwala']::text[], 'Team Agassi', array['Hussain Morbiwala']::text[], 50),
    ('6', '9:30 AM', '09:30', 'Court 8', 'Pod B (6-8)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Laver', array['Qasim Hussain', 'Hashim Hussain']::text[], 'Team Agassi', array['Taher Hasanali', 'Burhanuddin Moosabhoy']::text[], 60),
    ('7', '9:30 AM', '09:30', 'Court 9', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Alcaraz', array['Mohammed Danish']::text[], 'Team Federer', array['Moiz Broachwala']::text[], 70),
    ('8', '9:30 AM', '09:30', 'Court 10', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Alcaraz', array['Taha Jamali']::text[], 'Team Federer', array['Shabbir Halai']::text[], 80),
    ('9', '9:30 AM', '09:30', 'Court 11', 'Pod C (9-11)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Alcaraz', array['Abduzzahir Anjarwala', 'Husain Attarwala']::text[], 'Team Federer', array['Najimuddin Valika', 'Fida Husain Abadin']::text[], 90),
    ('10', '10:40 AM', '10:40', 'Court 3', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Laver', array['Taha Zirapury']::text[], 'Team Nadal', array['Mohamed Lukmanji']::text[], 100),
    ('11', '10:40 AM', '10:40', 'Court 4', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Laver', array['Hamza Kagalwala']::text[], 'Team Nadal', array['Hatim Jafferji']::text[], 110),
    ('12', '10:40 AM', '10:40', 'Court 5', 'Pod A (3-5)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Laver', array['Qasim Hussain', 'Hashim Hussain']::text[], 'Team Nadal', array['Mustafa Kanchwala', 'Taher Bohri']::text[], 120),
    ('13', '10:40 AM', '10:40', 'Court 6', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Agassi', array['Mustafa Zirapury']::text[], 'Team Jannik', array['Qusai Lukmanji']::text[], 130),
    ('14', '10:40 AM', '10:40', 'Court 7', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Agassi', array['Hussain Morbiwala']::text[], 'Team Jannik', array['Abdeali Yamani']::text[], 140),
    ('15', '10:40 AM', '10:40', 'Court 8', 'Pod B (6-8)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Agassi', array['Taher Hasanali', 'Burhanuddin Moosabhoy']::text[], 'Team Jannik', array['Aliasger Lukmanji', 'Mehlam Tapal']::text[], 150),
    ('16', '10:40 AM', '10:40', 'Court 9', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Djokovic', array['Hussain Malbari']::text[], 'Team Sampras', array['Huzefa Gulamhusein']::text[], 160),
    ('17', '10:40 AM', '10:40', 'Court 10', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Djokovic', array['Hussain Boxwalla']::text[], 'Team Sampras', array['Huzefa Raja']::text[], 170),
    ('18', '10:40 AM', '10:40', 'Court 11', 'Pod C (9-11)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Djokovic', array['Ammar Lukmanji', 'Hamza Hussain']::text[], 'Team Sampras', array['Adnan Bohri', 'Murtaza Hussain']::text[], 180),
    ('19', '11:50 AM', '11:50', 'Court 3', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Laver', array['Taha Zirapury']::text[], 'Team Federer', array['Moiz Broachwala']::text[], 190),
    ('20', '11:50 AM', '11:50', 'Court 4', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Laver', array['Hamza Kagalwala']::text[], 'Team Federer', array['Shabbir Halai']::text[], 200),
    ('21', '11:50 AM', '11:50', 'Court 5', 'Pod A (3-5)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Laver', array['Qasim Hussain', 'Hashim Hussain']::text[], 'Team Federer', array['Najimuddin Valika', 'Fida Husain Abadin']::text[], 210),
    ('22', '11:50 AM', '11:50', 'Court 6', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Nadal', array['Mohamed Lukmanji']::text[], 'Team Jannik', array['Qusai Lukmanji']::text[], 220),
    ('23', '11:50 AM', '11:50', 'Court 7', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Nadal', array['Hatim Jafferji']::text[], 'Team Jannik', array['Abdeali Yamani']::text[], 230),
    ('24', '11:50 AM', '11:50', 'Court 8', 'Pod B (6-8)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Nadal', array['Mustafa Kanchwala', 'Taher Bohri']::text[], 'Team Jannik', array['Aliasger Lukmanji', 'Mehlam Tapal']::text[], 240),
    ('25', '11:50 AM', '11:50', 'Court 9', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Alcaraz', array['Mohammed Danish']::text[], 'Team Sampras', array['Huzefa Gulamhusein']::text[], 250),
    ('26', '11:50 AM', '11:50', 'Court 10', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Alcaraz', array['Taha Jamali']::text[], 'Team Sampras', array['Huzefa Raja']::text[], 260),
    ('27', '11:50 AM', '11:50', 'Court 11', 'Pod C (9-11)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Alcaraz', array['Abduzzahir Anjarwala', 'Husain Attarwala']::text[], 'Team Sampras', array['Adnan Bohri', 'Murtaza Hussain']::text[], 270),
    ('28', '1:30 PM', '13:30', 'Court 3', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Federer', array['Moiz Broachwala']::text[], 'Team Djokovic', array['Hussain Malbari']::text[], 280),
    ('29', '1:30 PM', '13:30', 'Court 4', 'Pod A (3-5)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Federer', array['Shabbir Halai']::text[], 'Team Djokovic', array['Hussain Boxwalla']::text[], 290),
    ('30', '1:30 PM', '13:30', 'Court 5', 'Pod A (3-5)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Federer', array['Najimuddin Valika', 'Fida Husain Abadin']::text[], 'Team Djokovic', array['Ammar Lukmanji', 'Hamza Hussain']::text[], 300),
    ('31', '1:30 PM', '13:30', 'Court 6', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Agassi', array['Mustafa Zirapury']::text[], 'Team Alcaraz', array['Mohammed Danish']::text[], 310),
    ('32', '1:30 PM', '13:30', 'Court 7', 'Pod B (6-8)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Agassi', array['Hussain Morbiwala']::text[], 'Team Alcaraz', array['Taha Jamali']::text[], 320),
    ('33', '1:30 PM', '13:30', 'Court 8', 'Pod B (6-8)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Agassi', array['Taher Hasanali', 'Burhanuddin Moosabhoy']::text[], 'Team Alcaraz', array['Abduzzahir Anjarwala', 'Husain Attarwala']::text[], 330),
    ('34', '1:30 PM', '13:30', 'Court 9', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 1 Singles', 'Team Jannik', array['Qusai Lukmanji']::text[], 'Team Sampras', array['Huzefa Gulamhusein']::text[], 340),
    ('35', '1:30 PM', '13:30', 'Court 10', 'Pod C (9-11)', 'Singles', 'Type 2', 'Red', 'Tier 2 Singles', 'Team Jannik', array['Abdeali Yamani']::text[], 'Team Sampras', array['Huzefa Raja']::text[], 350),
    ('36', '1:30 PM', '13:30', 'Court 11', 'Pod C (9-11)', 'Doubles', 'Type 2', 'Red', 'Tier 3/4 Doubles', 'Team Jannik', array['Aliasger Lukmanji', 'Mehlam Tapal']::text[], 'Team Sampras', array['Adnan Bohri', 'Murtaza Hussain']::text[], 360),
    ('37', '2:40 PM', '14:40', 'Court 3', 'Pod A (3-5)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Laver', array['Taha Zirapury', 'Hamza Kagalwala']::text[], 'Team Djokovic', array['Hussain Malbari', 'Hussain Boxwalla']::text[], 370),
    ('38', '2:40 PM', '14:40', 'Court 4', 'Pod A (3-5)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Laver', array['Qasim Hussain']::text[], 'Team Djokovic', array['Ammar Lukmanji']::text[], 380),
    ('39', '2:40 PM', '14:40', 'Court 5', 'Pod A (3-5)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Laver', array['Hashim Hussain']::text[], 'Team Djokovic', array['Hamza Hussain']::text[], 390),
    ('40', '2:40 PM', '14:40', 'Court 6', 'Pod B (6-8)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Nadal', array['Mohamed Lukmanji', 'Hatim Jafferji']::text[], 'Team Federer', array['Moiz Broachwala', 'Shabbir Halai']::text[], 400),
    ('41', '2:40 PM', '14:40', 'Court 7', 'Pod B (6-8)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Nadal', array['Mustafa Kanchwala']::text[], 'Team Federer', array['Najimuddin Valika']::text[], 410),
    ('42', '2:40 PM', '14:40', 'Court 8', 'Pod B (6-8)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Nadal', array['Taher Bohri']::text[], 'Team Federer', array['Fida Husain Abadin']::text[], 420),
    ('43', '2:40 PM', '14:40', 'Court 9', 'Pod C (9-11)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Alcaraz', array['Mohammed Danish', 'Taha Jamali']::text[], 'Team Jannik', array['Qusai Lukmanji', 'Abdeali Yamani']::text[], 430),
    ('44', '2:40 PM', '14:40', 'Court 10', 'Pod C (9-11)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Alcaraz', array['Abduzzahir Anjarwala']::text[], 'Team Jannik', array['Aliasger Lukmanji']::text[], 440),
    ('45', '2:40 PM', '14:40', 'Court 11', 'Pod C (9-11)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Alcaraz', array['Husain Attarwala']::text[], 'Team Jannik', array['Mehlam Tapal']::text[], 450),
    ('46', '3:50 PM', '15:50', 'Court 3', 'Pod A (3-5)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Laver', array['Taha Zirapury', 'Hamza Kagalwala']::text[], 'Team Alcaraz', array['Mohammed Danish', 'Taha Jamali']::text[], 460),
    ('47', '3:50 PM', '15:50', 'Court 4', 'Pod A (3-5)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Laver', array['Qasim Hussain']::text[], 'Team Alcaraz', array['Abduzzahir Anjarwala']::text[], 470),
    ('48', '3:50 PM', '15:50', 'Court 5', 'Pod A (3-5)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Laver', array['Hashim Hussain']::text[], 'Team Alcaraz', array['Husain Attarwala']::text[], 480),
    ('49', '3:50 PM', '15:50', 'Court 6', 'Pod B (6-8)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Agassi', array['Mustafa Zirapury', 'Hussain Morbiwala']::text[], 'Team Nadal', array['Mohamed Lukmanji', 'Hatim Jafferji']::text[], 490),
    ('50', '3:50 PM', '15:50', 'Court 7', 'Pod B (6-8)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Agassi', array['Taher Hasanali']::text[], 'Team Nadal', array['Mustafa Kanchwala']::text[], 500),
    ('51', '3:50 PM', '15:50', 'Court 8', 'Pod B (6-8)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Agassi', array['Burhanuddin Moosabhoy']::text[], 'Team Nadal', array['Taher Bohri']::text[], 510),
    ('52', '3:50 PM', '15:50', 'Court 9', 'Pod C (9-11)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Federer', array['Moiz Broachwala', 'Shabbir Halai']::text[], 'Team Sampras', array['Huzefa Gulamhusein', 'Huzefa Raja']::text[], 520),
    ('53', '3:50 PM', '15:50', 'Court 10', 'Pod C (9-11)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Federer', array['Najimuddin Valika']::text[], 'Team Sampras', array['Adnan Bohri']::text[], 530),
    ('54', '3:50 PM', '15:50', 'Court 11', 'Pod C (9-11)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Federer', array['Fida Husain Abadin']::text[], 'Team Sampras', array['Murtaza Hussain']::text[], 540),
    ('55', '5:00 PM', '17:00', 'Court 6', 'Pod B (6-8)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Agassi', array['Mustafa Zirapury', 'Hussain Morbiwala']::text[], 'Team Sampras', array['Huzefa Gulamhusein', 'Huzefa Raja']::text[], 550),
    ('56', '5:00 PM', '17:00', 'Court 7', 'Pod B (6-8)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Agassi', array['Taher Hasanali']::text[], 'Team Sampras', array['Adnan Bohri']::text[], 560),
    ('57', '5:00 PM', '17:00', 'Court 8', 'Pod B (6-8)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Agassi', array['Burhanuddin Moosabhoy']::text[], 'Team Sampras', array['Murtaza Hussain']::text[], 570),
    ('58', '5:00 PM', '17:00', 'Court 9', 'Pod C (9-11)', 'Doubles', 'Type 1', 'Green', 'Tier 1/2 Doubles', 'Team Jannik', array['Qusai Lukmanji', 'Abdeali Yamani']::text[], 'Team Djokovic', array['Hussain Malbari', 'Hussain Boxwalla']::text[], 580),
    ('59', '5:00 PM', '17:00', 'Court 10', 'Pod C (9-11)', 'Singles', 'Type 1', 'Green', 'Tier 3 Singles', 'Team Jannik', array['Aliasger Lukmanji']::text[], 'Team Djokovic', array['Ammar Lukmanji']::text[], 590),
    ('60', '5:00 PM', '17:00', 'Court 11', 'Pod C (9-11)', 'Singles', 'Type 1', 'Green', 'Tier 4 Singles', 'Team Jannik', array['Mehlam Tapal']::text[], 'Team Djokovic', array['Hamza Hussain']::text[], 600)
),
prepared_matches as (
  select
    target_tournament.id as tournament_id,
    match_rows.*,
    team_a.id as team_a_id,
    team_a.sort_order as team_a_sort_order,
    team_b.id as team_b_id,
    team_b.sort_order as team_b_sort_order
  from target_tournament
  join match_rows on true
  left join public.tournament_teams team_a
    on team_a.tournament_id = target_tournament.id
   and lower(trim(team_a.name)) = lower(trim(match_rows.team_a_name))
  left join public.tournament_teams team_b
    on team_b.tournament_id = target_tournament.id
   and lower(trim(team_b.name)) = lower(trim(match_rows.team_b_name))
),
inserted_matches as (
  insert into public.tournament_schedule_matches (
    tournament_id,
    day_number,
    day_label,
    start_time,
    time_label,
    court_label,
    pod_label,
    format,
    match_type,
    match_color,
    tier_rule,
    team_a_id,
    team_b_id,
    team_a_sort_order,
    team_b_sort_order,
    team_a_label,
    team_b_label,
    external_match_id,
    sort_order,
    is_published
  )
  select
    tournament_id,
    1,
    'Day 1: Sat',
    start_time::time,
    time_label,
    court_label,
    pod_label,
    format,
    match_type,
    match_color,
    tier_rule,
    team_a_id,
    team_b_id,
    team_a_sort_order,
    team_b_sort_order,
    team_a_name,
    team_b_name,
    external_match_id,
    sort_order,
    true
  from prepared_matches prepared
  where not exists (
    select 1
    from public.tournament_schedule_matches existing
    where existing.tournament_id = prepared.tournament_id
      and existing.external_match_id = prepared.external_match_id
  )
  returning id, tournament_id, external_match_id
),
all_matches as (
  select id, tournament_id, external_match_id
  from inserted_matches
  union
  select existing.id, existing.tournament_id, existing.external_match_id
  from public.tournament_schedule_matches existing
  join target_tournament on target_tournament.id = existing.tournament_id
  join match_rows on match_rows.external_match_id = existing.external_match_id
),
player_rows as (
  select
    all_matches.id as schedule_match_id,
    all_matches.tournament_id,
    prepared_matches.team_a_id as team_id,
    'A'::text as side,
    player_name.source_player_name,
    player_name.slot
  from all_matches
  join prepared_matches
    on prepared_matches.tournament_id = all_matches.tournament_id
   and prepared_matches.external_match_id = all_matches.external_match_id
  cross join lateral unnest(prepared_matches.players_a) with ordinality as player_name(source_player_name, slot)
  union all
  select
    all_matches.id as schedule_match_id,
    all_matches.tournament_id,
    prepared_matches.team_b_id as team_id,
    'B'::text as side,
    player_name.source_player_name,
    player_name.slot
  from all_matches
  join prepared_matches
    on prepared_matches.tournament_id = all_matches.tournament_id
   and prepared_matches.external_match_id = all_matches.external_match_id
  cross join lateral unnest(prepared_matches.players_b) with ordinality as player_name(source_player_name, slot)
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
from resolved_players resolved
where not exists (
  select 1
  from public.tournament_schedule_match_players existing
  where existing.schedule_match_id = resolved.schedule_match_id
    and existing.side = resolved.side
    and existing.slot = resolved.slot::integer
);
