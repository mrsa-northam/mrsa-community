begin;

update public.tournaments
set status = 'completed'
where ends_on < current_date
  and status not in ('completed', 'cancelled');

with tennis as (
  select id
  from public.sports
  where slug = 'tennis'
  limit 1
)
insert into public.tournaments (
  sport_id,
  name,
  season_year,
  status,
  venue_name,
  venue_address,
  venue_maps_url,
  starts_on,
  ends_on,
  registration_fee_cents,
  currency,
  notes
)
select
  tennis.id,
  'MRSA North America Tennis Tournament - 2025',
  2025,
  'completed',
  'Forest Sports Club',
  'Forest Sports Club',
  'https://www.google.com/maps/search/?api=1&query=Forest%20Sports%20Club',
  date '2025-08-07',
  date '2025-08-08',
  11000,
  'USD',
  'Historical tournament archive.'
from tennis
on conflict (sport_id, name, season_year) do update set
  status = 'completed',
  venue_name = excluded.venue_name,
  venue_address = excluded.venue_address,
  venue_maps_url = excluded.venue_maps_url,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on;

with latest_completed as (
  select id
  from public.tournaments
  where status = 'completed'
  order by starts_on desc nulls last, created_at desc
  limit 1
)
update public.tournament_schedule_notes note
set body = jsonb_build_object(
  'photoAlbumUrl', 'https://photos.app.goo.gl/2SgoggYh2eQEWvQ47?v=2'
)::text,
sort_order = 100010,
is_published = false
from latest_completed
where note.tournament_id = latest_completed.id
  and note.title = '__MRSA_TOURNAMENT_ARCHIVE_V1__';

with latest_completed as (
  select id
  from public.tournaments
  where status = 'completed'
  order by starts_on desc nulls last, created_at desc
  limit 1
)
insert into public.tournament_schedule_notes (tournament_id, title, body, sort_order, is_published)
select
  latest_completed.id,
  '__MRSA_TOURNAMENT_ARCHIVE_V1__',
  jsonb_build_object('photoAlbumUrl', 'https://photos.app.goo.gl/2SgoggYh2eQEWvQ47?v=2')::text,
  100010,
  false
from latest_completed
where not exists (
  select 1
  from public.tournament_schedule_notes existing
  where existing.tournament_id = latest_completed.id
    and existing.title = '__MRSA_TOURNAMENT_ARCHIVE_V1__'
);

with latest_completed as (
  select id
  from public.tournaments
  where status = 'completed'
  order by starts_on desc nulls last, created_at desc
  limit 1
)
update public.tournament_schedule_notes note
set body = jsonb_build_object(
  'eventYear', 2027,
  'name', 'MRSA North America Tennis Tournament 2027',
  'startsOn', '2027-08-07',
  'endsOn', '2027-08-08',
  'timezone', 'America/Chicago',
  'locationName', 'Chicago area',
  'description', 'Save the full weekend for the 2027 MRSA North America Tennis Tournament. Registration details will follow.',
  'isAllDay', true,
  'responses', coalesce(note.body::jsonb -> 'responses', '[]'::jsonb)
)::text,
sort_order = 100020,
is_published = false
from latest_completed
where note.tournament_id = latest_completed.id
  and note.title = '__MRSA_2027_INTEREST_RSVPS_V1__';

with latest_completed as (
  select id
  from public.tournaments
  where status = 'completed'
  order by starts_on desc nulls last, created_at desc
  limit 1
)
insert into public.tournament_schedule_notes (tournament_id, title, body, sort_order, is_published)
select
  latest_completed.id,
  '__MRSA_2027_INTEREST_RSVPS_V1__',
  jsonb_build_object(
    'eventYear', 2027,
    'name', 'MRSA North America Tennis Tournament 2027',
    'startsOn', '2027-08-07',
    'endsOn', '2027-08-08',
    'timezone', 'America/Chicago',
    'locationName', 'Chicago area',
    'description', 'Save the full weekend for the 2027 MRSA North America Tennis Tournament. Registration details will follow.',
    'isAllDay', true,
    'responses', '[]'::jsonb
  )::text,
  100020,
  false
from latest_completed
where not exists (
  select 1
  from public.tournament_schedule_notes existing
  where existing.tournament_id = latest_completed.id
    and existing.title = '__MRSA_2027_INTEREST_RSVPS_V1__'
);

commit;
