drop policy if exists "Players read their fitness progress and admins read all" on public.player_fitness_progress;
drop policy if exists "Players read active tournament fitness progress" on public.player_fitness_progress;

create policy "Players read active tournament fitness progress"
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
  or (
    auth.uid() is not null
    and exists (
      select 1
      from public.tournament_registrations registration
      join public.tournaments tournament on tournament.id = registration.tournament_id
      where registration.player_id = player_fitness_progress.player_id
        and registration.status <> 'cancelled'
        and registration.payment_status in ('paid', 'waived')
        and tournament.status in ('registration_open', 'registration_closed', 'live')
    )
  )
);
