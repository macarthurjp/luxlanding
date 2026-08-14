alter table public.leads
  add column if not exists privacy_notice_version text;

update public.leads
set privacy_notice_version = 'legacy-pre-2026-08-13'
where privacy_consent = 'yes' and privacy_notice_version is null;

comment on column public.leads.privacy_notice_version is
  'Server-assigned identifier of the privacy notice accepted by the lead.';
