create policy "Admins manage season tiers" on public.player_season_tiers
for all using (public.is_admin()) with check (public.is_admin());
