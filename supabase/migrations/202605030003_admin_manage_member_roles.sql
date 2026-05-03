create policy "Admins read member roles" on public.member_roles
for select using (public.is_admin());

create policy "Admins manage member roles" on public.member_roles
for all using (public.is_admin()) with check (public.is_admin());
