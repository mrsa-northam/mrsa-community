alter table public.tournament_teams
  add column if not exists logo_url text;

alter table public.tournament_teams
  add column if not exists jersey_color text;

alter table public.tournament_teams
  alter column jersey_color set default '#1D4F7C';

update public.tournament_teams
set jersey_color = '#1D4F7C'
where jersey_color is null;

alter table public.tournament_teams
  alter column jersey_color set not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'team-logos',
  'team-logos',
  true,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Team logos are publicly readable" on storage.objects;
drop policy if exists "Admins upload team logos" on storage.objects;
drop policy if exists "Admins update team logos" on storage.objects;
drop policy if exists "Admins delete team logos" on storage.objects;

create policy "Team logos are publicly readable"
on storage.objects
for select
using (bucket_id = 'team-logos');

create policy "Admins upload team logos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'team-logos'
  and public.is_admin()
);

create policy "Admins update team logos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'team-logos'
  and public.is_admin()
)
with check (
  bucket_id = 'team-logos'
  and public.is_admin()
);

create policy "Admins delete team logos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'team-logos'
  and public.is_admin()
);
