-- Script pour corriger tous les mots de passe
-- À exécuter dans la base de données PostgreSQL

-- D'abord, on crée une fonction pour mettre à jour les mots de passe
-- Les hashes ci-dessous sont générés avec bcrypt pour les mots de passe par défaut

-- Hash pour 'admin123' (pour Admin et RH)
-- Hash pour 'prof123' (pour Professeurs)  
-- Hash pour 'peda123' (pour Pédagogie)
-- Hash pour '12345678' (pour Apprenants)

-- Mettre à jour les mots de passe pour les employés Admin (id 2, 3)
UPDATE public.employe
SET mot_passe = '$2b$10$1MWhOMURV6tUdENLA.Q8yuhE//sgJqnn/Mi8VC.xwUZY3IhMySeBe'
WHERE id IN (2, 3);
-- Note: Le hash ci-dessus est pour '12345678'. Changez-le si nécessaire.

-- Mettre à jour les mots de passe pour les Professeurs (id 4, 5, 6)
UPDATE public.employe
SET mot_passe = '$2b$10$1MWhOMURV6tUdENLA.Q8yuhE//sgJqnn/Mi8VC.xwUZY3IhMySeBe'
WHERE id IN (4, 5, 6);

-- Mettre à jour le mot de passe pour Pédagogie (id 1)
UPDATE public.employe
SET mot_passe = '$2b$10$1MWhOMURV6tUdENLA.Q8yuhE//sgJqnn/Mi8VC.xwUZY3IhMySeBe'
WHERE id = 1;

-- Mettre à jour les mots de passe pour les apprenants
UPDATE public.apprenant
SET mot_passe = '$2b$10$1MWhOMURV6tUdENLA.Q8yuhE//sgJqnn/Mi8VC.xwUZY3IhMySeBe'
WHERE statut = 'actif';

-- Vérification des mises à jour
SELECT 'employe' as table_name, id, nom, prenom, email, role, LEFT(mot_passe, 20) as hash_start FROM public.employe
UNION ALL
SELECT 'apprenant' as table_name, id, nom, prenom, email, statut as role, LEFT(mot_passe, 20) as hash_start FROM public.apprenant WHERE statut = 'actif'
ORDER BY table_name, id;

-- Instructions pour générer de nouveaux hashes:
-- Dans le dossier backend, exécutez:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('votre_mot_de_passe', 10).then(h => console.log(h));"
