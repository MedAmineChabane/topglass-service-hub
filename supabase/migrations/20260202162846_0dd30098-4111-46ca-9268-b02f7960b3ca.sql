-- Allow authenticated users to submit leads too (same as public quote form)
CREATE POLICY "Enable insert for authenticated users"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);
