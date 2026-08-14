alter table public.leads
  add column if not exists notification_email_status text not null default 'pending',
  add column if not exists confirmation_email_status text not null default 'pending',
  add column if not exists email_delivery_checked_at timestamptz;

alter table public.leads
  add constraint leads_notification_email_status_check
    check (notification_email_status in ('pending', 'sent', 'failed')),
  add constraint leads_confirmation_email_status_check
    check (confirmation_email_status in ('pending', 'sent', 'failed'));
