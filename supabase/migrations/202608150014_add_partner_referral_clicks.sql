create table if not exists public.partner_referral_clicks (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null references public.partners(partner_id) on delete cascade,
  referral_code text not null unique,
  clicked_at timestamptz not null default now(),
  converted boolean not null default false,
  converted_at timestamptz,
  notes text
);

create index if not exists partner_referral_clicks_partner_idx
  on public.partner_referral_clicks (partner_id, clicked_at desc);

alter table public.partner_referral_clicks enable row level security;
revoke all on table public.partner_referral_clicks from public, anon, authenticated;

comment on table public.partner_referral_clicks is
  'Logs a click-through to a partner site with a human-speakable code. Conversion is confirmed manually by an admin once the partner reports the code back — there is no way to observe a signup on the partner''s own site.';

-- Visitors can log a click, but only the columns needed to record one —
-- they cannot set converted/converted_at/notes, and cannot read anything back.
grant insert (partner_id, referral_code) on public.partner_referral_clicks to anon;

create policy partner_clicks_public_insert
  on public.partner_referral_clicks for insert to anon
  with check (true);

-- Admins get full read/write for reviewing and marking conversions.
grant select, update on table public.partner_referral_clicks to authenticated;

create policy partner_clicks_admin_read
  on public.partner_referral_clicks for select to authenticated
  using ((select public.is_luxlanding_admin()));

create policy partner_clicks_admin_update
  on public.partner_referral_clicks for update to authenticated
  using ((select public.is_luxlanding_admin()));
