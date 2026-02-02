-- Supprimer la politique incorrecte
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;

-- Créer une politique qui fonctionne réellement pour le rôle 'anon' de Supabase
CREATE POLICY "Enable insert for anon users"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);