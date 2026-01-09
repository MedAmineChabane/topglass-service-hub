-- Create leads table for form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_type TEXT NOT NULL,
  glass_type TEXT NOT NULL,
  vehicle_brand TEXT NOT NULL,
  location TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new'
);

-- Create centers table for service points
CREATE TABLE public.centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;

-- Public can insert leads (form submissions)
CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Public can view centers (for location display)
CREATE POLICY "Anyone can view active centers"
ON public.centers
FOR SELECT
USING (is_active = true);

-- Insert sample centers for Marseille area
INSERT INTO public.centers (name, address, city, postal_code, phone, latitude, longitude) VALUES
('Topglass Marseille Centre', '45 Boulevard Baille', 'Marseille', '13006', '04 91 00 00 01', 43.2889, 5.3864),
('Topglass Marseille Nord', '123 Avenue de Saint-Antoine', 'Marseille', '13015', '04 91 00 00 02', 43.3367, 5.3699),
('Topglass Aix-en-Provence', '78 Cours Mirabeau', 'Aix-en-Provence', '13100', '04 42 00 00 01', 43.5263, 5.4474);