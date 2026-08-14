alter table public.leads
  add column if not exists consented_at timestamptz;

update public.leads
set consented_at = coalesce("timestamp", created_at)
where privacy_consent = 'yes' and consented_at is null;

create table if not exists public.referral_dispatches (
  request_id uuid primary key,
  requested_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'processing' check (status in ('processing', 'completed', 'failed')),
  error_code text,
  lead_count integer check (lead_count between 1 and 25),
  partner_count integer check (partner_count between 1 and 10),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.referral_deliveries (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.referral_dispatches(request_id) on delete cascade,
  lead_id text not null references public.leads(lead_id) on delete restrict,
  partner_id text not null references public.partners(partner_id) on delete restrict,
  provider_message_id text,
  delivered_at timestamptz not null default now(),
  unique (request_id, lead_id, partner_id)
);

create index if not exists referral_deliveries_lead_idx on public.referral_deliveries (lead_id, delivered_at desc);
create index if not exists referral_deliveries_partner_idx on public.referral_deliveries (partner_id, delivered_at desc);

alter table public.referral_dispatches enable row level security;
alter table public.referral_deliveries enable row level security;

revoke all on table public.referral_dispatches from public, anon;
revoke all on table public.referral_deliveries from public, anon;
grant select on table public.referral_dispatches to authenticated;
grant select on table public.referral_deliveries to authenticated;

create policy referral_dispatches_admin_read
  on public.referral_dispatches for select to authenticated
  using ((select public.is_luxlanding_admin()));

create policy referral_deliveries_admin_read
  on public.referral_deliveries for select to authenticated
  using ((select public.is_luxlanding_admin()));
