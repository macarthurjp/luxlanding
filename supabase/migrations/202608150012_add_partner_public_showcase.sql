alter table public.partners
  add column if not exists logo_url text,
  add column if not exists website_url text,
  add column if not exists show_publicly boolean not null default false,
  add column if not exists display_order integer not null default 0;

comment on column public.partners.logo_url is
  'Public logo image URL shown on the marketing site partners showcase.';
comment on column public.partners.website_url is
  'Public partner website, linked from the marketing site partners showcase.';
comment on column public.partners.show_publicly is
  'Independent of "active" (referral eligibility) — gates public display only.';

-- Narrow, column-level read access for anonymous visitors: only the columns
-- needed for the public showcase, and only rows opted into show_publicly.
-- Email/phone/services remain unreachable to anon at the privilege level,
-- not just filtered at the application layer.
grant select (partner_id, name, logo_url, website_url, display_order)
  on public.partners to anon;

create policy partners_public_read
  on public.partners for select to anon
  using (show_publicly = true);
