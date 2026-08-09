create table if not exists public.tournament_raffles (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null unique references public.tournaments(id) on delete cascade,
  winner_entry_id text not null check (char_length(trim(winner_entry_id)) > 0),
  winner_name text not null check (char_length(trim(winner_name)) > 0),
  winner_photo_url text,
  winner_kind text not null check (winner_kind in ('drafted_player', 'volunteer')),
  winner_player_id uuid references public.players(id) on delete set null,
  participant_count integer not null check (participant_count = 36),
  participant_snapshot jsonb not null default '[]'::jsonb,
  drawn_by uuid references public.players(id) on delete set null,
  drawn_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tournament_raffles_set_updated_at on public.tournament_raffles;
create trigger tournament_raffles_set_updated_at
before update on public.tournament_raffles
for each row execute function public.set_updated_at();

create index if not exists tournament_raffles_tournament_idx
  on public.tournament_raffles (tournament_id, drawn_at desc);

alter table public.tournament_raffles enable row level security;

drop policy if exists "Raffle winners are readable" on public.tournament_raffles;
drop policy if exists "Admins manage tournament raffles" on public.tournament_raffles;

create policy "Raffle winners are readable" on public.tournament_raffles
for select using (true);

create policy "Admins manage tournament raffles" on public.tournament_raffles
for all using (public.is_admin()) with check (public.is_admin());
