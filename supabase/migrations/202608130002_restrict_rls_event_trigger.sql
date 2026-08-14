-- Event-trigger functions are internal database machinery and must not be
-- callable through the public Data API.
revoke all on function public.rls_auto_enable() from public;
revoke all on function public.rls_auto_enable() from anon;
revoke all on function public.rls_auto_enable() from authenticated;

grant execute on function public.rls_auto_enable() to service_role;
