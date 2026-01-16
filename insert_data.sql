
-- 11. Insérer des inscriptions
INSERT INTO inscription (id_creneau, num_carte, etat_inscription, sexe, nom, prenom, date_n, adresse, tel, id_motivation, etablissement, niveau_scolaire, lieu_n, nationalite) VALUES 
(1, ' Si2512', TRUE, 'M', 'Dupont', 'Jean', '1995-03-12', '12 rue de la Paix, Paris', '0123456789', 1, 'Université Paris-Sud', 'Licence', 'Paris', 'malagasy'),
(1, '2513', TRUE, 'F', 'Martin', 'Sophie', '1988-07-22', '5 avenue des Champs, Lyon', '0612345678', 2, 'Entreprise ABC', 'Bac+2', 'Lyon', 'malagasy'),
(2, '2514', TRUE, 'M', 'Bernard', 'Thomas', '1992-11-05', '8 boulevard Haussmann, Marseille', '0712345678', 3, 'Étudiant libre', 'Bac+3', 'Marseille', 'malagasy'),
(2, '2515', FALSE, 'F', 'Petit', 'Claire', '1985-01-30', '22 rue du Bac, Bordeaux', '0512345678', 4, 'Faculté de Lettres', 'Master', 'Bordeaux', 'malagasy'),
(3, '2516', TRUE, 'M', 'Robert', 'Pierre', '1990-09-14', '35 allée des Arbres, Toulouse', '0555667788', 5, 'Formation continue', 'Bac+4', 'Toulouse', 'malagasy'),
(4, '2517', TRUE, 'F', 'Dubois', 'Marie', '1993-12-03', '17 place de la République, Nice', '0698765432', 6, 'École d''ingénieurs', '', '', '', '');
-- 12. Insérer des groupes
INSERT INTO groupe (id_creneau, numero_groupe, id_employe_prof) VALUES 
(1, 1, NULL), -- Groupe 1 pour le créneau 1
(2, 1, NULL), -- Groupe 1 pour le créneau 2
(3, 1, NULL), -- Groupe 1 pour le créneau 3
(1, 2, NULL), -- Groupe 2 pour le créneau 1 (car >20 personnes)
(4, 1, NULL), -- Groupe 1 pour le créneau 4
(5, 1, NULL); -- Groupe 1 pour le créneau 5

-- 13. Insérer des affectations de salles
INSERT INTO affectation_salle (id_groupe, date_cours, id_salle) VALUES 
(1, '2026-01-26', 1), -- Groupe 1, lundi, Salle A101
(1, '2026-01-28', 2), -- Groupe 1, mercredi, Salle A102
(2, '2026-01-27', 3), -- Groupe 2, mardi, Salle B201
(2, '2026-01-29', 4), -- Groupe 2, jeudi, Salle B202
(3, '2026-02-01', 5), -- Groupe 3, vendredi, Salle C3
01
(4, '2026-01-26', 6); -- Groupe 4, lundi, Labo Info 1

-- 14. Insérer des présences
INSERT INTO presence (id_inscription, id_groupe, date_cours, est_present, heure_arrivee, remarque, id_employe_saisie) VALUES 
(1, 1, '2026-01-26', TRUE, '08:55', 'Arrivée à l''heure', NULL),
(2, 1, '2026-01-26', TRUE, '09:02', 'Légèrement en retard', NULL),
(3, 2, '2026-01-27', FALSE, NULL, 'Absence justifiée', NULL),
(4, 2, '2026-01-27', TRUE, '09:58', 'Très ponctuelle', NULL),
(5, 3, '2026-02-01', TRUE, '09:28', 'En retard', NULL),
(1, 1, '2026-01-28', TRUE, '13:58', 'Présente avant le cours', NULL);

-- 15. Insérer des examens
INSERT INTO examen (id_inscription, etat_inscription, auto_inscription, verification) VALUES 
(1, TRUE, TRUE, FALSE),
(2, TRUE, FALSE, TRUE),
(3, FALSE, TRUE, FALSE),
(4, TRUE, FALSE, TRUE),
(5, TRUE, TRUE, TRUE),
(6, FALSE, FALSE, FALSE);
