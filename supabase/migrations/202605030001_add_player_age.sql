alter table public.players
  add column if not exists age integer check (age is null or (age >= 1 and age <= 120));
