alter table public.leads
  alter column lead_id set not null;

alter table public.partners
  alter column partner_id set not null;

create unique index if not exists leads_lead_id_unique_idx
  on public.leads (lead_id);

create unique index if not exists partners_partner_id_unique_idx
  on public.partners (partner_id);

-- A fresh database may not have the UNIQUE constraints that already exist in
-- production. Promote these indexes to canonical constraints before 0005
-- creates foreign keys. If an equivalent constraint already exists, keep the
-- standalone index so 0008 can remove only that redundant copy.
do $$
declare
  lead_id_attnum smallint;
  partner_id_attnum smallint;
begin
  select attnum into lead_id_attnum
  from pg_attribute
  where attrelid = 'public.leads'::regclass
    and attname = 'lead_id'
    and not attisdropped;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.leads'::regclass
      and contype in ('p', 'u')
      and conkey = array[lead_id_attnum]::smallint[]
  ) then
    alter table public.leads
      add constraint leads_lead_id_key
      unique using index leads_lead_id_unique_idx;
  end if;

  select attnum into partner_id_attnum
  from pg_attribute
  where attrelid = 'public.partners'::regclass
    and attname = 'partner_id'
    and not attisdropped;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.partners'::regclass
      and contype in ('p', 'u')
      and conkey = array[partner_id_attnum]::smallint[]
  ) then
    alter table public.partners
      add constraint partners_partner_id_key
      unique using index partners_partner_id_unique_idx;
  end if;
end
$$;

alter table public.leads
  drop constraint if exists leads_lead_id_format_check,
  add constraint leads_lead_id_format_check
    check (lead_id ~ '^LUX-[0-9]{8}-[A-Z0-9]{6,8}$') not valid;

alter table public.partners
  drop constraint if exists partners_partner_id_format_check,
  add constraint partners_partner_id_format_check
    check (partner_id ~ '^P-[A-Z0-9]{8}$') not valid;

alter table public.leads validate constraint leads_lead_id_format_check;
alter table public.partners validate constraint partners_partner_id_format_check;
