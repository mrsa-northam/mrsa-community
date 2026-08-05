do $$
declare
  previous_default text;
begin
  select trim(both '''' from split_part(column_default, '::', 1))
  into previous_default
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'tournament_teams'
    and column_name = 'jersey_color';

  -- Backfill only teams still using the former database default. Custom team
  -- colors are identity data and intentionally remain unchanged.
  if previous_default is not null and lower(previous_default) <> lower('#1D4F7C') then
    update public.tournament_teams
    set jersey_color = '#1D4F7C'
    where lower(jersey_color) = lower(previous_default);
  end if;

  alter table public.tournament_teams
    alter column jersey_color set default '#1D4F7C';
end
$$;
