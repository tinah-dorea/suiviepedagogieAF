-- =============================
-- CREATION DES TABLES PRINCIPALES
-- =============================

CREATE TABLE type_service (
    id SERIAL PRIMARY KEY,
    nom_service VARCHAR(20) NOT NULL
);

CREATE TABLE type_cours (
    id SERIAL PRIMARY KEY,
    id_type_service INT REFERENCES type_service(id) ON DELETE RESTRICT ON UPDATE CASCADE,
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
    id_type_cours INT REFERENCES type_cours(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    min_age INT,
    max_age INT
);

CREATE TABLE salle (
    id SERIAL PRIMARY KEY,
    nom_salle VARCHAR(10) NOT NULL,
    capacite_max INT
);

CREATE TABLE horaire (
    id SERIAL PRIMARY KEY,
    id_type_cours INT REFERENCES type_cours(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_niveau INT REFERENCES niveau(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_categorie INT REFERENCES categorie(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    jours_des_cours TEXT,
    heure_debut VARCHAR(5),
    heure_fin VARCHAR(5)
);

CREATE TABLE session (
    id SERIAL PRIMARY KEY,
    mois VARCHAR(10),
    annee INT,
    id_type_cours INT REFERENCES type_cours(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    date_fin_inscription DATE,
    date_debut DATE,
    date_fin DATE,
    date_exam DATE
);

CREATE TABLE motivation (
    id SERIAL PRIMARY KEY,
    nom_motivation VARCHAR(200)
);

-- =============================
-- EMPLOYES, ROLES, ACTIVITES
-- =============================

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nom_role VARCHAR(50) NOT NULL
);

CREATE TABLE activite (
    id SERIAL PRIMARY KEY,
    nom_activite VARCHAR(50) NOT NULL
);

CREATE TABLE role_activite (
    id SERIAL PRIMARY KEY,
    id_role INT REFERENCES role(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_activite INT REFERENCES activite(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE employe (
    id SERIAL PRIMARY KEY,
    service TEXT,
    fonction VARCHAR(50),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    age INT,
    adresse TEXT,
    tel VARCHAR(15),
    mot_passe VARCHAR(50) NOT NULL,
    id_role_activite INT REFERENCES role_activite(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- TABLE TEST NIVEAU
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

-- =============================
-- TABLE INSCRIPTION
-- =============================

CREATE TABLE inscription (
    id SERIAL PRIMARY KEY,
    id_type_cours INT REFERENCES type_cours(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_employe INT REFERENCES employe(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_session INT REFERENCES session(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_horaire INT REFERENCES horaire(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_niveau INT REFERENCES niveau(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    num_carte VARCHAR(20),
    etat_inscription BOOLEAN DEFAULT TRUE,
    sexe VARCHAR(10),
    nom TEXT,
    prenom TEXT,
    date_n DATE,
    adresse TEXT,
    tel VARCHAR(15),
    id_motivation INT REFERENCES motivation(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    etablissement TEXT,
    niveau_scolaire VARCHAR(50),
    lieu_n VARCHAR(100),
    nationalite VARCHAR(50),
    id_salle INT REFERENCES salle(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =============================
-- TABLE EXAMEN
-- =============================

CREATE TABLE examen (
    id SERIAL PRIMARY KEY,
    id_inscription INT REFERENCES inscription(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    etat_inscription BOOLEAN,
    auto_inscription BOOLEAN,
    verification BOOLEAN
);
