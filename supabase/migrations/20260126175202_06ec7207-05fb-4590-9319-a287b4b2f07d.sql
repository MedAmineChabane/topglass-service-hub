-- Allow anonymous users to upload only images for their leads
CREATE POLICY "Anyone can upload lead photos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'lead-attachments' AND
  storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);