-- Seed canonical Jamaat / City choices for signup.
-- players.jamaat_city remains free text so players can choose Other.

create table if not exists public.jamaat_cities (
  name text primary key,
  display_order integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.jamaat_cities enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'jamaat_cities'
      and policyname = 'Jamaat cities are readable by everyone'
  ) then
    create policy "Jamaat cities are readable by everyone"
    on public.jamaat_cities
    for select
    using (true);
  end if;
end $$;

insert into public.jamaat_cities (name, display_order, active)
values
  ('Chicago', 1, true),
  ('The Woodlands', 2, true),
  ('Atlanta', 3, true),
  ('Austin', 4, true),
  ('Detroit', 5, true),
  ('Houston', 6, true),
  ('Minneapolis', 7, true),
  ('Mississauga', 8, true),
  ('Irvine', 9, true),
  ('New Jersey', 10, true),
  ('Philadelphia', 11, true),
  ('Pittsburgh', 12, true),
  ('Plano', 13, true),
  ('Vancouver', 14, true)
on conflict (name) do update set
  display_order = excluded.display_order,
  active = excluded.active;
