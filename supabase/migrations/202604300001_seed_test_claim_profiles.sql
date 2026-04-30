-- Demo unclaimed profiles for testing the returning-player claim flow.
-- These are intentionally obvious test records, but shaped like historical player imports.

begin;

insert into public.sports (slug, name)
values ('tennis', 'Tennis')
on conflict (slug) do nothing;

with tennis as (
  select id as sport_id
  from public.sports
  where slug = 'tennis'
),
seed_profiles as (
  select *
  from (
    values
      ('Test Player Advanced', 'Chicago', 'Advanced', 'Right', 'M', 1, 4.612::numeric, false, 2, 14, 10, 8, 4, 2, 2, 13, 8, 6, 5, 2),
      ('Test Player Intermediate', 'Detroit', 'Intermediate', 'Right', 'L', 3, 3.884::numeric, false, 2, 12, 6, 8, 4, 2, 2, 10, 5, 7, 4, 3),
      ('Test Player Recreational', 'Houston', 'Recreational', 'Left', 'XL', 4, 3.214::numeric, true, 1, 6, 2, 4, 1, 2, 1, 6, 2, 4, 1, 2)
  ) as profile(
    full_name,
    jamaat_city,
    self_assessment,
    dominant_hand,
    jersey_size,
    tier,
    rating,
    rating_provisional,
    tournaments_played,
    matches_played,
    wins_total,
    singles_matches,
    singles_wins,
    doubles_matches,
    doubles_wins,
    matches_2025,
    wins_2025,
    singles_matches_2025,
    singles_wins_2025,
    doubles_wins_2025
  )
),
upserted_players as (
  insert into public.players (
    sport_id,
    full_name,
    jamaat_city,
    self_assessment,
    dominant_hand,
    jersey_size,
    tier,
    rating,
    rating_provisional,
    tournaments_played,
    matches_played,
    claim_status,
    claim_note
  )
  select
    tennis.sport_id,
    seed_profiles.full_name,
    seed_profiles.jamaat_city,
    seed_profiles.self_assessment,
    seed_profiles.dominant_hand,
    seed_profiles.jersey_size,
    seed_profiles.tier,
    seed_profiles.rating,
    seed_profiles.rating_provisional,
    seed_profiles.tournaments_played,
    seed_profiles.matches_played,
    'unclaimed',
    'Demo profile for testing returning-player claim flow.'
  from tennis
  cross join seed_profiles
  on conflict (sport_id, normalized_name) do update set
    auth_user_id = null,
    jamaat_city = excluded.jamaat_city,
    self_assessment = excluded.self_assessment,
    dominant_hand = excluded.dominant_hand,
    jersey_size = excluded.jersey_size,
    tier = excluded.tier,
    rating = excluded.rating,
    rating_provisional = excluded.rating_provisional,
    tournaments_played = excluded.tournaments_played,
    matches_played = excluded.matches_played,
    claim_status = 'unclaimed',
    claim_requested_by = null,
    claim_reviewed_by = null,
    claimed_at = null,
    claim_note = excluded.claim_note
  returning id, sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played
)
insert into public.player_season_tiers (player_id, season_year, tier)
select id, 2025, tier
from upserted_players
on conflict (player_id, season_year) do update set
  tier = excluded.tier;

with seed_profiles as (
  select *
  from (
    values
      ('Test Player Advanced', 4.612::numeric, false, 14, 10, 8, 4, 2, 13, 8, 6, 5, 2),
      ('Test Player Intermediate', 3.884::numeric, false, 12, 6, 8, 4, 2, 10, 5, 7, 4, 3),
      ('Test Player Recreational', 3.214::numeric, true, 6, 2, 4, 1, 2, 6, 2, 4, 1, 2)
  ) as profile(
    full_name,
    rating,
    provisional,
    matches_total,
    wins_total,
    singles_matches,
    singles_wins,
    doubles_wins,
    matches_2025,
    wins_2025,
    singles_matches_2025,
    singles_wins_2025,
    doubles_wins_2025
  )
)
insert into public.player_rating_summaries (
  player_id,
  mrsa_rating,
  provisional,
  matches_total,
  wins_total,
  singles_matches,
  singles_wins,
  doubles_matches,
  doubles_wins,
  matches_2025,
  wins_2025,
  singles_matches_2025,
  singles_wins_2025,
  doubles_matches_2025,
  doubles_wins_2025
)
select
  players.id,
  seed_profiles.rating,
  seed_profiles.provisional,
  seed_profiles.matches_total,
  seed_profiles.wins_total,
  seed_profiles.singles_matches,
  seed_profiles.singles_wins,
  seed_profiles.matches_total - seed_profiles.singles_matches,
  seed_profiles.doubles_wins,
  seed_profiles.matches_2025,
  seed_profiles.wins_2025,
  seed_profiles.singles_matches_2025,
  seed_profiles.singles_wins_2025,
  seed_profiles.matches_2025 - seed_profiles.singles_matches_2025,
  seed_profiles.doubles_wins_2025
from seed_profiles
join public.players on players.normalized_name = lower(seed_profiles.full_name)
join public.sports on sports.id = players.sport_id and sports.slug = 'tennis'
on conflict (player_id) do update set
  mrsa_rating = excluded.mrsa_rating,
  provisional = excluded.provisional,
  matches_total = excluded.matches_total,
  wins_total = excluded.wins_total,
  singles_matches = excluded.singles_matches,
  singles_wins = excluded.singles_wins,
  doubles_matches = excluded.doubles_matches,
  doubles_wins = excluded.doubles_wins,
  matches_2025 = excluded.matches_2025,
  wins_2025 = excluded.wins_2025,
  singles_matches_2025 = excluded.singles_matches_2025,
  singles_wins_2025 = excluded.singles_wins_2025,
  doubles_matches_2025 = excluded.doubles_matches_2025,
  doubles_wins_2025 = excluded.doubles_wins_2025;

with ranked_profiles as (
  select *
  from (
    values
      ('Test Player Advanced', 1, 4.612::numeric, false, 14, 10, 8, 4, 6, 6),
      ('Test Player Intermediate', 2, 3.884::numeric, false, 12, 6, 8, 4, 4, 2),
      ('Test Player Recreational', 3, 3.214::numeric, true, 6, 2, 4, 1, 2, 1)
  ) as profile(full_name, rank, rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
)
insert into public.rankings (
  sport_id,
  player_id,
  ranking_scope,
  rank,
  mrsa_rating,
  provisional,
  matches_total,
  wins_total,
  singles_matches,
  singles_wins,
  doubles_matches,
  doubles_wins
)
select
  players.sport_id,
  players.id,
  'test_claims',
  ranked_profiles.rank,
  ranked_profiles.rating,
  ranked_profiles.provisional,
  ranked_profiles.matches_total,
  ranked_profiles.wins_total,
  ranked_profiles.singles_matches,
  ranked_profiles.singles_wins,
  ranked_profiles.doubles_matches,
  ranked_profiles.doubles_wins
from ranked_profiles
join public.players on players.normalized_name = lower(ranked_profiles.full_name)
join public.sports on sports.id = players.sport_id and sports.slug = 'tennis'
on conflict (sport_id, ranking_scope, rank) do update set
  player_id = excluded.player_id,
  mrsa_rating = excluded.mrsa_rating,
  provisional = excluded.provisional,
  matches_total = excluded.matches_total,
  wins_total = excluded.wins_total,
  singles_matches = excluded.singles_matches,
  singles_wins = excluded.singles_wins,
  doubles_matches = excluded.doubles_matches,
  doubles_wins = excluded.doubles_wins;

commit;
