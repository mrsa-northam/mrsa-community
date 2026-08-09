-- Keep the 2026 roster and match snapshots aligned with the confirmed tiers.
with tier_corrections(player_name, tier) as (
  values
    ('Adnan Bohri', 3),
    ('Husain Attarwala', 4)
)
update public.players player
set tier = correction.tier
from tier_corrections correction
where lower(trim(player.full_name)) = lower(trim(correction.player_name));

with tier_corrections(player_name, tier) as (
  values
    ('Adnan Bohri', 3),
    ('Husain Attarwala', 4)
)
insert into public.player_season_tiers (player_id, season_year, tier)
select player.id, 2026, correction.tier
from public.players player
join tier_corrections correction
  on lower(trim(player.full_name)) = lower(trim(correction.player_name))
on conflict (player_id, season_year)
do update set tier = excluded.tier;

with target_tournament as (
  select id
  from public.tournaments
  where status in ('draft', 'registration_open', 'registration_closed', 'live')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
tier_corrections(player_name, tier) as (
  values
    ('Adnan Bohri', 3),
    ('Husain Attarwala', 4)
)
update public.tournament_team_members member
set tier_at_draft = correction.tier
from target_tournament tournament
join public.players player on true
join tier_corrections correction
  on lower(trim(player.full_name)) = lower(trim(correction.player_name))
where member.tournament_id = tournament.id
  and member.player_id = player.id;

with target_tournament as (
  select id
  from public.tournaments
  where status in ('draft', 'registration_open', 'registration_closed', 'live')
  order by starts_on desc nulls last, created_at desc
  limit 1
),
tier_corrections(player_name, tier) as (
  values
    ('Adnan Bohri', 3),
    ('Husain Attarwala', 4)
)
update public.tournament_schedule_match_players participant
set tier_at_match = correction.tier
from target_tournament tournament
join public.players player on true
join tier_corrections correction
  on lower(trim(player.full_name)) = lower(trim(correction.player_name))
where participant.tournament_id = tournament.id
  and participant.player_id = player.id;
