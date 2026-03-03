-- Migration pour corriger l'authentification des apprenants et professeurs
-- Exécuter ce fichier dans votre base de données PostgreSQL

-- 1. Ajouter la colonne mot_passe à la table apprenant si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apprenant' AND column_name = 'mot_passe'
    ) THEN
        ALTER TABLE public.apprenant 
        ADD COLUMN mot_passe character varying(255);
    END IF;
END $$;

-- 2. Mettre à jour le mot de passe par défaut pour les apprenants existants (hash bcrypt de '12345678')
-- Le hash ci-dessous correspond à '12345678' avec bcrypt (cost factor 10)
UPDATE public.apprenant
SET mot_passe = '$2b$10$LtSGA842bjqnSQ9MyIexc.n24M19kZ5lq3905WiVxJ91JtGE4aJEC'
WHERE mot_passe IS NULL;

-- 3. Ajouter une contrainte NOT NULL après avoir mis à jour les lignes existantes
ALTER TABLE public.apprenant 
ALTER COLUMN mot_passe SET NOT NULL;

-- 4. Ajouter un index pour optimiser la recherche par email/téléphone
CREATE INDEX IF NOT EXISTS idx_apprenant_email ON public.apprenant USING btree (email);
CREATE INDEX IF NOT EXISTS idx_apprenant_tel ON public.apprenant USING btree (tel);
CREATE INDEX IF NOT EXISTS idx_apprenant_statut ON public.apprenant USING btree (statut);

-- 5. Vérifier les professeurs dans la table employe
-- Les professeurs doivent avoir le role 'Professeurs' ou 'professeurs' dans la table employe
-- Cette requête affiche les professeurs actuels
SELECT e.id, e.nom, e.prenom, e.email, e.tel, e.role, p.id as professeur_id, p.specialite_niveaux
FROM public.employe e
INNER JOIN public.professeur p ON p.id_employe = e.id
WHERE LOWER(e.role) LIKE '%professeur%';

-- 6. Si nécessaire, mettre à jour le rôle des employés qui sont dans la table professeur mais n'ont pas le bon rôle
-- Décommenter la ligne suivante si nécessaire :
-UPDATE public.employe e SET role = 'Professeurs' WHERE e.id IN (SELECT id_employe FROM public.professeur) AND LOWER(e.role) NOT LIKE '%professeur%';

COMMENT ON COLUMN public.apprenant.mot_passe IS 'Mot de passe hashé avec bcrypt pour l''authentification';
