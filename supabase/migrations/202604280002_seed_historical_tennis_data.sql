-- Historical MRSA tennis import generated from CSV exports.

-- Source files: Players, Player Summary, Rankings, Matches, Match Log.

begin;

insert into public.sports (slug, name) values ('tennis', 'Tennis') on conflict (slug) do nothing;



-- Active tournament currently shown in the app.

insert into public.tournaments (sport_id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_fee_cents, currency, max_players, notes)
select id, 'MRSA 2025', 2025, 'registration_open', 'Forest Sports Club', 'Forest Sports Club', 'https://www.google.com/maps/search/?api=1&query=Forest%20Sports%20Club', date '2025-08-07', date '2025-08-08', 11000, 'USD', 64, 'Seeded active tournament.'
from public.sports where slug = 'tennis'
on conflict do nothing;



-- Players, kept unclaimed until a signed-in user claims their profile.

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Abbas Cutlerywala', 4, 3.541, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Abdeali Yamani', 3, 3.775, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Adnan Bohri', 4, 3.691, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Ahmed Hussain', 2, 4.526, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Ahmed Sihorwala', 3, 4.189, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Aliasger Lukmanji', 3, 3.933, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Ammar Hussain', 4, 3.622, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Ammar Lukmanji', 4, 3.779, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Burhanuddin Moosabhoy', 4, 3.551, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hamza Hussain', 3, 4.121, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hamza Kagalwala', 4, 3.665, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hashim Hussain', 4, 3.614, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hatim Jafferji', 2, 4.3, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Humza Boxwalla', 4, 3.781, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hussain Boxwalla', 2, 4.328, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hussain Dalal', 4, 3.604, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hussain Malbari', 1, 4.499, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Hussain Morbiwala', 3, 4.043, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Huzaifa Doctor', 3, 4.097, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Huzefa Gulamhusein', 2, 4.554, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Huzefa Raja', 2, 4.616, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Ibrahim Gandhi', 4, 3.903, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Ibrahim Tayeb', 3, 3.845, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'MM Bashir', 1, 3.983, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Melam Master', 1, 4.508, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Mohamed Lukmanji', 1, 4.679, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Mohammed Danish', 2, 4.46, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Mohammed Halai', 2, 4.244, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Moiz Broachwala', 1, 4.587, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Moiz Master', 2, 4.518, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Mufaddal Gheewala', 2, 3.939, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Murtaza Hussain', 4, 3.758, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Mustafa Kanchwala', 4, 3.684, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Mustafa Raja', 1, 4.918, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Mustafa Zirapury', 1, 4.738, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Qasim Hussain', 2, 4.311, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Qusai Lukmanji', 1, 4.372, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Shabbir Halai', 2, 4.482, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Taha Salim', 2, 4.277, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Taha Zirapury', 1, 4.802, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Taher Bohri', 4, 3.551, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Taher Saeed', 3, 3.905, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Usuf Husain', 3, 3.995, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Zoeb Salehbhai', 4, 3.564, true, 1, 7, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Zohair Bharoochwala', 3, 3.83, true, 1, 6, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;

insert into public.players (sport_id, full_name, tier, rating, rating_provisional, tournaments_played, matches_played, claim_status)
select id, 'Zulfi Imani', 1, 4.547, false, 2, 13, 'unclaimed'
from public.sports where slug = 'tennis'
on conflict (sport_id, normalized_name) do update set
  tier = excluded.tier,
  rating = excluded.rating,
  rating_provisional = excluded.rating_provisional,
  tournaments_played = excluded.tournaments_played,
  matches_played = excluded.matches_played;



-- Player tier by season.

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Abbas Cutlerywala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Abdeali Yamani')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Abdeali Yamani')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Adnan Bohri')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ahmed Hussain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ahmed Hussain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ahmed Sihorwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ammar Hussain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ammar Lukmanji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hamza Hussain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hamza Kagalwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hashim Hussain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hatim Jafferji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hatim Jafferji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Humza Boxwalla')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Boxwalla')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Dalal')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Malbari')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Malbari')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Morbiwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Morbiwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzaifa Doctor')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzaifa Doctor')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Raja')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Raja')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Melam Master')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Melam Master')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, p.tier
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('MM Bashir')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mohammed Danish')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mohammed Halai')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Broachwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Broachwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Master')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Master')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Murtaza Hussain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Raja')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Zirapury')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Zirapury')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Qasim Hussain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Qusai Lukmanji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Qusai Lukmanji')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Shabbir Halai')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taha Salim')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taha Zirapury')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taher Bohri')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taher Saeed')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taher Saeed')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Usuf Husain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Usuf Husain')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Zohair Bharoochwala')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2024, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Zulfi Imani')
on conflict (player_id, season_year) do update set tier = excluded.tier;

insert into public.player_season_tiers (player_id, season_year, tier)
select p.id, 2025, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Zulfi Imani')
on conflict (player_id, season_year) do update set tier = excluded.tier;



-- Current player summary stats.

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.918, true, 7, 7, 4, 4, 3, 3, 0, 0, 0, 0, 0, 0, 7, 7, 4, 4, 3, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Raja')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.802, true, 6, 5, 3, 3, 3, 2, 6, 5, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taha Zirapury')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.738, false, 13, 6, 7, 3, 6, 3, 6, 0, 3, 0, 3, 0, 7, 6, 4, 3, 3, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Zirapury')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.679, true, 7, 4, 4, 2, 3, 2, 0, 0, 0, 0, 0, 0, 7, 4, 4, 2, 3, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mohamed Lukmanji')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.616, false, 13, 6, 7, 4, 6, 2, 6, 1, 3, 1, 3, 0, 7, 5, 4, 3, 3, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Raja')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.587, false, 13, 5, 7, 3, 6, 2, 6, 3, 3, 2, 3, 1, 7, 2, 4, 1, 3, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Broachwala')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.554, false, 13, 7, 7, 4, 6, 3, 6, 4, 3, 2, 3, 2, 7, 3, 4, 2, 3, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Gulamhusein')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.547, false, 13, 3, 7, 2, 6, 1, 6, 2, 3, 1, 3, 1, 7, 1, 4, 1, 3, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Zulfi Imani')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.526, false, 13, 7, 7, 4, 6, 3, 6, 5, 3, 2, 3, 3, 7, 2, 4, 2, 3, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ahmed Hussain')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.518, false, 13, 6, 7, 3, 6, 3, 6, 3, 3, 1, 3, 2, 7, 3, 4, 2, 3, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Master')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.508, false, 13, 4, 7, 3, 6, 1, 6, 1, 3, 1, 3, 0, 7, 3, 4, 2, 3, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Melam Master')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.499, false, 13, 5, 7, 2, 6, 3, 6, 4, 3, 1, 3, 3, 7, 1, 4, 1, 3, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Malbari')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.482, true, 7, 7, 4, 4, 3, 3, 0, 0, 0, 0, 0, 0, 7, 7, 4, 4, 3, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Shabbir Halai')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.46, true, 6, 6, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mohammed Danish')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.372, false, 13, 4, 7, 2, 6, 2, 6, 0, 3, 0, 3, 0, 7, 4, 4, 2, 3, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Qusai Lukmanji')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.328, true, 6, 4, 3, 2, 3, 2, 6, 4, 3, 2, 3, 2, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Boxwalla')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.311, true, 6, 5, 3, 2, 3, 3, 6, 5, 3, 2, 3, 3, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Qasim Hussain')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.3, false, 13, 4, 7, 3, 6, 1, 6, 3, 3, 2, 3, 1, 7, 1, 4, 1, 3, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hatim Jafferji')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.277, true, 6, 2, 3, 1, 3, 1, 6, 2, 3, 1, 3, 1, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taha Salim')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.244, true, 7, 4, 4, 1, 3, 3, 0, 0, 0, 0, 0, 0, 7, 4, 4, 1, 3, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mohammed Halai')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.189, true, 6, 6, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ahmed Sihorwala')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.121, true, 6, 6, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hamza Hussain')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.097, false, 13, 10, 6, 5, 7, 5, 6, 4, 3, 2, 3, 2, 7, 6, 3, 3, 4, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Huzaifa Doctor')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 4.043, false, 13, 6, 6, 2, 7, 4, 6, 1, 3, 0, 3, 1, 7, 5, 3, 2, 4, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Morbiwala')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.995, false, 13, 7, 6, 3, 7, 4, 6, 4, 3, 2, 3, 2, 7, 3, 3, 1, 4, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Usuf Husain')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.983, true, 6, 6, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('MM Bashir')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.939, false, 13, 4, 7, 2, 6, 2, 6, 1, 3, 1, 3, 0, 7, 3, 4, 1, 3, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mufaddal Gheewala')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.933, false, 13, 4, 6, 4, 7, 0, 6, 1, 3, 1, 3, 0, 7, 3, 3, 3, 4, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Aliasger Lukmanji')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.905, false, 13, 6, 6, 4, 7, 2, 6, 3, 3, 2, 3, 1, 7, 3, 3, 2, 4, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taher Saeed')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.903, true, 7, 7, 3, 3, 4, 4, 0, 0, 0, 0, 0, 0, 7, 7, 3, 3, 4, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ibrahim Gandhi')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.845, true, 7, 4, 3, 0, 4, 4, 0, 0, 0, 0, 0, 0, 7, 4, 3, 0, 4, 4
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ibrahim Tayeb')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.83, true, 6, 1, 3, 0, 3, 1, 6, 1, 3, 0, 3, 1, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Zohair Bharoochwala')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.781, true, 6, 3, 3, 3, 3, 0, 6, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Humza Boxwalla')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.779, true, 7, 5, 3, 3, 4, 2, 0, 0, 0, 0, 0, 0, 7, 5, 3, 3, 4, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ammar Lukmanji')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.775, false, 13, 2, 6, 1, 7, 1, 6, 1, 3, 1, 3, 0, 7, 1, 3, 0, 4, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Abdeali Yamani')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.758, true, 7, 5, 3, 2, 4, 3, 0, 0, 0, 0, 0, 0, 7, 5, 3, 2, 4, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Murtaza Hussain')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.691, true, 7, 3, 3, 2, 4, 1, 0, 0, 0, 0, 0, 0, 7, 3, 3, 2, 4, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Adnan Bohri')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.684, true, 7, 3, 3, 1, 4, 2, 0, 0, 0, 0, 0, 0, 7, 3, 3, 1, 4, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Kanchwala')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.665, true, 6, 2, 3, 1, 3, 1, 6, 2, 3, 1, 3, 1, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hamza Kagalwala')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.622, true, 6, 3, 3, 1, 3, 2, 6, 3, 3, 1, 3, 2, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Ammar Hussain')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.614, true, 6, 3, 3, 1, 3, 2, 6, 3, 3, 1, 3, 2, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hashim Hussain')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.604, true, 7, 4, 3, 1, 4, 3, 0, 0, 0, 0, 0, 0, 7, 4, 3, 1, 4, 3
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Dalal')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.564, true, 7, 2, 3, 1, 4, 1, 0, 0, 0, 0, 0, 0, 7, 2, 3, 1, 4, 1
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Zoeb Salehbhai')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.551, true, 7, 2, 3, 0, 4, 2, 0, 0, 0, 0, 0, 0, 7, 2, 3, 0, 4, 2
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Burhanuddin Moosabhoy')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.551, true, 7, 0, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 7, 0, 3, 0, 4, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Taher Bohri')
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

insert into public.player_rating_summaries (player_id, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins, matches_2024, wins_2024, singles_matches_2024, singles_wins_2024, doubles_matches_2024, doubles_wins_2024, matches_2025, wins_2025, singles_matches_2025, singles_wins_2025, doubles_matches_2025, doubles_wins_2025)
select p.id, 3.541, true, 6, 3, 3, 0, 3, 3, 6, 3, 3, 0, 3, 3, 0, 0, 0, 0, 0, 0
from public.players p join public.sports s on s.id = p.sport_id
where s.slug = 'tennis' and p.normalized_name = lower('Abbas Cutlerywala')
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



-- Rankings used by the Top Performers leaderboard.

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 1, 4.92, true, 7, 7, 4, 4, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Raja')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 2, 4.80, true, 6, 5, 3, 3, 3, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Taha Zirapury')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 3, 4.74, false, 13, 6, 7, 3, 6, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Zirapury')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 4, 4.68, true, 7, 4, 4, 2, 3, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Mohamed Lukmanji')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 5, 4.62, false, 13, 6, 7, 4, 6, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Raja')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 6, 4.59, false, 13, 5, 7, 3, 6, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Broachwala')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 7, 4.55, false, 13, 7, 7, 4, 6, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Huzefa Gulamhusein')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 8, 4.55, false, 13, 3, 7, 2, 6, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Zulfi Imani')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 9, 4.53, false, 13, 7, 7, 4, 6, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Ahmed Hussain')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 10, 4.52, false, 13, 6, 7, 3, 6, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Moiz Master')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 11, 4.51, false, 13, 4, 7, 3, 6, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Melam Master')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 12, 4.50, false, 13, 5, 7, 2, 6, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Malbari')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 13, 4.48, true, 7, 7, 4, 4, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Shabbir Halai')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 14, 4.46, true, 6, 6, 3, 3, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Mohammed Danish')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 15, 4.37, false, 13, 4, 7, 2, 6, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Qusai Lukmanji')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 16, 4.33, true, 6, 4, 3, 2, 3, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Boxwalla')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 17, 4.31, true, 6, 5, 3, 2, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Qasim Hussain')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 18, 4.30, false, 13, 4, 7, 3, 6, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hatim Jafferji')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 19, 4.28, true, 6, 2, 3, 1, 3, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Taha Salim')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 20, 4.24, true, 7, 4, 4, 1, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Mohammed Halai')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 21, 4.19, true, 6, 6, 3, 3, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Ahmed Sihorwala')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 22, 4.12, true, 6, 6, 3, 3, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hamza Hussain')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 23, 4.10, false, 13, 10, 6, 5, 7, 5
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Huzaifa Doctor')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 24, 4.04, false, 13, 6, 6, 2, 7, 4
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Morbiwala')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 25, 4.00, false, 13, 7, 6, 3, 7, 4
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Usuf Husain')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 26, 3.98, true, 6, 6, 3, 3, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('MM Bashir')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 27, 3.94, false, 13, 4, 7, 2, 6, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Mufaddal Gheewala')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 28, 3.93, false, 13, 4, 6, 4, 7, 0
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Aliasger Lukmanji')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 29, 3.91, false, 13, 6, 6, 4, 7, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Taher Saeed')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 30, 3.90, true, 7, 7, 3, 3, 4, 4
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Ibrahim Gandhi')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 31, 3.85, true, 7, 4, 3, 0, 4, 4
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Ibrahim Tayeb')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 32, 3.83, true, 6, 1, 3, 0, 3, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Zohair Bharoochwala')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 33, 3.78, true, 6, 3, 3, 3, 3, 0
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Humza Boxwalla')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 34, 3.78, true, 7, 5, 3, 3, 4, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Ammar Lukmanji')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 35, 3.78, false, 13, 2, 6, 1, 7, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Abdeali Yamani')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 36, 3.76, true, 7, 5, 3, 2, 4, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Murtaza Hussain')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 37, 3.69, true, 7, 3, 3, 2, 4, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Adnan Bohri')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 38, 3.68, true, 7, 3, 3, 1, 4, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Mustafa Kanchwala')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 39, 3.67, true, 6, 2, 3, 1, 3, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hamza Kagalwala')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 40, 3.62, true, 6, 3, 3, 1, 3, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Ammar Hussain')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 41, 3.61, true, 6, 3, 3, 1, 3, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hashim Hussain')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 42, 3.60, true, 7, 4, 3, 1, 4, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Hussain Dalal')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 43, 3.56, true, 7, 2, 3, 1, 4, 1
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Zoeb Salehbhai')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 44, 3.55, true, 7, 2, 3, 0, 4, 2
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Burhanuddin Moosabhoy')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 45, 3.55, true, 7, 0, 3, 0, 4, 0
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Taher Bohri')
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

insert into public.rankings (sport_id, player_id, ranking_scope, rank, mrsa_rating, provisional, matches_total, wins_total, singles_matches, singles_wins, doubles_matches, doubles_wins)
select s.id, p.id, 'overall', 46, 3.54, true, 6, 3, 3, 0, 3, 3
from public.sports s join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and p.normalized_name = lower('Abbas Cutlerywala')
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



-- Historical matches and participants.

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 1, 2024, 'Doubles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 1 and p.normalized_name = lower('Taha Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 1 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 1 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 1 and p.normalized_name = lower('Taha Salim')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 2, 2024, 'Doubles', 'A', 2, 1, 13, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 2 and p.normalized_name = lower('Ahmed Sihorwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 2 and p.normalized_name = lower('Abbas Cutlerywala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 2 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 2 and p.normalized_name = lower('Humza Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 3, 2024, 'Singles', 'A', 2, 1, 13, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 3 and p.normalized_name = lower('Taha Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 3 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 4, 2024, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 4 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 4 and p.normalized_name = lower('Taha Salim')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 5, 2024, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 5 and p.normalized_name = lower('Ahmed Sihorwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 5 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 6, 2024, 'Singles', 'B', 0, 2, 0, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 6 and p.normalized_name = lower('Abbas Cutlerywala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 6 and p.normalized_name = lower('Humza Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 7, 2024, 'Singles', 'A', 2, 1, 13, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 7 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 7 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 8, 2024, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 8 and p.normalized_name = lower('Zohair Bharoochwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 8 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 9, 2024, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 9 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 9 and p.normalized_name = lower('Mohammed Danish')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 10, 2024, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 10 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 10 and p.normalized_name = lower('Hashim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 11, 2024, 'Doubles', 'B', 0, 2, 1, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 11 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 11 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 11 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 11 and p.normalized_name = lower('Mohammed Danish')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 12, 2024, 'Doubles', 'B', 0, 2, 6, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 12 and p.normalized_name = lower('Zohair Bharoochwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 12 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 12 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 12 and p.normalized_name = lower('Hashim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 13, 2024, 'Doubles', 'B', 0, 2, 6, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 13 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 13 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 13 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 13 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 14, 2024, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 14 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 14 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 15, 2024, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 15 and p.normalized_name = lower('Hamza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 15 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 16, 2024, 'Doubles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 16 and p.normalized_name = lower('Hamza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 16 and p.normalized_name = lower('MM Bashir')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 16 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 16 and p.normalized_name = lower('Hamza Kagalwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 17, 2024, 'Singles', 'B', 0, 2, 0, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 17 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 17 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 18, 2024, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 18 and p.normalized_name = lower('MM Bashir')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 18 and p.normalized_name = lower('Hamza Kagalwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 19, 2024, 'Doubles', 'A', 2, 1, 12, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 19 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 19 and p.normalized_name = lower('Qasim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 19 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 19 and p.normalized_name = lower('Hussain Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 20, 2024, 'Doubles', 'A', 2, 1, 14, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 20 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 20 and p.normalized_name = lower('Ammar Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 20 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 20 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 21, 2024, 'Singles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 21 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 21 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 22, 2024, 'Singles', 'B', 0, 2, 4, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 22 and p.normalized_name = lower('Qasim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 22 and p.normalized_name = lower('Hussain Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 23, 2024, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 23 and p.normalized_name = lower('Ammar Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 23 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 24, 2024, 'Singles', 'A', 2, 1, 13, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 24 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 24 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 25, 2024, 'Doubles', 'A', 2, 1, 12, 6
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 25 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 25 and p.normalized_name = lower('Hamza Kagalwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 25 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 25 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 26, 2024, 'Doubles', 'B', 1, 2, 11, 13
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 26 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 26 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 26 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 26 and p.normalized_name = lower('Hussain Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 27, 2024, 'Singles', 'B', 0, 1, 6, 7
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 27 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 27 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 28, 2024, 'Doubles', 'A', 2, 0, 8, 5
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 28 and p.normalized_name = lower('Taha Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 28 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 28 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 28 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 29, 2024, 'Singles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 29 and p.normalized_name = lower('Taha Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 29 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 30, 2024, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 30 and p.normalized_name = lower('Ahmed Sihorwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 30 and p.normalized_name = lower('Zohair Bharoochwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 31, 2024, 'Doubles', 'A', 2, 1, 13, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 31 and p.normalized_name = lower('Ahmed Sihorwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 31 and p.normalized_name = lower('Abbas Cutlerywala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 31 and p.normalized_name = lower('Zohair Bharoochwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 31 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 32, 2024, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 32 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 32 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 33, 2024, 'Singles', 'B', 0, 2, 1, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 33 and p.normalized_name = lower('Abbas Cutlerywala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 33 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 34, 2024, 'Doubles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 34 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 34 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 34 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 34 and p.normalized_name = lower('Qasim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 35, 2024, 'Singles', 'B', 0, 2, 3, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 35 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 35 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 36, 2024, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 36 and p.normalized_name = lower('Hamza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 36 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 37, 2024, 'Doubles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 37 and p.normalized_name = lower('Hamza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 37 and p.normalized_name = lower('MM Bashir')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 37 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 37 and p.normalized_name = lower('Ammar Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 38, 2024, 'Singles', 'B', 0, 2, 4, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 38 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 38 and p.normalized_name = lower('Qasim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 39, 2024, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 39 and p.normalized_name = lower('MM Bashir')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 39 and p.normalized_name = lower('Ammar Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 40, 2024, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 40 and p.normalized_name = lower('Taha Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 40 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 41, 2024, 'Doubles', 'B', 0, 2, 1, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 41 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 41 and p.normalized_name = lower('Taha Salim')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 41 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 41 and p.normalized_name = lower('Mohammed Danish')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 42, 2024, 'Singles', 'B', 0, 1, 12, 14
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 42 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 42 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 43, 2024, 'Doubles', 'B', 0, 2, 3, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 43 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 43 and p.normalized_name = lower('Hamza Kagalwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 43 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 43 and p.normalized_name = lower('Ammar Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 44, 2024, 'Doubles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 44 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 44 and p.normalized_name = lower('Taha Salim')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 44 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 44 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 45, 2024, 'Singles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 45 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 45 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 46, 2024, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 46 and p.normalized_name = lower('Hamza Kagalwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 46 and p.normalized_name = lower('Ammar Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 47, 2024, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 47 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 47 and p.normalized_name = lower('Zohair Bharoochwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 48, 2024, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 48 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 48 and p.normalized_name = lower('Qasim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 49, 2024, 'Doubles', 'B', 1, 2, 6, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 49 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 49 and p.normalized_name = lower('Humza Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 49 and p.normalized_name = lower('Zohair Bharoochwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 49 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 50, 2024, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 50 and p.normalized_name = lower('Taha Salim')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 50 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 51, 2024, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 51 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 51 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 52, 2024, 'Singles', 'A', 2, 1, 14, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 52 and p.normalized_name = lower('Humza Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 52 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 53, 2024, 'Doubles', 'B', 1, 2, 14, 16
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 53 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 53 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 53 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 53 and p.normalized_name = lower('Qasim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 54, 2024, 'Doubles', 'B', 0, 2, 4, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 54 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 54 and p.normalized_name = lower('Humza Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 54 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 54 and p.normalized_name = lower('Hashim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 55, 2024, 'Singles', 'B', 0, 2, 0, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 55 and p.normalized_name = lower('Taha Salim')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 55 and p.normalized_name = lower('Mohammed Danish')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 56, 2024, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 56 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 56 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 57, 2024, 'Singles', 'A', 2, 1, 13, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 57 and p.normalized_name = lower('Humza Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 57 and p.normalized_name = lower('Hashim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 58, 2024, 'Doubles', 'B', 1, 2, 14, 17
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 58 and p.normalized_name = lower('Taha Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 58 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 58 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 58 and p.normalized_name = lower('Mohammed Danish')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 59, 2024, 'Doubles', 'A', 2, 1, 12, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 59 and p.normalized_name = lower('Ahmed Sihorwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 59 and p.normalized_name = lower('Abbas Cutlerywala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 59 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 59 and p.normalized_name = lower('Hashim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 60, 2024, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 60 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 60 and p.normalized_name = lower('Mohammed Danish')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 61, 2024, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 61 and p.normalized_name = lower('Ahmed Sihorwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 61 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 62, 2024, 'Singles', 'B', 1, 2, 10, 14
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 62 and p.normalized_name = lower('Abbas Cutlerywala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 62 and p.normalized_name = lower('Hashim Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 63, 2024, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 63 and p.normalized_name = lower('Hamza Kagalwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 63 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 64, 2024, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 64 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 64 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 65, 2024, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 65 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 65 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 66, 2024, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 66 and p.normalized_name = lower('MM Bashir')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 66 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 67, 2024, 'Doubles', 'B', 0, 2, 3, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 67 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 67 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 67 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 67 and p.normalized_name = lower('Hussain Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 68, 2024, 'Doubles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 68 and p.normalized_name = lower('MM Bashir')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 68 and p.normalized_name = lower('Hamza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 68 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 68 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 69, 2024, 'Singles', 'A', 2, 1, 14, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 69 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 69 and p.normalized_name = lower('Hussain Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 70, 2024, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 70 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 70 and p.normalized_name = lower('Hussain Boxwalla')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 71, 2024, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 71 and p.normalized_name = lower('Hamza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 71 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 72, 2024, 'Singles', 'B', 1, 2, 10, 14
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 72 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 72 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 73, 2025, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 73 and p.normalized_name = lower('Mustafa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 73 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 74, 2025, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 74 and p.normalized_name = lower('Mohammed Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 74 and p.normalized_name = lower('Shabbir Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 75, 2025, 'Doubles', 'A', 2, 1, 14, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 75 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 75 and p.normalized_name = lower('Hussain Dalal')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 75 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 75 and p.normalized_name = lower('Murtaza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 76, 2025, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 76 and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 76 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 77, 2025, 'Singles', 'A', 2, 1, 13, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 77 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 77 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 78, 2025, 'Doubles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 78 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 78 and p.normalized_name = lower('Taher Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 78 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 78 and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 79, 2025, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 79 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 79 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 80, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 80 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 80 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 81, 2025, 'Doubles', 'B', 0, 2, 3, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 81 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 81 and p.normalized_name = lower('Adnan Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 81 and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 81 and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 82, 2025, 'Singles', 'B', 1, 2, 8, 14
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 82 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 82 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 83, 2025, 'Singles', 'A', 2, 1, 12, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 83 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 83 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 84, 2025, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 84 and p.normalized_name = lower('Mustafa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 84 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 85, 2025, 'Singles', 'A', 2, 1, 13, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 85 and p.normalized_name = lower('Mohammed Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 85 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 86, 2025, 'Doubles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 86 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 86 and p.normalized_name = lower('Hussain Dalal')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 86 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 86 and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 87, 2025, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 87 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 87 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 88, 2025, 'Singles', 'A', 2, 1, 15, 13
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 88 and p.normalized_name = lower('Shabbir Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 88 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 89, 2025, 'Doubles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 89 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 89 and p.normalized_name = lower('Murtaza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 89 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 89 and p.normalized_name = lower('Adnan Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 90, 2025, 'Singles', 'A', 2, 1, 14, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 90 and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 90 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 91, 2025, 'Singles', 'B', 0, 2, 4, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 91 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 91 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 92, 2025, 'Doubles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 92 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 92 and p.normalized_name = lower('Taher Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 92 and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 92 and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 93, 2025, 'Doubles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 93 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 93 and p.normalized_name = lower('Ammar Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 93 and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 93 and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 94, 2025, 'Singles', 'B', 1, 2, 12, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 94 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 94 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 95, 2025, 'Singles', 'A', 2, 1, 13, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 95 and p.normalized_name = lower('Hussain Dalal')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 95 and p.normalized_name = lower('Taher Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 96, 2025, 'Doubles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 96 and p.normalized_name = lower('Mustafa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 96 and p.normalized_name = lower('Mohammed Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 96 and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 96 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 97, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 97 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 97 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 98, 2025, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 98 and p.normalized_name = lower('Murtaza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 98 and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 99, 2025, 'Doubles', 'A', 2, 1, 14, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 99 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 99 and p.normalized_name = lower('Shabbir Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 99 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 99 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 100, 2025, 'Singles', 'B', 1, 2, 8, 14
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 100 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 100 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 101, 2025, 'Singles', 'B', 1, 2, 10, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 101 and p.normalized_name = lower('Adnan Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 101 and p.normalized_name = lower('Ammar Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 102, 2025, 'Doubles', 'A', 2, 1, 14, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 102 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 102 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 102 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 102 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 103, 2025, 'Singles', 'B', 0, 2, 4, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 103 and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 103 and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 104, 2025, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 104 and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 104 and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 105, 2025, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 105 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 105 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 106, 2025, 'Singles', 'B', 0, 2, 4, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 106 and p.normalized_name = lower('Hussain Dalal')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 106 and p.normalized_name = lower('Adnan Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 107, 2025, 'Doubles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 107 and p.normalized_name = lower('Mustafa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 107 and p.normalized_name = lower('Mohammed Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 107 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 107 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 108, 2025, 'Singles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 108 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 108 and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 109, 2025, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 109 and p.normalized_name = lower('Shabbir Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 109 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 110, 2025, 'Doubles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 110 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 110 and p.normalized_name = lower('Murtaza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 110 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 110 and p.normalized_name = lower('Taher Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 111, 2025, 'Singles', 'B', 1, 2, 11, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 111 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 111 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 112, 2025, 'Singles', 'B', 1, 2, 7, 14
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 112 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 112 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 113, 2025, 'Doubles', 'B', 0, 2, 1, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 113 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 113 and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 113 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 113 and p.normalized_name = lower('Ammar Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 114, 2025, 'Doubles', 'A', 2, 1, 16, 15
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 114 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 114 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 114 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 114 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 115, 2025, 'Singles', 'A', 2, 1, 14, 9
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 115 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 115 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 116, 2025, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 116 and p.normalized_name = lower('Hussain Dalal')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 116 and p.normalized_name = lower('Ammar Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 117, 2025, 'Doubles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 117 and p.normalized_name = lower('Mustafa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 117 and p.normalized_name = lower('Mohammed Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 117 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 117 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 118, 2025, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 118 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 118 and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 119, 2025, 'Singles', 'B', 0, 2, 0, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 119 and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 119 and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 120, 2025, 'Doubles', 'B', 1, 2, 10, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 120 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 120 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 120 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 120 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 121, 2025, 'Singles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 121 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 121 and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 122, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 122 and p.normalized_name = lower('Murtaza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 122 and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 123, 2025, 'Doubles', 'A', 2, 1, 11, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 123 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 123 and p.normalized_name = lower('Shabbir Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 123 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 123 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 124, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 124 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 124 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 125, 2025, 'Singles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 125 and p.normalized_name = lower('Taher Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 125 and p.normalized_name = lower('Adnan Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 126, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 126 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 126 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 127, 2025, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 127 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 127 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 128, 2025, 'Doubles', 'A', 2, 1, 12, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 128 and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 128 and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 128 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 128 and p.normalized_name = lower('Ammar Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 129, 2025, 'Singles', 'A', 2, 0, 8, 1
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 129 and p.normalized_name = lower('Mustafa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 129 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 130, 2025, 'Singles', 'B', 1, 2, 8, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 130 and p.normalized_name = lower('Mohammed Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 130 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 131, 2025, 'Doubles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 131 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 131 and p.normalized_name = lower('Hussain Dalal')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 131 and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 131 and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 132, 2025, 'Doubles', 'B', 1, 2, 11, 13
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 132 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 132 and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 132 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 132 and p.normalized_name = lower('Adnan Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 133, 2025, 'Doubles', 'A', 2, 1, 15, 11
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 133 and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 133 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 133 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 133 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 134, 2025, 'Singles', 'A', 2, 0, 8, 0
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 134 and p.normalized_name = lower('Mustafa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 134 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 135, 2025, 'Singles', 'B', 0, 2, 0, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 135 and p.normalized_name = lower('Mohammed Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 135 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 136, 2025, 'Doubles', 'B', 0, 2, 5, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 136 and p.normalized_name = lower('Hussain Morbiwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 136 and p.normalized_name = lower('Hussain Dalal')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 136 and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 136 and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 137, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 137 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 137 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 138, 2025, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 138 and p.normalized_name = lower('Shabbir Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 138 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 139, 2025, 'Doubles', 'A', 2, 1, 11, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 139 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 139 and p.normalized_name = lower('Murtaza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 139 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 139 and p.normalized_name = lower('Ammar Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 140, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 140 and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 140 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 141, 2025, 'Singles', 'B', 0, 2, 6, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 141 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 141 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 142, 2025, 'Doubles', 'B', 1, 2, 7, 14
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 142 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 142 and p.normalized_name = lower('Taher Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 142 and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 142 and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 143, 2025, 'Singles', 'B', 0, 2, 0, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 143 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 143 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 144, 2025, 'Singles', 'A', 2, 1, 13, 9
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 144 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 144 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 145, 2025, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 145 and p.normalized_name = lower('Huzaifa Doctor')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 145 and p.normalized_name = lower('Ibrahim Tayeb')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 146, 2025, 'Singles', 'B', 0, 2, 1, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 146 and p.normalized_name = lower('Murtaza Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 146 and p.normalized_name = lower('Ibrahim Gandhi')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 147, 2025, 'Doubles', 'A', 2, 1, 13, 9
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 147 and p.normalized_name = lower('Mustafa Zirapury')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 147 and p.normalized_name = lower('Shabbir Halai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 147 and p.normalized_name = lower('Qusai Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 147 and p.normalized_name = lower('Huzefa Raja')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 148, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 148 and p.normalized_name = lower('Taher Saeed')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 148 and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 149, 2025, 'Singles', 'A', 2, 1, 11, 10
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 149 and p.normalized_name = lower('Zoeb Salehbhai')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 149 and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 150, 2025, 'Doubles', 'B', 1, 2, 10, 13
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 150 and p.normalized_name = lower('Zulfi Imani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 150 and p.normalized_name = lower('Hatim Jafferji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 150 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 150 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 151, 2025, 'Singles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 151 and p.normalized_name = lower('Aliasger Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 151 and p.normalized_name = lower('Usuf Husain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 152, 2025, 'Singles', 'B', 0, 2, 2, 8
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 152 and p.normalized_name = lower('Taher Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 152 and p.normalized_name = lower('Ammar Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 153, 2025, 'Doubles', 'A', 2, 0, 8, 4
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 153 and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 153 and p.normalized_name = lower('Mufaddal Gheewala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 153 and p.normalized_name = lower('Hussain Malbari')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 153 and p.normalized_name = lower('Ahmed Hussain')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 154, 2025, 'Singles', 'A', 2, 0, 8, 2
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 154 and p.normalized_name = lower('Melam Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 154 and p.normalized_name = lower('Moiz Broachwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 155, 2025, 'Singles', 'A', 2, 0, 8, 3
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 155 and p.normalized_name = lower('Moiz Master')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 155 and p.normalized_name = lower('Huzefa Gulamhusein')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.matches (sport_id, historical_match_number, season_year, format, winner_side, sets_a, sets_b, games_a, games_b)
select id, 156, 2025, 'Doubles', 'B', 1, 2, 11, 12
from public.sports where slug = 'tennis'
on conflict (sport_id, season_year, historical_match_number) do update set
  format = excluded.format,
  winner_side = excluded.winner_side,
  sets_a = excluded.sets_a,
  sets_b = excluded.sets_b,
  games_a = excluded.games_a,
  games_b = excluded.games_b;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 156 and p.normalized_name = lower('Abdeali Yamani')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'A', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 156 and p.normalized_name = lower('Adnan Bohri')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 1
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 156 and p.normalized_name = lower('Mustafa Kanchwala')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;

insert into public.match_participants (match_id, player_id, side, slot)
select m.id, p.id, 'B', 2
from public.matches m
join public.sports s on s.id = m.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 156 and p.normalized_name = lower('Burhanuddin Moosabhoy')
on conflict (match_id, side, slot) do update set player_id = excluded.player_id;



-- Historical rating movement per match.

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Zirapury / Moiz Master', 'Zulfi Imani / Taha Salim', 4.4, 4.4, 0.5, 0.839, 'A full / B damped', 0.25, 0.01174, -0.00294, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 1
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taher Saeed', 'Hashim Hussain', 3.6, 3.6, 0.5, 0.839, 'A full / B damped', 0.25, 0.11742, -0.02935, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 10
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzefa Raja / Melam Master', 'Hussain Malbari / Mohammed Danish', 4.4, 4.4, 0.5, 0.839, 'B full / A damped', 0.25, -0.00294, 0.01174, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 11
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zohair Bharoochwala / Taher Saeed', 'Usuf Husain / Hashim Hussain', 3.808, 3.736, 0.591, 0.256, 'B full / A damped', 0.25, -0.00106, 0.00424, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 12
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury / Qusai Lukmanji', 'Moiz Broachwala / Hatim Jafferji', 4.4, 4.4, 0.5, 0.256, 'B full / A damped', 0.25, -0.0009, 0.00359, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 13
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury', 'Moiz Broachwala', 4.599, 4.604, 0.4943, 0.358, 'B full / A damped', 0.25, -0.0124, 0.04959, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 14
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hamza Hussain', 'Hussain Morbiwala', 3.9, 3.9, 0.5, 0.839, 'A full / B damped', 0.25, 0.11742, -0.02935, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 15
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hamza Hussain / MM Bashir', 'Hussain Morbiwala / Hamza Kagalwala', 3.808, 3.736, 0.591, 1, 'A full / B damped', 0.25, 0.01145, -0.00286, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 16
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Qusai Lukmanji', 'Hatim Jafferji', 4.199, 4.204, 0.4943, 1, 'B full / A damped', 0.25, -0.0346, 0.13841, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 17
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'MM Bashir', 'Hamza Kagalwala', 3.611, 3.597, 0.5181, 1, 'A full / B damped', 0.25, 0.13493, -0.03373, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 18
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Hussain / Qasim Hussain', 'Huzefa Gulamhusein / Hussain Boxwalla', 4.4, 4.4, 0.5, 0.2, 'A full / B damped', 0.25, 0.0028, -0.0007, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 19
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Sihorwala / Abbas Cutlerywala', 'Abdeali Yamani / Humza Boxwalla', 3.75, 3.75, 0.5, 0.366, 'A full / B damped', 0.25, 0.00513, -0.00128, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 2
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor / Ammar Hussain', 'Mufaddal Gheewala / Aliasger Lukmanji', 3.75, 3.75, 0.5, 0.285, 'A full / B damped', 0.25, 0.00399, -0.001, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 20
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Hussain', 'Huzefa Gulamhusein', 4.603, 4.599, 0.5044, 0.463, 'A full / B damped', 0.25, 0.06431, -0.01608, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 21
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Qasim Hussain', 'Hussain Boxwalla', 4.203, 4.199, 0.5044, 0.463, 'B full / A damped', 0.25, -0.01637, 0.06546, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 22
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ammar Hussain', 'Aliasger Lukmanji', 3.604, 3.599, 0.5063, 0.699, 'A full / B damped', 0.25, 0.09667, -0.02417, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 23
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor', 'Mufaddal Gheewala', 3.904, 3.899, 0.5063, 0.2, 'A full / B damped', 0.25, 0.02765, -0.00691, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 24
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala / Hamza Kagalwala', 'Mufaddal Gheewala / Aliasger Lukmanji', 3.716, 3.734, 0.4778, 0.463, 'A full / B damped', 0.25, 0.00678, -0.00169, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 25
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Broachwala / Hatim Jafferji', 'Huzefa Gulamhusein / Hussain Boxwalla', 4.496, 4.424, 0.5912, 0.2, 'B full / A damped', 0.25, -0.00083, 0.00331, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 26
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala', 'Mufaddal Gheewala', 3.876, 3.891, 0.4809, 0.2, 'B full / A damped', 0.273, -0.00734, 0.02693, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 27
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Zirapury / Moiz Master', 'Huzefa Raja / Melam Master', 4.412, 4.397, 0.5186, 0.358, 'A full / B damped', 0.25, 0.00483, -0.00121, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 28
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Zirapury', 'Huzefa Raja', 4.616, 4.596, 0.526, 0.463, 'A full / B damped', 0.25, 0.06151, -0.01538, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 29
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Zirapury', 'Zulfi Imani', 4.676, 4.597, 0.5999, 0.24, 'A full / B damped', 0.25, 0.02692, -0.00673, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 3
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Sihorwala', 'Zohair Bharoochwala', 3.905, 3.899, 0.5078, 0.839, 'A full / B damped', 0.25, 0.11558, -0.02889, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 30
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Sihorwala / Abbas Cutlerywala', 'Zohair Bharoochwala / Taher Saeed', 3.812, 3.792, 0.5254, 0.2, 'A full / B damped', 0.25, 0.00266, -0.00066, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 31
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Master', 'Melam Master', 4.216, 4.196, 0.526, 0.699, 'B full / A damped', 0.25, -0.02575, 0.10301, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 32
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abbas Cutlerywala', 'Taher Saeed', 3.608, 3.711, 0.3707, 0.839, 'B full / A damped', 0.25, -0.02176, 0.08705, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 33
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury / Qusai Lukmanji', 'Ahmed Hussain / Qasim Hussain', 4.376, 4.426, 0.4362, 0.358, 'B full / A damped', 0.25, -0.00109, 0.00438, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 34
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury', 'Ahmed Hussain', 4.586, 4.669, 0.3949, 0.576, 'B full / A damped', 0.273, -0.01737, 0.06368, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 35
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hamza Hussain', 'Huzaifa Doctor', 4.025, 3.931, 0.6183, 0.699, 'A full / B damped', 0.25, 0.07474, -0.01869, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 36
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hamza Hussain / MM Bashir', 'Huzaifa Doctor / Ammar Hussain', 3.92, 3.805, 0.6422, 0.839, 'A full / B damped', 0.261, 0.0084, -0.0022, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 37
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Qusai Lukmanji', 'Qasim Hussain', 4.164, 4.191, 0.4659, 0.463, 'B full / A damped', 0.273, -0.01649, 0.06047, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 38
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'MM Bashir', 'Ammar Hussain', 3.75, 3.695, 0.5696, 0.576, 'A full / B damped', 0.273, 0.0694, -0.01893, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 39
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Master', 'Taha Salim', 4.191, 4.197, 0.4919, 1, 'A full / B damped', 0.25, 0.14228, -0.03557, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 4
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Zirapury', 'Hussain Malbari', 4.701, 4.612, 0.6125, 1, 'A full / B damped', 0.25, 0.1085, -0.02712, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 40
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani / Taha Salim', 'Hussain Malbari / Mohammed Danish', 4.376, 4.398, 0.4722, 0.839, 'B full / A damped', 0.25, -0.00277, 0.01109, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 41
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala', 'Huzaifa Doctor', 3.869, 3.91, 0.4481, 0.2, 'B full / A damped', 0.333, -0.00836, 0.02509, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 42
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala / Hamza Kagalwala', 'Huzaifa Doctor / Ammar Hussain', 3.716, 3.805, 0.389, 0.576, 'B full / A damped', 0.329, -0.00206, 0.00627, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 43
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani / Taha Salim', 'Huzefa Raja / Melam Master', 4.374, 4.439, 0.4176, 0.576, 'A full / B damped', 0.273, 0.00939, -0.00256, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 44
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani', 'Huzefa Raja', 4.597, 4.579, 0.5239, 0.463, 'A full / B damped', 0.333, 0.06178, -0.02059, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 45
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hamza Kagalwala', 'Ammar Hussain', 3.569, 3.68, 0.3617, 0.839, 'A full / B damped', 0.385, 0.14989, -0.05765, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 46
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abdeali Yamani', 'Zohair Bharoochwala', 3.899, 3.87, 0.5363, 0.699, 'A full / B damped', 0.273, 0.0908, -0.02476, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 47
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hatim Jafferji', 'Qasim Hussain', 4.337, 4.251, 0.6087, 0.358, 'B full / A damped', 0.273, -0.01665, 0.06106, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 48
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abdeali Yamani / Humza Boxwalla', 'Zohair Bharoochwala / Taher Saeed', 3.793, 3.82, 0.4653, 0.463, 'B full / A damped', 0.25, -0.00151, 0.00604, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 49
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Sihorwala', 'Abdeali Yamani', 4.02, 3.985, 0.5438, 0.839, 'A full / B damped', 0.273, 0.10713, -0.02922, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 5
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Salim', 'Melam Master', 4.17, 4.293, 0.3467, 1, 'A full / B damped', 0.333, 0.18293, -0.06098, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 50
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Broachwala', 'Ahmed Hussain', 4.651, 4.73, 0.3994, 0.699, 'A full / B damped', 0.333, 0.1176, -0.0392, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 51
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Humza Boxwalla', 'Taher Saeed', 3.597, 3.798, 0.2634, 0.285, 'A full / B damped', 0.385, 0.05884, -0.02263, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 52
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Broachwala / Hatim Jafferji', 'Ahmed Hussain / Qasim Hussain', 4.541, 4.499, 0.5535, 0.2, 'B full / A damped', 0.333, -0.00103, 0.0031, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 53
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abdeali Yamani / Humza Boxwalla', 'Usuf Husain / Hashim Hussain', 3.805, 3.74, 0.5824, 0.463, 'B full / A damped', 0.303, -0.00229, 0.00756, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 54
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Salim', 'Mohammed Danish', 4.349, 4.222, 0.657, 1, 'B full / A damped', 0.385, -0.07075, 0.18396, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 55
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abdeali Yamani', 'Usuf Husain', 3.952, 3.912, 0.5517, 0.699, 'B full / A damped', 0.385, -0.04155, 0.10804, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 56
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Humza Boxwalla', 'Hashim Hussain', 3.652, 3.583, 0.587, 0.2, 'A full / B damped', 0.273, 0.02313, -0.00631, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 57
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taha Zirapury / Moiz Master', 'Hussain Malbari / Mohammed Danish', 4.568, 4.499, 0.5871, 0.2, 'B full / A damped', 0.359, -0.00118, 0.00329, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 58
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Sihorwala / Abbas Cutlerywala', 'Usuf Husain / Hashim Hussain', 3.854, 3.797, 0.5721, 0.324, 'A full / B damped', 0.303, 0.00388, -0.00118, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 59
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abbas Cutlerywala', 'Humza Boxwalla', 3.59, 3.674, 0.3946, 1, 'B full / A damped', 0.333, -0.03683, 0.1105, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 6
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Master', 'Mohammed Danish', 4.328, 4.404, 0.4044, 0.358, 'B full / A damped', 0.385, -0.0156, 0.04057, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 60
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Sihorwala', 'Usuf Husain', 4.124, 4.015, 0.6359, 0.699, 'A full / B damped', 0.333, 0.0713, -0.02377, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 61
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abbas Cutlerywala', 'Hashim Hussain', 3.554, 3.577, 0.4714, 0.285, 'B full / A damped', 0.385, -0.01448, 0.03766, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 62
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hamza Kagalwala', 'Aliasger Lukmanji', 3.717, 3.574, 0.6753, 0.699, 'B full / A damped', 0.385, -0.05086, 0.13223, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 63
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Broachwala', 'Huzefa Gulamhusein', 4.762, 4.587, 0.7103, 0.358, 'B full / A damped', 0.385, -0.02741, 0.07126, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 64
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury', 'Huzefa Gulamhusein', 4.569, 4.657, 0.3895, 0.358, 'B full / A damped', 0.333, -0.01303, 0.03908, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 65
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'MM Bashir', 'Mufaddal Gheewala', 3.815, 3.917, 0.3724, 1, 'A full / B damped', 0.333, 0.17573, -0.05858, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 66
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury / Qusai Lukmanji', 'Huzefa Gulamhusein / Hussain Boxwalla', 4.353, 4.48, 0.3429, 0.576, 'B full / A damped', 0.359, -0.00198, 0.00553, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 67
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'MM Bashir / Hamza Hussain', 'Mufaddal Gheewala / Aliasger Lukmanji', 4.043, 3.782, 0.7917, 0.576, 'A full / B damped', 0.359, 0.00336, -0.00121, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 68
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hatim Jafferji', 'Hussain Boxwalla', 4.316, 4.271, 0.557, 0.227, 'A full / B damped', 0.333, 0.02812, -0.00937, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 69
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzefa Raja', 'Hussain Malbari', 4.559, 4.599, 0.4485, 0.2, 'A full / B damped', 0.333, 0.03088, -0.01029, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 7
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Qusai Lukmanji', 'Hussain Boxwalla', 4.148, 4.26, 0.3596, 0.699, 'B full / A damped', 0.385, -0.02709, 0.07043, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 70
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hamza Hussain', 'Aliasger Lukmanji', 4.104, 3.702, 0.8866, 0.699, 'A full / B damped', 0.385, 0.02221, -0.00854, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 71
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani', 'Hussain Malbari', 4.658, 4.589, 0.5871, 0.285, 'B full / A damped', 0.385, -0.01804, 0.0469, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 72
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zohair Bharoochwala', 'Usuf Husain', 3.853, 3.989, 0.3325, 0.699, 'B full / A damped', 0.385, -0.02504, 0.06511, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 8
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Melam Master', 'Mohammed Danish', 4.232, 4.439, 0.2571, 0.358, 'B full / A damped', 0.385, -0.00992, 0.02579, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2024 and m.historical_match_number = 9
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abdeali Yamani', 'Usuf Husain', 3.91, 4.051, 0.3272, 0.403, 'B full / A damped', 0.429, -0.01581, 0.03689, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 100
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Adnan Bohri', 'Ammar Lukmanji', 3.6, 3.6, 0.5, 0.2, 'B full / A damped', 0.25, -0.007, 0.028, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 101
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Melam Master / Moiz Master', 'Hussain Malbari / Ahmed Hussain', 4.266, 4.663, 0.1156, 0.227, 'A full / B damped', 0.429, 0.00561, -0.00241, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 102
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ibrahim Tayeb', 'Mustafa Kanchwala', 3.9, 3.6, 0.8227, 0.463, 'B full / A damped', 0.25, -0.02669, 0.10677, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 103
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ibrahim Gandhi', 'Burhanuddin Moosabhoy', 3.6, 3.6, 0.5, 1, 'A full / B damped', 0.25, 0.14, -0.035, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 104
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala', 'Abdeali Yamani', 3.86, 3.895, 0.4554, 1, 'A full / B damped', 0.467, 0.15249, -0.07116, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 105
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Dalal', 'Adnan Bohri', 3.6, 3.593, 0.5088, 0.463, 'B full / A damped', 0.25, -0.01651, 0.06602, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 106
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Raja / Mohammed Halai', 'Melam Master / Moiz Master', 4.4, 4.273, 0.6574, 0.699, 'A full / B damped', 0.467, 0.00671, -0.00313, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 107
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury', 'Mohamed Lukmanji', 4.556, 4.6, 0.4434, 0.463, 'A full / B damped', 0.25, 0.07222, -0.01806, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 108
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Shabbir Halai', 'Mufaddal Gheewala', 4.2, 3.859, 0.8515, 0.839, 'A full / B damped', 0.429, 0.03487, -0.01495, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 109
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor / Murtaza Hussain', 'Aliasger Lukmanji / Taher Bohri', 3.77, 3.646, 0.6539, 0.576, 'A full / B damped', 0.339, 0.00558, -0.00189, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 110
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani', 'Hussain Malbari', 4.639, 4.633, 0.5083, 0.2, 'B full / A damped', 0.429, -0.0122, 0.02846, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 111
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hatim Jafferji', 'Ahmed Hussain', 4.341, 4.684, 0.1472, 0.463, 'B full / A damped', 0.429, -0.00818, 0.0191, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 112
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taher Saeed / Zoeb Salehbhai', 'Usuf Husain / Ammar Lukmanji', 3.686, 3.856, 0.2954, 0.839, 'B full / A damped', 0.339, -0.00235, 0.00694, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 113
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Qusai Lukmanji / Huzefa Raja', 'Moiz Broachwala / Huzefa Gulamhusein', 4.356, 4.715, 0.1371, 0.2, 'A full / B damped', 0.429, 0.00483, -0.00207, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 114
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala', 'Usuf Husain', 4.01, 4.09, 0.3997, 0.344, 'A full / B damped', 0.5, 0.05776, -0.02888, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 115
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Dalal', 'Ammar Lukmanji', 3.584, 3.634, 0.4361, 0.699, 'B full / A damped', 0.25, -0.02135, 0.0854, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 116
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Raja / Mohammed Halai', 'Hussain Malbari / Ahmed Hussain', 4.407, 4.677, 0.2008, 0.699, 'A full / B damped', 0.5, 0.01565, -0.00782, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 117
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taher Saeed', 'Ibrahim Tayeb', 3.771, 3.874, 0.3714, 0.699, 'A full / B damped', 0.25, 0.12309, -0.03077, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 118
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zoeb Salehbhai', 'Ibrahim Gandhi', 3.598, 3.737, 0.3287, 1, 'B full / A damped', 0.25, -0.02301, 0.09204, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 119
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani / Hatim Jafferji', 'Qusai Lukmanji / Huzefa Raja', 4.478, 4.361, 0.6453, 0.2, 'B full / A damped', 0.467, -0.00169, 0.00361, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 120
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor', 'Mustafa Kanchwala', 3.945, 3.705, 0.7739, 0.463, 'A full / B damped', 0.25, 0.02934, -0.00733, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 121
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Murtaza Hussain', 'Burhanuddin Moosabhoy', 3.606, 3.566, 0.5508, 0.576, 'A full / B damped', 0.25, 0.07243, -0.01811, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 122
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury / Shabbir Halai', 'Moiz Broachwala / Huzefa Gulamhusein', 4.431, 4.71, 0.193, 0.2, 'A full / B damped', 0.467, 0.00452, -0.00211, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 123
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Aliasger Lukmanji', 'Abdeali Yamani', 3.692, 3.825, 0.3356, 0.576, 'A full / B damped', 0.5, 0.10713, -0.05357, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 124
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taher Bohri', 'Adnan Bohri', 3.598, 3.658, 0.424, 0.358, 'B full / A damped', 0.25, -0.01063, 0.04254, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 125
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Qusai Lukmanji', 'Hussain Malbari', 4.14, 4.651, 0.068, 0.576, 'A full / B damped', 0.529, 0.15027, -0.07956, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 126
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzefa Raja', 'Ahmed Hussain', 4.59, 4.681, 0.3867, 0.699, 'A full / B damped', 0.529, 0.1201, -0.06358, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 127
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ibrahim Tayeb / Ibrahim Gandhi', 'Usuf Husain / Ammar Lukmanji', 3.834, 3.887, 0.4329, 0.2, 'A full / B damped', 0.401, 0.00318, -0.00127, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 128
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Raja', 'Moiz Broachwala', 4.622, 4.725, 0.3708, 0.839, 'A full / B damped', 0.5, 0.14777, -0.07388, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 129
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohammed Halai', 'Huzefa Gulamhusein', 4.222, 4.685, 0.0857, 0.324, 'B full / A damped', 0.25, -0.00194, 0.00778, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 130
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala / Hussain Dalal', 'Mustafa Kanchwala / Burhanuddin Moosabhoy', 3.814, 3.622, 0.7274, 0.576, 'A full / B damped', 0.25, 0.0044, -0.0011, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 131
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taher Saeed / Zoeb Salehbhai', 'Abdeali Yamani / Adnan Bohri', 3.735, 3.736, 0.4979, 0.2, 'B full / A damped', 0.375, -0.00105, 0.00279, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 132
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohamed Lukmanji / Mufaddal Gheewala', 'Melam Master / Moiz Master', 4.217, 4.271, 0.4311, 0.27, 'A full / B damped', 0.5, 0.0043, -0.00215, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 133
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Raja', 'Qusai Lukmanji', 4.766, 4.296, 0.9172, 1, 'A full / B damped', 0.529, 0.02318, -0.01227, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 134
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohammed Halai', 'Huzefa Raja', 4.22, 4.7, 0.0788, 1, 'B full / A damped', 0.273, -0.00601, 0.02205, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 135
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala / Hussain Dalal', 'Ibrahim Tayeb / Ibrahim Gandhi', 3.818, 3.837, 0.4755, 0.358, 'B full / A damped', 0.401, -0.00191, 0.00477, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 136
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury', 'Hussain Malbari', 4.631, 4.573, 0.5749, 0.576, 'A full / B damped', 0.556, 0.06855, -0.03808, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 137
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Shabbir Halai', 'Ahmed Hussain', 4.238, 4.609, 0.1306, 0.699, 'A full / B damped', 0.556, 0.17024, -0.09458, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 138
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor / Murtaza Hussain', 'Usuf Husain / Ammar Lukmanji', 3.825, 3.885, 0.424, 0.2, 'A full / B damped', 0.444, 0.00323, -0.00143, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 139
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohamed Lukmanji', 'Moiz Broachwala', 4.587, 4.651, 0.4191, 0.576, 'A full / B damped', 0.529, 0.09366, -0.04959, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 140
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mufaddal Gheewala', 'Huzefa Gulamhusein', 3.859, 4.683, 0.0145, 0.256, 'B full / A damped', 0.5, -0.00052, 0.00104, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 141
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Aliasger Lukmanji / Taher Bohri', 'Mustafa Kanchwala / Burhanuddin Moosabhoy', 3.694, 3.621, 0.593, 0.463, 'B full / A damped', 0.375, -0.00289, 0.0077, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 142
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani', 'Melam Master', 4.624, 4.233, 0.8811, 1, 'B full / A damped', 0.5, -0.12336, 0.24671, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 143
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hatim Jafferji', 'Moiz Master', 4.327, 4.307, 0.5257, 0.303, 'A full / B damped', 0.529, 0.04027, -0.02132, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 144
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor', 'Ibrahim Tayeb', 3.975, 3.853, 0.6515, 0.699, 'A full / B damped', 0.333, 0.06824, -0.02275, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 145
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Murtaza Hussain', 'Ibrahim Gandhi', 3.679, 3.828, 0.3179, 0.839, 'B full / A damped', 0.273, -0.02036, 0.07465, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 146
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury / Shabbir Halai', 'Qusai Lukmanji / Huzefa Raja', 4.551, 4.501, 0.5636, 0.303, 'A full / B damped', 0.556, 0.0037, -0.00206, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 147
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taher Saeed', 'Mustafa Kanchwala', 3.893, 3.7, 0.7289, 0.576, 'A full / B damped', 0.333, 0.04372, -0.01457, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 148
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zoeb Salehbhai', 'Burhanuddin Moosabhoy', 3.574, 3.556, 0.5232, 0.2, 'A full / B damped', 0.333, 0.0267, -0.0089, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 149
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Zulfi Imani / Hatim Jafferji', 'Moiz Broachwala / Huzefa Gulamhusein', 4.434, 4.637, 0.2605, 0.24, 'B full / A damped', 0.529, -0.00093, 0.00175, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 150
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Aliasger Lukmanji', 'Usuf Husain', 3.799, 4.052, 0.2153, 0.463, 'A full / B damped', 0.579, 0.10183, -0.05895, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 151
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Taher Bohri', 'Ammar Lukmanji', 3.585, 3.712, 0.343, 0.699, 'B full / A damped', 0.273, -0.01832, 0.06716, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 152
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohamed Lukmanji / Mufaddal Gheewala', 'Hussain Malbari / Ahmed Hussain', 4.272, 4.522, 0.2177, 0.463, 'A full / B damped', 0.579, 0.01015, -0.00588, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 153
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Melam Master', 'Moiz Broachwala', 4.482, 4.603, 0.3505, 0.699, 'A full / B damped', 0.579, 0.12719, -0.07364, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 154
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Master', 'Huzefa Gulamhusein', 4.284, 4.671, 0.1213, 0.576, 'A full / B damped', 0.579, 0.14168, -0.08203, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 155
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abdeali Yamani / Adnan Bohri', 'Mustafa Kanchwala / Burhanuddin Moosabhoy', 3.739, 3.616, 0.6525, 0.2, 'B full / A damped', 0.444, -0.00162, 0.00365, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 156
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Raja', 'Mustafa Zirapury', 4.786, 4.701, 0.6072, 0.839, 'A full / B damped', 0.556, 0.09224, -0.05125, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 73
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohammed Halai', 'Shabbir Halai', 4.213, 4.406, 0.2718, 0.699, 'B full / A damped', 0.333, -0.01774, 0.05323, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 74
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala / Hussain Dalal', 'Huzaifa Doctor / Murtaza Hussain', 3.815, 3.849, 0.4565, 0.285, 'A full / B damped', 0.444, 0.00434, -0.00193, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 75
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohamed Lukmanji', 'Zulfi Imani', 4.688, 4.503, 0.7204, 0.358, 'B full / A damped', 0.333, -0.02409, 0.07227, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 76
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mufaddal Gheewala', 'Hatim Jafferji', 3.878, 4.361, 0.0778, 0.2, 'A full / B damped', 0.556, 0.05164, -0.02869, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 77
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Aliasger Lukmanji / Taher Bohri', 'Taher Saeed / Zoeb Salehbhai', 3.734, 3.769, 0.4558, 0.699, 'B full / A damped', 0.444, -0.00397, 0.00893, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 78
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Melam Master', 'Qusai Lukmanji', 4.609, 4.291, 0.8355, 0.358, 'B full / A damped', 0.579, -0.04853, 0.08382, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 79
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Moiz Master', 'Huzefa Raja', 4.421, 4.705, 0.1898, 0.576, 'A full / B damped', 0.579, 0.13064, -0.07563, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 80
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Abdeali Yamani / Adnan Bohri', 'Ibrahim Tayeb / Ibrahim Gandhi', 3.738, 3.864, 0.3436, 0.576, 'B full / A damped', 0.482, -0.00267, 0.00554, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 81
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Malbari', 'Moiz Broachwala', 4.531, 4.53, 0.5002, 0.403, 'B full / A damped', 0.6, -0.03384, 0.0564, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 82
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Ahmed Hussain', 'Huzefa Gulamhusein', 4.499, 4.581, 0.3963, 0.2, 'A full / B damped', 0.6, 0.03381, -0.02028, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 83
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Raja', 'Zulfi Imani', 4.873, 4.576, 0.8202, 1, 'A full / B damped', 0.579, 0.05033, -0.02914, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 84
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohammed Halai', 'Hatim Jafferji', 4.196, 4.33, 0.3346, 0.24, 'A full / B damped', 0.579, 0.04477, -0.02592, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 85
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala / Hussain Dalal', 'Taher Saeed / Zoeb Salehbhai', 3.819, 3.777, 0.5527, 0.463, 'A full / B damped', 0.482, 0.00581, -0.0028, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 86
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury', 'Melam Master', 4.648, 4.561, 0.6096, 0.839, 'A full / B damped', 0.6, 0.09167, -0.055, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 87
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Shabbir Halai', 'Moiz Master', 4.454, 4.545, 0.386, 0.2, 'A full / B damped', 0.6, 0.03438, -0.02063, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 88
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor / Murtaza Hussain', 'Abdeali Yamani / Adnan Bohri', 3.846, 3.735, 0.6383, 0.463, 'A full / B damped', 0.514, 0.00469, -0.00241, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 89
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mohamed Lukmanji', 'Qusai Lukmanji', 4.663, 4.38, 0.8096, 0.403, 'A full / B damped', 0.6, 0.02147, -0.01288, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 90
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mufaddal Gheewala', 'Huzefa Raja', 3.935, 4.621, 0.0291, 0.463, 'B full / A damped', 0.579, -0.00219, 0.00378, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 91
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Aliasger Lukmanji / Taher Bohri', 'Ibrahim Tayeb / Ibrahim Gandhi', 3.73, 3.869, 0.3301, 0.699, 'B full / A damped', 0.482, -0.00311, 0.00646, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 92
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Usuf Husain / Ammar Lukmanji', 'Mustafa Kanchwala / Burhanuddin Moosabhoy', 3.883, 3.619, 0.794, 0.839, 'A full / B damped', 0.429, 0.00484, -0.00207, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 93
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Morbiwala', 'Aliasger Lukmanji', 4.07, 3.894, 0.7117, 0.2, 'B full / A damped', 0.6, -0.02391, 0.03985, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 94
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Hussain Dalal', 'Taher Bohri', 3.577, 3.561, 0.5205, 0.2, 'A full / B damped', 0.429, 0.02685, -0.01151, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 95
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Raja / Mohammed Halai', 'Mohamed Lukmanji / Mufaddal Gheewala', 4.578, 4.31, 0.7972, 0.839, 'A full / B damped', 0.514, 0.00476, -0.00245, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 96
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Huzaifa Doctor', 'Taher Saeed', 4.041, 3.941, 0.6243, 0.576, 'A full / B damped', 0.6, 0.06057, -0.03634, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 97
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Murtaza Hussain', 'Zoeb Salehbhai', 3.659, 3.607, 0.566, 0.839, 'A full / B damped', 0.429, 0.10192, -0.04368, 0.02
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 98
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;

insert into public.match_rating_logs (match_id, team_a, team_b, team_a_rating_pre, team_b_rating_pre, expected_team_a, margin_factor, confidence_mode, loss_confidence, delta_a, delta_b, anchor_lambda)
select m.id, 'Mustafa Zirapury / Shabbir Halai', 'Zulfi Imani / Hatim Jafferji', 4.61, 4.425, 0.7205, 0.285, 'A full / B damped', 0.6, 0.00223, -0.00134, 0.01
from public.matches m join public.sports s on s.id = m.sport_id
where s.slug = 'tennis' and m.season_year = 2025 and m.historical_match_number = 99
on conflict (match_id) do update set
  team_a = excluded.team_a,
  team_b = excluded.team_b,
  team_a_rating_pre = excluded.team_a_rating_pre,
  team_b_rating_pre = excluded.team_b_rating_pre,
  expected_team_a = excluded.expected_team_a,
  margin_factor = excluded.margin_factor,
  confidence_mode = excluded.confidence_mode,
  loss_confidence = excluded.loss_confidence,
  delta_a = excluded.delta_a,
  delta_b = excluded.delta_b,
  anchor_lambda = excluded.anchor_lambda;



-- Seed current tournament registrations from top-ranked historical players.

insert into public.tournament_registrations (tournament_id, player_id, status, payment_status, notes)
select t.id, p.id, 'registered', 'pending', 'Seeded from historical top performers.'
from public.tournaments t
join public.sports s on s.id = t.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Mustafa Raja')
on conflict (tournament_id, player_id) do nothing;

insert into public.payment_ledger (player_id, tournament_id, registration_id, entry_type, status, amount_cents, currency, notes)
select p.id, t.id, tr.id, 'charge', 'pending', 11000, 'USD', 'MRSA 2025 registration fee.'
from public.tournament_registrations tr
join public.tournaments t on t.id = tr.tournament_id
join public.players p on p.id = tr.player_id
join public.sports s on s.id = t.sport_id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Mustafa Raja')
  and not exists (
    select 1 from public.payment_ledger pl
    where pl.registration_id = tr.id and pl.entry_type = 'charge'
  );

insert into public.tournament_registrations (tournament_id, player_id, status, payment_status, notes)
select t.id, p.id, 'registered', 'pending', 'Seeded from historical top performers.'
from public.tournaments t
join public.sports s on s.id = t.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Taha Zirapury')
on conflict (tournament_id, player_id) do nothing;

insert into public.payment_ledger (player_id, tournament_id, registration_id, entry_type, status, amount_cents, currency, notes)
select p.id, t.id, tr.id, 'charge', 'pending', 11000, 'USD', 'MRSA 2025 registration fee.'
from public.tournament_registrations tr
join public.tournaments t on t.id = tr.tournament_id
join public.players p on p.id = tr.player_id
join public.sports s on s.id = t.sport_id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Taha Zirapury')
  and not exists (
    select 1 from public.payment_ledger pl
    where pl.registration_id = tr.id and pl.entry_type = 'charge'
  );

insert into public.tournament_registrations (tournament_id, player_id, status, payment_status, notes)
select t.id, p.id, 'registered', 'pending', 'Seeded from historical top performers.'
from public.tournaments t
join public.sports s on s.id = t.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Mustafa Zirapury')
on conflict (tournament_id, player_id) do nothing;

insert into public.payment_ledger (player_id, tournament_id, registration_id, entry_type, status, amount_cents, currency, notes)
select p.id, t.id, tr.id, 'charge', 'pending', 11000, 'USD', 'MRSA 2025 registration fee.'
from public.tournament_registrations tr
join public.tournaments t on t.id = tr.tournament_id
join public.players p on p.id = tr.player_id
join public.sports s on s.id = t.sport_id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Mustafa Zirapury')
  and not exists (
    select 1 from public.payment_ledger pl
    where pl.registration_id = tr.id and pl.entry_type = 'charge'
  );

insert into public.tournament_registrations (tournament_id, player_id, status, payment_status, notes)
select t.id, p.id, 'registered', 'pending', 'Seeded from historical top performers.'
from public.tournaments t
join public.sports s on s.id = t.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Mohamed Lukmanji')
on conflict (tournament_id, player_id) do nothing;

insert into public.payment_ledger (player_id, tournament_id, registration_id, entry_type, status, amount_cents, currency, notes)
select p.id, t.id, tr.id, 'charge', 'pending', 11000, 'USD', 'MRSA 2025 registration fee.'
from public.tournament_registrations tr
join public.tournaments t on t.id = tr.tournament_id
join public.players p on p.id = tr.player_id
join public.sports s on s.id = t.sport_id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Mohamed Lukmanji')
  and not exists (
    select 1 from public.payment_ledger pl
    where pl.registration_id = tr.id and pl.entry_type = 'charge'
  );

insert into public.tournament_registrations (tournament_id, player_id, status, payment_status, notes)
select t.id, p.id, 'registered', 'pending', 'Seeded from historical top performers.'
from public.tournaments t
join public.sports s on s.id = t.sport_id
join public.players p on p.sport_id = s.id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Huzefa Raja')
on conflict (tournament_id, player_id) do nothing;

insert into public.payment_ledger (player_id, tournament_id, registration_id, entry_type, status, amount_cents, currency, notes)
select p.id, t.id, tr.id, 'charge', 'pending', 11000, 'USD', 'MRSA 2025 registration fee.'
from public.tournament_registrations tr
join public.tournaments t on t.id = tr.tournament_id
join public.players p on p.id = tr.player_id
join public.sports s on s.id = t.sport_id
where s.slug = 'tennis' and t.name = 'MRSA 2025' and p.normalized_name = lower('Huzefa Raja')
  and not exists (
    select 1 from public.payment_ledger pl
    where pl.registration_id = tr.id and pl.entry_type = 'charge'
  );

commit;
