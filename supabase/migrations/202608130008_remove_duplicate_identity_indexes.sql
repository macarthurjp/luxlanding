-- The production schema already enforces these identities through unique
-- constraints. Keep the constraint-backed indexes and remove only the
-- redundant standalone indexes introduced during hardening.
drop index if exists public.leads_lead_id_unique_idx;
drop index if exists public.partners_partner_id_unique_idx;
