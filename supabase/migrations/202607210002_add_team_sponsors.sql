alter table public.tournament_teams
  add column if not exists sponsor_name text,
  add column if not exists sponsor_logo_url text;

comment on column public.tournament_teams.sponsor_name is
  'Optional display name for the team sponsor.';

comment on column public.tournament_teams.sponsor_logo_url is
  'Public storage URL for the optional team sponsor logo.';
