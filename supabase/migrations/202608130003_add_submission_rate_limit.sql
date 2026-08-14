create table if not exists public.lead_submission_attempts (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_submission_attempts_fingerprint_created_idx
  on public.lead_submission_attempts (fingerprint, created_at desc);

alter table public.lead_submission_attempts enable row level security;
revoke all on table public.lead_submission_attempts from public, anon, authenticated;

comment on table public.lead_submission_attempts is
  'Short-lived hashed network fingerprints used only for lead form rate limiting.';
