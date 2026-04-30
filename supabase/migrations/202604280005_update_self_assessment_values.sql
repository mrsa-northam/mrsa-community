-- Allow the expanded self-assessment labels used by the signup/profile form.

alter table public.players
drop constraint if exists players_self_assessment_check;

alter table public.players
drop constraint if exists player_self_assessment_check;

alter table public.players
add constraint players_self_assessment_check
check (
  self_assessment is null
  or self_assessment in (
    'Advanced',
    'Upper Intermediate',
    'Intermediate',
    'Developing Intermediate',
    'Recreational',
    'Advanced (High-level players with strong match experience and consistency)',
    'Upper Intermediate (Solid all-around players with competitive experience)',
    'Intermediate (Reliable players with developing skills and some match play)',
    'Developing Intermediate (Improving players with basic consistency and game sense)',
    'Recreational (Casual players with limited experience but passion to play)'
  )
);
