-- Allow a signed-in player to reserve an unclaimed historical profile before
-- completing the required profile details.

create policy "Authenticated users can reserve unclaimed player profile"
on public.players
for update
using (
  auth.uid() is not null
  and claim_status = 'unclaimed'
  and claim_requested_by is null
  and auth_user_id is null
)
with check (
  auth.uid() is not null
  and claim_status = 'pending'
  and claim_requested_by = auth.uid()
  and auth_user_id = auth.uid()
);
