alter table public.leads
  add column if not exists submission_id uuid;

create unique index if not exists leads_submission_id_unique_idx
  on public.leads (submission_id)
  where submission_id is not null;

comment on column public.leads.submission_id is
  'Browser-generated idempotency key; contains no customer information.';
