alter table public.tournament_teams
  add column if not exists sponsors jsonb not null default '[]'::jsonb;

alter table public.tournament_teams
  drop constraint if exists tournament_teams_sponsors_is_array;

alter table public.tournament_teams
  add constraint tournament_teams_sponsors_is_array
  check (jsonb_typeof(sponsors) = 'array');

update public.tournament_teams
set sponsors = jsonb_build_array(
  jsonb_build_object(
    'name', coalesce(sponsor_name, ''),
    'logoUrl', coalesce(sponsor_logo_url, '')
  )
)
where sponsors = '[]'::jsonb
  and (nullif(trim(sponsor_name), '') is not null or nullif(trim(sponsor_logo_url), '') is not null);

comment on column public.tournament_teams.sponsors is
  'Ordered sponsor entries stored as objects containing name and logoUrl.';
