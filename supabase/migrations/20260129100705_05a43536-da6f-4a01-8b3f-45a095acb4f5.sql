-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

-- Create a new PERMISSIVE INSERT policy for anonymous lead submissions
CREATE POLICY "Anyone can submit a lead" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);