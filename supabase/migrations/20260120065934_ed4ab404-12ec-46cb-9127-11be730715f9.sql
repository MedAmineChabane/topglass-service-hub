-- Ajouter la colonne registration_plate pour stocker l'immatriculation
ALTER TABLE public.leads 
ADD COLUMN registration_plate text;

-- Ajouter contrainte de format plaque française (format AA-123-AA)
ALTER TABLE public.leads
ADD CONSTRAINT leads_registration_format 
CHECK (registration_plate IS NULL OR registration_plate ~* '^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$');