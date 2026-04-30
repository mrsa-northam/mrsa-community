-- Storage bucket and policies for player profile photos.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  true,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Profile photos are publicly readable"
on storage.objects
for select
using (bucket_id = 'profile-photos');

create policy "Authenticated users upload profile photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-photos'
  and owner = auth.uid()
);

create policy "Users update their own profile photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-photos'
  and owner = auth.uid()
)
with check (
  bucket_id = 'profile-photos'
  and owner = auth.uid()
);

create policy "Users delete their own profile photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-photos'
  and owner = auth.uid()
);
