alter table public.players
  add column if not exists jersey_name text;

with latest_shirt_names as (
  select distinct on (registration.player_id)
    registration.player_id,
    nullif(trim(registration.shirt_name), '') as shirt_name
  from public.tournament_registrations registration
  where nullif(trim(registration.shirt_name), '') is not null
  order by registration.player_id, registration.registered_at desc
)
update public.players player
set jersey_name = latest_shirt_names.shirt_name
from latest_shirt_names
where player.id = latest_shirt_names.player_id
  and nullif(trim(coalesce(player.jersey_name, '')), '') is null;

update public.tournament_registrations registration
set shirt_name = nullif(trim(player.jersey_name), '')
from public.players player
where registration.player_id = player.id
  and registration.status <> 'cancelled'
  and nullif(trim(coalesce(registration.shirt_name, '')), '') is null
  and nullif(trim(coalesce(player.jersey_name, '')), '') is not null;
