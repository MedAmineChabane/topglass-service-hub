-- Ajouter des contraintes de validation sur la table leads
ALTER TABLE public.leads
ADD CONSTRAINT leads_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT leads_phone_format CHECK (phone ~* '^0[1-9][0-9]{8}$'),
ADD CONSTRAINT leads_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
ADD CONSTRAINT leads_location_not_empty CHECK (char_length(location) >= 2),
ADD CONSTRAINT leads_vehicle_brand_not_empty CHECK (char_length(vehicle_brand) >= 1),
ADD CONSTRAINT leads_vehicle_type_not_empty CHECK (char_length(vehicle_type) >= 1),
ADD CONSTRAINT leads_glass_type_valid CHECK (glass_type IN ('vitrage', 'carrosserie'));

-- Créer une table pour le rate limiting
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Index pour optimiser les requêtes de rate limiting
CREATE INDEX idx_rate_limits_ip_endpoint ON public.rate_limits(ip_address, endpoint);
CREATE INDEX idx_rate_limits_window ON public.rate_limits(window_start);

-- Activer RLS sur rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre les insertions depuis les edge functions (service role)
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Fonction pour nettoyer les anciennes entrées de rate limiting (plus de 1 heure)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE window_start < now() - interval '1 hour';
END;
$$;