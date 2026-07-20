create table if not exists public.player_fitness_progress (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 30),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, day_number)
);

create trigger player_fitness_progress_set_updated_at
before update on public.player_fitness_progress
for each row execute function public.set_updated_at();

create index if not exists player_fitness_progress_player_idx
  on public.player_fitness_progress (player_id, day_number);

alter table public.player_fitness_progress enable row level security;

drop policy if exists "Players read their fitness progress and admins read all" on public.player_fitness_progress;
drop policy if exists "Players manage their fitness progress and admins manage all" on public.player_fitness_progress;

create policy "Players read their fitness progress and admins read all"
on public.player_fitness_progress
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.players
    where players.id = player_fitness_progress.player_id
      and players.auth_user_id = auth.uid()
  )
);

create policy "Players manage their fitness progress and admins manage all"
on public.player_fitness_progress
for all
using (
  public.is_admin()
  or exists (
    select 1
    from public.players
    where players.id = player_fitness_progress.player_id
      and players.auth_user_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.players
    where players.id = player_fitness_progress.player_id
      and players.auth_user_id = auth.uid()
  )
);
