alter table public.leads
  add column if not exists contact_method text,
  add column if not exists contact_time text,
  add column if not exists client_timezone text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists landing_page text,
  add column if not exists referrer text;

do $$
begin
  alter table public.leads add constraint leads_contact_method_check
    check (contact_method is null or contact_method in ('email', 'whatsapp', 'phone')) not valid;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.leads add constraint leads_contact_time_check
    check (contact_time is null or contact_time in ('morning', 'afternoon', 'evening')) not valid;
exception when duplicate_object then null;
end $$;

alter table public.leads validate constraint leads_contact_method_check;
alter table public.leads validate constraint leads_contact_time_check;

comment on column public.leads.contact_method is 'Lead preferred reply channel.';
comment on column public.leads.contact_time is 'Lead preferred local contact window.';
comment on column public.leads.client_timezone is 'IANA browser timezone supplied by the lead.';
comment on column public.leads.utm_source is 'First-touch campaign source captured with consent.';
comment on column public.leads.landing_page is 'First landing page without query parameters.';
