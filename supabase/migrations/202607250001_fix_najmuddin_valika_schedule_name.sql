-- Correct a Day 1 schedule seed typo after the schedule was already published.
update public.tournament_schedule_match_players participant
set
  source_player_name = 'Najmuddin Valika',
  player_id = coalesce(
    participant.player_id,
    (
      select player.id
      from public.players player
      where lower(trim(player.full_name)) = 'najmuddin valika'
      order by player.created_at desc
      limit 1
    )
  )
where lower(trim(participant.source_player_name)) = 'najimuddin valika';
