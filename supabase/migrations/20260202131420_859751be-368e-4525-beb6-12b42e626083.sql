-- Force RLS for all users including table owner
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;

-- Drop all existing INSERT policies to ensure clean state
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

-- Create a new permissive INSERT policy for public access
CREATE POLICY "Public can submit leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);