-- Preserve click/conversion history the same way referral_deliveries does:
-- a partner with tracked activity cannot be silently deleted out from under it.
alter table public.partner_referral_clicks
  drop constraint if exists partner_referral_clicks_partner_id_fkey,
  add constraint partner_referral_clicks_partner_id_fkey
    foreign key (partner_id) references public.partners(partner_id) on delete restrict;

-- Defense in depth against a buggy or malicious client sending garbage —
-- matches the generateReferralCode() format in submit.js (LUX- + 6 base36 chars).
alter table public.partner_referral_clicks
  drop constraint if exists partner_referral_clicks_code_format_check,
  add constraint partner_referral_clicks_code_format_check
    check (referral_code ~ '^LUX-[A-Z0-9]{6}$') not valid;

alter table public.partner_referral_clicks
  validate constraint partner_referral_clicks_code_format_check;
