-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

-- Create a permissive policy for anonymous lead submission
CREATE POLICY "Anyone can submit a lead" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);