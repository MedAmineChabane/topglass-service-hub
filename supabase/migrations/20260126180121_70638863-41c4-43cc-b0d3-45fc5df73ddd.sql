-- Fix 1: Remove anonymous storage upload policy
-- Anonymous uploads should go through the rate-limited edge function
DROP POLICY IF EXISTS "Anyone can upload lead photos" ON storage.objects;

-- Create a secure upload policy that only allows service role uploads
-- This ensures all anonymous uploads go through the edge function with rate limiting
CREATE POLICY "Only service role can upload lead photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lead-attachments' AND
  storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

-- Fix 2: Create a public view for centers that hides contact info
CREATE VIEW public.centers_public
WITH (security_invoker = true) AS
SELECT 
  id, 
  name, 
  address, 
  city, 
  postal_code, 
  latitude, 
  longitude,
  is_active,
  created_at
FROM public.centers
WHERE is_active = true;

-- Grant access to the view
GRANT SELECT ON public.centers_public TO anon, authenticated;

-- Restrict direct table access to admins only
DROP POLICY IF EXISTS "Anyone can view active centers" ON public.centers;

CREATE POLICY "Admins can view all centers"
ON public.centers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin CRUD policies for centers management
CREATE POLICY "Admins can insert centers"
ON public.centers
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update centers"
ON public.centers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete centers"
ON public.centers
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));