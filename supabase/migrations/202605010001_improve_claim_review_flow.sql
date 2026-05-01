-- Keep reviewed claims from leaving stale player ownership state, and expose
-- pending claim review context to admins without loading auth data in the app.

alter table public.player_claims
add column if not exists requester_email text;

update public.player_claims pc
set requester_email = au.email::text
from auth.users au
where pc.requested_by = au.id
  and pc.requester_email is null;

create or replace function public.admin_pending_player_claims()
returns table (
  id uuid,
  player_id uuid,
  requested_by uuid,
  requester_email text,
  status public.claim_review_status,
  requester_note text,
  created_at timestamptz,
  player_full_name text,
  player_jamaat_city text
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    pc.id,
    pc.player_id,
    pc.requested_by,
    coalesce(pc.requester_email, au.email::text) as requester_email,
    pc.status,
    pc.requester_note,
    pc.created_at,
    p.full_name as player_full_name,
    p.jamaat_city as player_jamaat_city
  from public.player_claims pc
  join public.players p on p.id = pc.player_id
  left join auth.users au on au.id = pc.requested_by
  where pc.status = 'pending'
    and public.is_admin()
  order by pc.created_at asc
  limit 40;
$$;

grant execute on function public.admin_pending_player_claims() to authenticated;

update public.players p
set claim_requested_by = null
where p.claim_status = 'unclaimed'
  and p.auth_user_id is null
  and p.claim_requested_by is not null
  and exists (
    select 1
    from public.player_claims pc
    where pc.player_id = p.id
      and pc.requested_by = p.claim_requested_by
      and pc.status = 'rejected'
  );
