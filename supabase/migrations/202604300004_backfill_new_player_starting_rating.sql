-- Align existing app-created beginner profiles with the tennis starter rating.

begin;

update public.players
set
  rating = 3.600,
  rating_provisional = true,
  tier = 4
where claim_status = 'claimed'
  and coalesce(tier, 4) = 4
  and coalesce(tournaments_played, 0) = 0
  and coalesce(matches_played, 0) = 0
  and rating = 1.500;

commit;
