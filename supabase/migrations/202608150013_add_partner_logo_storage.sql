-- Public bucket for partner logos uploaded from the admin dashboard.
-- The bucket is public (readable by anyone with the object URL) because
-- logos are shown on the marketing site; only the storage path is public,
-- not any other project data.
insert into storage.buckets (id, name, public)
values ('partner-logos', 'partner-logos', true)
on conflict (id) do nothing;

create policy partner_logos_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'partner-logos');

create policy partner_logos_admin_write
  on storage.objects for insert to authenticated
  with check (bucket_id = 'partner-logos' and (select public.is_luxlanding_admin()));

create policy partner_logos_admin_update
  on storage.objects for update to authenticated
  using (bucket_id = 'partner-logos' and (select public.is_luxlanding_admin()));

create policy partner_logos_admin_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'partner-logos' and (select public.is_luxlanding_admin()));
