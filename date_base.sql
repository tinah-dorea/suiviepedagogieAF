

-- =============================
-- TABLES DE BASE (TYPES)
-- =============================

CREATE TABLE type_service (
    id SERIAL PRIMARY KEY,
    nom_service VARCHAR(20) NOT NULL
);

CREATE TABLE type_cours (
    id SERIAL PRIMARY KEY,
    id_type_service INT NOT NULL REFERENCES type_service(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    nom_type_cours VARCHAR(50) NOT NULL
);

CREATE TABLE niveau (
    id SERIAL PRIMARY KEY,
    nom_niveau VARCHAR(5) NOT NULL,
    sous_niveau INT
);

CREATE TABLE categorie (
    id SERIAL PRIMARY KEY,
    nom_categorie VARCHAR(10) NOT NULL,
    id_type_cours INT NOT NULL REFERENCES type_cours(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    min_age INT,
    max_age INT
);

CREATE TABLE salle (
    id SERIAL PRIMARY KEY,
    nom_salle VARCHAR(10) NOT NULL,
    capacite_max INT
);

CREATE TABLE motivation (
    id SERIAL PRIMARY KEY,
    nom_motivation VARCHAR(200)
);

-- =============================
-- EMPLOYÉS ET RÔLES
-- =============================

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nom_role VARCHAR(50) NOT NULL
);

CREATE TABLE employe (
    id SERIAL PRIMARY KEY,
    service TEXT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    age INT,
    adresse TEXT,
    tel VARCHAR(15),
    mot_passe VARCHAR(255) NOT NULL, -- Augmenté pour hash
    email VARCHAR(100) UNIQUE NOT NULL,
    id_role INT NOT NULL REFERENCES role(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    deactivated_at TIMESTAMP NULL,
    deactivated_by INT NULL REFERENCES employe(id) ON DELETE SET NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- SESSIONS
-- =============================

CREATE TABLE session (
    id SERIAL PRIMARY KEY,
    mois VARCHAR(10),
    annee INT NOT NULL,
    date_fin_inscription DATE NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    date_exam DATE
);

-- =============================
-- SESSION_COURS : instance d’un type de cours dans une session
-- =============================

CREATE TABLE session_cours (
    id SERIAL PRIMARY KEY,
    id_session INT NOT NULL REFERENCES session(id) ON DELETE CASCADE,
    id_type_cours INT NOT NULL REFERENCES type_cours(id),
    id_niveau INT REFERENCES niveau(id),
    id_categorie INT REFERENCES categorie(id),
    UNIQUE (id_session, id_type_cours, id_niveau, id_categorie)
);

-- =============================
-- CRENEAUX : horaires hebdomadaires d’un session_cours
-- =============================

CREATE TABLE creneau (
    id SERIAL PRIMARY KEY,
    id_session_cours INT NOT NULL REFERENCES session_cours(id) ON DELETE CASCADE,
    jour_semaine VARCHAR(10) NOT NULL CHECK (jour_semaine IN ('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche')),
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    CHECK (heure_fin > heure_debut)
);

-- =============================
-- INSCRIPTION : étudiant s’inscrit à un créneau
-- =============================

CREATE TABLE inscription (
    id SERIAL PRIMARY KEY,
    id_creneau INT NOT NULL REFERENCES creneau(id) ON DELETE RESTRICT,
    num_carte VARCHAR(20),
    etat_inscription BOOLEAN DEFAULT TRUE,
    sexe VARCHAR(10),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    date_n DATE,
    adresse TEXT,
    tel VARCHAR(15),
    id_motivation INT REFERENCES motivation(id) ON DELETE SET NULL,
    etablissement TEXT,
    niveau_scolaire VARCHAR(50),
    lieu_n VARCHAR(100),
    nationalite VARCHAR(50)
);

-- =============================
-- GROUPES : créés automatiquement si >21 inscrits à un créneau
-- =============================

CREATE TABLE groupe (
    id SERIAL PRIMARY KEY,
    id_creneau INT NOT NULL REFERENCES creneau(id) ON DELETE CASCADE,
    numero_groupe INT NOT NULL CHECK (numero_groupe >= 1),
    id_employe_prof INT REFERENCES employe(id) ON DELETE SET NULL,
    UNIQUE (id_creneau, numero_groupe)
);

-- =============================
-- AFFECTATION DES SALLES PAR JOUR ET PAR GROUPE
-- =============================

CREATE TABLE affectation_salle (
    id SERIAL PRIMARY KEY,
    id_groupe INT NOT NULL REFERENCES groupe(id) ON DELETE CASCADE,
    date_cours DATE NOT NULL,
    id_salle INT NOT NULL REFERENCES salle(id),
    UNIQUE (id_groupe, date_cours)
);

-- =============================
-- PRÉSENCES : saisies par le professeur, par groupe, par date
-- =============================

CREATE TABLE presence (
    id SERIAL PRIMARY KEY,
    id_inscription INT NOT NULL REFERENCES inscription(id) ON DELETE CASCADE,
    id_groupe INT NOT NULL REFERENCES groupe(id) ON DELETE CASCADE,
    date_cours DATE NOT NULL,
    est_present BOOLEAN DEFAULT TRUE,
    heure_arrivee TIME,
    remarque TEXT,
    id_employe_saisie INT REFERENCES employe(id) ON DELETE SET NULL,
    date_saisie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_inscription, id_groupe, date_cours)
);

-- =============================
-- TABLES SUPPLÉMENTAIRES (EXAMEN, TEST NIVEAU)
-- =============================

CREATE TABLE test_niveau (
    id SERIAL PRIMARY KEY,
    date_test DATE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    id_type_cours INT REFERENCES type_cours(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    po TEXT,
    pe TEXT,
    niveau_d VARCHAR(5),
    remarque VARCHAR(255),
    id_employe INT REFERENCES employe(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE examen (
    id SERIAL PRIMARY KEY,
    id_inscription INT NOT NULL REFERENCES inscription(id) ON DELETE CASCADE,
    etat_inscription BOOLEAN,
    auto_inscription BOOLEAN,
    verification BOOLEAN
);