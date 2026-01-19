-- Create storage bucket for lead attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-attachments', 'lead-attachments', false);

-- Allow admins to view attachments
CREATE POLICY "Admins can view lead attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'lead-attachments' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to upload attachments
CREATE POLICY "Admins can upload lead attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'lead-attachments' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete attachments
CREATE POLICY "Admins can delete lead attachments"
ON storage.objects
FOR DELETE
USING (bucket_id = 'lead-attachments' AND has_role(auth.uid(), 'admin'::app_role));

-- Add attachments column to leads table (array of file paths)
ALTER TABLE public.leads 
ADD COLUMN attachments text[] DEFAULT '{}'::text[];

-- Add notes column for internal notes
ALTER TABLE public.leads
ADD COLUMN notes text;