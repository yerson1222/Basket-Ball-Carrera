-- World Hoops V11.1: private, recoverable deletion and replacement.
-- Safe to run once or repeat. Does not alter existing career rows.
begin;
create table if not exists public.career_trash (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 original_slot integer not null check (original_slot between 1 and 3),
 save_data jsonb not null check (jsonb_typeof(save_data) = 'object'),
 archived_at timestamptz not null default now(),
 expires_at timestamptz not null default (now() + interval '7 days')
);
alter table public.career_trash enable row level security;
revoke all on public.career_trash from public, anon, authenticated;
grant select, insert, delete on public.career_trash to authenticated;
drop policy if exists "Private career trash" on public.career_trash;
create policy "Private career trash" on public.career_trash
 for all to authenticated
 using ((select auth.uid()) = user_id)
 with check ((select auth.uid()) = user_id);
create index if not exists career_trash_owner_expiry
 on public.career_trash(user_id, expires_at);
create or replace function public.wh_archive_career(
 p_slot integer, p_revision bigint, p_replacement jsonb default null
) returns bigint language plpgsql security invoker set search_path = ''
as $$
declare u uuid := auth.uid(); old_row public.career_saves%rowtype; new_rev bigint;
begin
 if u is null then raise exception 'Authentication required'; end if;
 select * into old_row from public.career_saves
  where user_id=u and slot=p_slot and revision=p_revision for update;
 if not found then raise exception 'Career changed; refresh before retrying'; end if;
 delete from public.career_trash where user_id=u and expires_at<=now();
 insert into public.career_trash(user_id,original_slot,save_data)
  values(u,p_slot,old_row.save_data);
 if p_replacement is null then
  delete from public.career_saves where user_id=u and slot=p_slot;
  return 0;
 end if;
 if jsonb_typeof(p_replacement) <> 'object' then raise exception 'Invalid save'; end if;
 update public.career_saves set save_data=p_replacement,
  revision=revision+1, updated_at=now()
  where user_id=u and slot=p_slot returning revision into new_rev;
 return new_rev;
end; $$;
create or replace function public.wh_restore_career(p_id uuid,p_slot integer)
 returns bigint language plpgsql security invoker set search_path = ''
as $$
declare u uuid := auth.uid(); old_row public.career_trash%rowtype;
 new_rev bigint := floor(extract(epoch from clock_timestamp())*1000000)::bigint;
begin
 if u is null or p_slot not between 1 and 3 then raise exception 'Invalid request'; end if;
 select * into old_row from public.career_trash
  where id=p_id and user_id=u and expires_at>now() for update;
 if not found then raise exception 'Backup expired or not found'; end if;
 insert into public.career_saves(user_id,slot,save_data,revision)
  values(u,p_slot,old_row.save_data,new_rev);
 delete from public.career_trash where id=p_id and user_id=u;
 return new_rev;
end; $$;
revoke all on function public.wh_archive_career(integer,bigint,jsonb) from public, anon;
revoke all on function public.wh_restore_career(uuid,integer) from public, anon;
grant execute on function public.wh_archive_career(integer,bigint,jsonb) to authenticated;
grant execute on function public.wh_restore_career(uuid,integer) to authenticated;
commit;
