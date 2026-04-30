-- Remove example seeded registrations/payments so the live app starts clean.

delete from public.payment_ledger
where notes = 'MRSA 2025 registration fee.'
  and tournament_id in (
    select id from public.tournaments where name = 'MRSA 2025'
  );

delete from public.tournament_registrations
where notes = 'Seeded from historical top performers.'
  and tournament_id in (
    select id from public.tournaments where name = 'MRSA 2025'
  );
