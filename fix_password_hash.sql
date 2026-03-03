-- Correction des mots de passe pour les apprenants
-- Le hash correct pour '12345678' avec bcrypt

-- Mettre à jour le mot de passe pour tous les apprenants
UPDATE public.apprenant
SET mot_passe = '$2b$10$1MWhOMURV6tUdENLA.Q8yuhE//sgJqnn/Mi8VC.xwUZY3IhMySeBe'
WHERE statut = 'actif';

-- Vérifier la mise à jour
SELECT id, nom, prenom, email, tel, statut, 
       LEFT(mot_passe, 20) as mot_passe_start
FROM public.apprenant
WHERE statut = 'actif';
