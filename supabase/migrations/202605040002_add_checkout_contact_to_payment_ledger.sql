alter table public.payment_ledger
  add column if not exists checkout_email text,
  add column if not exists checkout_phone text;

update public.payment_ledger pl
set
  checkout_email = coalesce(pl.checkout_email, p.email::text, au.email::text),
  checkout_phone = coalesce(pl.checkout_phone, p.phone)
from public.players p
left join auth.users au on au.id = p.auth_user_id
where p.id = pl.player_id
  and (pl.checkout_email is null or pl.checkout_phone is null);
