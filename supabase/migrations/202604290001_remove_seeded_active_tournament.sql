-- Remove the placeholder active tournament that was originally included with the historical import.
-- Future active tournaments should be created by admins from the admin panel.

begin;

delete from public.payment_ledger
where tournament_id in (
  select id
  from public.tournaments
  where name = 'MRSA 2025'
    and notes = 'Seeded active tournament.'
);

delete from public.tournaments
where name = 'MRSA 2025'
  and notes = 'Seeded active tournament.';

commit;
