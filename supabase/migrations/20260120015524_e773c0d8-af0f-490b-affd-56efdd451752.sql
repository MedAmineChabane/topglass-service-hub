-- Drop the existing restrictive INSERT policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

-- Create permissive INSERT policy for public lead submissions
CREATE POLICY "Anyone can submit a lead" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);