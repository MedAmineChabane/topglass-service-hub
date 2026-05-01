
-- Remove overly permissive storage upload policy on lead-attachments
DROP POLICY IF EXISTS "Only service role can upload lead photos" ON storage.objects;

-- Lock down SECURITY DEFINER functions: revoke from anon/authenticated/public
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role is referenced inside RLS policies (which run as the policy owner), so we keep
-- it executable for authenticated users to support any direct policy/RPC reference,
-- but explicitly remove anon access.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
