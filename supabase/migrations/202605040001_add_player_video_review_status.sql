alter table public.players
  add column if not exists tennis_video_status text
    check (tennis_video_status is null or tennis_video_status in ('pending', 'approved', 'rejected')),
  add column if not exists tennis_video_reviewed_at timestamptz,
  add column if not exists tennis_video_reviewed_by uuid references auth.users(id),
  add column if not exists tennis_video_rejection_note text;

update public.players
set tennis_video_status = 'pending'
where tennis_video_url is not null
  and btrim(tennis_video_url) <> ''
  and tennis_video_status is null;
