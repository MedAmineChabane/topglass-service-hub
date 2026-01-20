-- Supprimer la politique trop permissive sur rate_limits
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

-- Créer une politique restrictive - seul le service role peut gérer (via edge functions)
-- Les utilisateurs anonymes ne peuvent pas accéder directement à cette table
CREATE POLICY "Deny all direct access to rate_limits"
ON public.rate_limits
FOR ALL
USING (false)
WITH CHECK (false);