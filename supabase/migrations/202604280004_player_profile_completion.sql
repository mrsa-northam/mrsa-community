-- Adds optional playing video link and lets claim requests reserve a profile
-- so the player can complete details before admin review.

alter table public.players
add column if not exists tennis_video_url text;

create policy "Claim requester can complete pending profile"
on public.players
for update
using (
  claim_status = 'pending'
  and claim_requested_by = auth.uid()
)
with check (
  claim_status = 'pending'
  and claim_requested_by = auth.uid()
);
