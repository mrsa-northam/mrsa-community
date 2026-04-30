-- Demo unclaimed profiles for testing the returning-player claim flow.
-- Only historical-import fields are seeded. Profile-completion fields are left
-- blank so claimed players must finish onboarding before moving forward.

begin;

insert into public.sports (slug, name)
values ('tennis', 'Tennis')
on conflict (slug) do nothing;

-- Players, kept unclaimed until a signed-in user claims their profile.

insert into public.players (
  sport_id,
  full_name,
  tier,
  rating,
  rating_provisional,
  tournaments_played,
  matches_played,
  claim_status
)
select id, 'Test Mustafa Claimwala', 1, 4.918, true, 1, 7, 'unclaimed'
from public.sports
where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  auth_user_id = null,
  email = null,
  phone = null,
  profile_photo_url = null,
  jamaat_city = null,
  self_assessment = null,
  dominant_hand = null,
  jersey_size = null,
  tennis_video_url = null,
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played,
  claim_status = 'unclaimed',
  claim_requested_by = null,
  claim_reviewed_by = null,
  claimed_at = null,
  claim_note = 'Demo profile for testing returning-player claim flow.';

insert into public.players (
  sport_id,
  full_name,
  tier,
  rating,
  rating_provisional,
  tournaments_played,
  matches_played,
  claim_status
)
select id, 'Test Huzefa Claimwala', 2, 4.554, false, 2, 13, 'unclaimed'
from public.sports
where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  auth_user_id = null,
  email = null,
  phone = null,
  profile_photo_url = null,
  jamaat_city = null,
  self_assessment = null,
  dominant_hand = null,
  jersey_size = null,
  tennis_video_url = null,
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played,
  claim_status = 'unclaimed',
  claim_requested_by = null,
  claim_reviewed_by = null,
  claimed_at = null,
  claim_note = 'Demo profile for testing returning-player claim flow.';

insert into public.players (
  sport_id,
  full_name,
  tier,
  rating,
  rating_provisional,
  tournaments_played,
  matches_played,
  claim_status
)
select id, 'Test Abbas Claimwala', 4, 3.541, true, 1, 6, 'unclaimed'
from public.sports
where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  auth_user_id = null,
  email = null,
  phone = null,
  profile_photo_url = null,
  jamaat_city = null,
  self_assessment = null,
  dominant_hand = null,
  jersey_size = null,
  tennis_video_url = null,
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played,
  claim_status = 'unclaimed',
  claim_requested_by = null,
  claim_reviewed_by = null,
  claimed_at = null,
  claim_note = 'Demo profile for testing returning-player claim flow.';

-- Player tier by season.

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p
join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Test Mustafa Claimwala')
on conflict (player_id, season_year) do update set
  tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p
join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Test Huzefa Claimwala')
on conflict (player_id, season_year) do update set
  tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p
join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Test Huzefa Claimwala')
on conflict (player_id, season_year) do update set
  tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p
join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Test Abbas Claimwala')
on conflict (player_id, season_year) do update set
  tier = excluded.tier;

-- Current player summary stats.

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
  matches_2024,
  wins_2024,
  singles_matches_2024,
  singles_wins_2024,
  doubles_matches_2024,
  doubles_wins_2024,
  matches_2025,
  wins_2025,
  singles_matches_2025,
  singles_wins_2025,
  doubles_matches_2025,
  doubles_wins_2025
)
select p.id, 4.918, true, 7, 7, 4, 4, 3, 3, 0, 0, 0, 0, 0, 0, 7, 7, 4, 4, 3, 3
from public.players p
join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Test Mustafa Claimwala')
on conflict (player_id) do update set
  mrsa_rating = excluded.mrsa_rating,
  provisional = excluded.provisional,
  matches_total = excluded.matches_total,
  wins_total = excluded.wins_total,
  singles_matches = excluded.singles_matches,
  singles_wins = excluded.singles_wins,
  doubles_matches = excluded.doubles_matches,
  doubles_wins = excluded.doubles_wins,
  matches_2024 = excluded.matches_2024,
  wins_2024 = excluded.wins_2024,
  singles_matches_2024 = excluded.singles_matches_2024,
  singles_wins_2024 = excluded.singles_wins_2024,
  doubles_matches_2024 = excluded.doubles_matches_2024,
  doubles_wins_2024 = excluded.doubles_wins_2024,
  matches_2025 = excluded.matches_2025,
  wins_2025 = excluded.wins_2025,
  singles_matches_2025 = excluded.singles_matches_2025,
  singles_wins_2025 = excluded.singles_wins_2025,
  doubles_matches_2025 = excluded.doubles_matches_2025,
  doubles_wins_2025 = excluded.doubles_wins_2025;

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
  matches_2024,
  wins_2024,
  singles_matches_2024,
  singles_wins_2024,
  doubles_matches_2024,
  doubles_wins_2024,
  matches_2025,
  wins_2025,
  singles_matches_2025,
  singles_wins_2025,
  doubles_matches_2025,
  doubles_wins_2025
)
select p.id, 4.554, false, 13, 7, 7, 4, 6, 3, 6, 4, 3, 2, 3, 2, 7, 3, 4, 2, 3, 1
from public.players p
join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Test Huzefa Claimwala')
on conflict (player_id) do update set
  mrsa_rating = excluded.mrsa_rating,
  provisional = excluded.provisional,
  matches_total = excluded.matches_total,
  wins_total = excluded.wins_total,
  singles_matches = excluded.singles_matches,
  singles_wins = excluded.singles_wins,
  doubles_matches = excluded.doubles_matches,
  doubles_wins = excluded.doubles_wins,
  matches_2024 = excluded.matches_2024,
  wins_2024 = excluded.wins_2024,
  singles_matches_2024 = excluded.singles_matches_2024,
  singles_wins_2024 = excluded.singles_wins_2024,
  doubles_matches_2024 = excluded.doubles_matches_2024,
  doubles_wins_2024 = excluded.doubles_wins_2024,
  matches_2025 = excluded.matches_2025,
  wins_2025 = excluded.wins_2025,
  singles_matches_2025 = excluded.singles_matches_2025,
  singles_wins_2025 = excluded.singles_wins_2025,
  doubles_matches_2025 = excluded.doubles_matches_2025,
  doubles_wins_2025 = excluded.doubles_wins_2025;

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
  matches_2024,
  wins_2024,
  singles_matches_2024,
  singles_wins_2024,
  doubles_matches_2024,
  doubles_wins_2024,
  matches_2025,
  wins_2025,
  singles_matches_2025,
  singles_wins_2025,
  doubles_matches_2025,
  doubles_wins_2025
)
select p.id, 3.541, true, 6, 3, 3, 0, 3, 3, 6, 3, 3, 0, 3, 3, 0, 0, 0, 0, 0, 0
from public.players p
join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Test Abbas Claimwala')
on conflict (player_id) do update set
  mrsa_rating = excluded.mrsa_rating,
  provisional = excluded.provisional,
  matches_total = excluded.matches_total,
  wins_total = excluded.wins_total,
  singles_matches = excluded.singles_matches,
  singles_wins = excluded.singles_wins,
  doubles_matches = excluded.doubles_matches,
  doubles_wins = excluded.doubles_wins,
  matches_2024 = excluded.matches_2024,
  wins_2024 = excluded.wins_2024,
  singles_matches_2024 = excluded.singles_matches_2024,
  singles_wins_2024 = excluded.singles_wins_2024,
  doubles_matches_2024 = excluded.doubles_matches_2024,
  doubles_wins_2024 = excluded.doubles_wins_2024,
  matches_2025 = excluded.matches_2025,
  wins_2025 = excluded.wins_2025,
  singles_matches_2025 = excluded.singles_matches_2025,
  singles_wins_2025 = excluded.singles_wins_2025,
  doubles_matches_2025 = excluded.doubles_matches_2025,
  doubles_wins_2025 = excluded.doubles_wins_2025;

commit;
