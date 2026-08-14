-- Two historical UNIQUE constraints covered the same partner_id column.
-- Keep partners_partner_id_key, which is also the referenced identity for the
-- referral audit foreign key, and remove the redundant constraint/index.
alter table public.partners
  drop constraint if exists partners_partner_id_unique;
