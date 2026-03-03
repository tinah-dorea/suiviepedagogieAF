-- Script pour corriger les mots de passe dans la base de données
-- Exécuter ce fichier avec psql ou pgAdmin

-- Mise à jour des mots de passe pour les employés
-- Admin (id 2, 3) - mot de passe: admin123
UPDATE public.employe
SET mot_passe = '$2b$10$04NbXg9BoiTBAs7HGhlqoui7onox9BMakWrjyJpTFQRVfpkiWzBAa'
WHERE id IN (2, 3);

-- Professeurs (id 4, 5, 6) - mot de passe: prof123
UPDATE public.employe
SET mot_passe = '$2b$10$6JTwrgNE0H4KK3zIBIFhVeNDlAYYSVqC2bapc035rWi4ofsQrqetC'
WHERE id IN (4, 5, 6);

-- Pédagogie (id 1) - mot de passe: peda123
UPDATE public.employe
SET mot_passe = '$2b$10$yvkY1oRfuxVNvrGz10tEP.YCaL5vHThrVhBfqsF3/ad9tA/dfIu6a'
WHERE id = 1;

-- Mise à jour des mots de passe pour les apprenants - mot de passe: 12345678
UPDATE public.apprenant
SET mot_passe = '$2b$10$LtSGA842bjqnSQ9MyIexc.n24M19kZ5lq3905WiVxJ91JtGE4aJEC'
WHERE statut = 'actif';

-- Vérification des mises à jour
SELECT 'employe' as "Table", id, nom, prenom, email, role, LEFT(mot_passe, 15) as "Hash (partiel)" FROM public.employe
UNION ALL
SELECT 'apprenant' as "Table", id, nom, prenom, email, statut as role, LEFT(mot_passe, 15) as "Hash (partiel)" FROM public.apprenant WHERE statut = 'actif'
ORDER BY "Table", id;
