-- LuxLanding dashboard authorization boundary.
-- Review and run manually only after assigning app_metadata.role = 'admin'
-- to at least one Supabase Auth user. This repository does not auto-apply it.

create or replace function public.is_luxlanding_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or
    (select auth.jwt() -> 'app_metadata' -> 'roles') ? 'admin',
    false
  );
$$;

revoke all on function public.is_luxlanding_admin() from public;
grant execute on function public.is_luxlanding_admin() to authenticated;

alter table if exists public.leads enable row level security;
alter table if exists public.partners enable row level security;

-- Remove legacy policies on these private dashboard tables before installing
-- the single auditable admin boundary. Service-role operations still bypass RLS.
do $migration$
declare
  target_table text;
  policy_record record;
begin
  foreach target_table in array array['leads', 'partners']
  loop
    if to_regclass(format('public.%I', target_table)) is not null then
      for policy_record in
        select policyname
        from pg_policies
        where schemaname = 'public' and tablename = target_table
      loop
        execute format('drop policy %I on public.%I', policy_record.policyname, target_table);
      end loop;

      execute format(
        'create policy %I on public.%I for all to authenticated using ((select public.is_luxlanding_admin())) with check ((select public.is_luxlanding_admin()))',
        target_table || '_admin_all',
        target_table
      );

      execute format('revoke all on table public.%I from anon', target_table);
      execute format('grant select, insert, update, delete on table public.%I to authenticated', target_table);
    end if;
  end loop;
end
$migration$;
