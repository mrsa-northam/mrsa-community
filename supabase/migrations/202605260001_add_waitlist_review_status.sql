alter table public.tournament_registrations
  add column if not exists waitlist_status text not null default 'none'
  check (waitlist_status in ('none', 'pending', 'accepted', 'rejected'));

create index if not exists tournament_registrations_waitlist_status_idx
  on public.tournament_registrations (tournament_id, status, waitlist_status);
