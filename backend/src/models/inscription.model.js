// src/models/inscription.model.js
import pool from '../config/db.js';

// Récupérer toutes les inscriptions avec jointures
export const getAllInscriptions = async () => {
  const query = `
    SELECT 
      i.id,
      i.id_type_cours,
      i.id_employe,
      i.id_session,
      i.id_horaire,
      i.id_niveau,
      i.num_carte,
      i.etat_inscription,
      i.sexe,
      i.nom,
      i.prenom,
      i.date_n,
      i.adresse,
      i.tel,
      i.id_motivation,
      i.etablissement,
      i.niveau_scolaire,
      i.lieu_n,
      i.nationalite,
      i.id_salle,
      tc.nom_type_cours,
      e.nom AS employe_nom,
      s.mois AS session_mois,
      h.jours_des_cours,
      n.nom_niveau,
      m.nom_motivation,
      sa.nom_salle
    FROM inscription i
    LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
    LEFT JOIN employe e ON i.id_employe = e.id
    LEFT JOIN session s ON i.id_session = s.id
    LEFT JOIN horaire h ON i.id_horaire = h.id
    LEFT JOIN niveau n ON i.id_niveau = n.id
    LEFT JOIN motivation m ON i.id_motivation = m.id
    LEFT JOIN salle sa ON i.id_salle = sa.id
    ORDER BY i.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer une inscription par ID
export const getInscriptionById = async (id) => {
  const query = `
    SELECT 
      i.id,
      i.id_type_cours,
      i.id_employe,
      i.id_session,
      i.id_horaire,
      i.id_niveau,
      i.num_carte,
      i.etat_inscription,
      i.sexe,
      i.nom,
      i.prenom,
      i.date_n,
      i.adresse,
      i.tel,
      i.id_motivation,
      i.etablissement,
      i.niveau_scolaire,
      i.lieu_n,
      i.nationalite,
      i.id_salle,
      tc.nom_type_cours,
      e.nom AS employe_nom,
      s.mois AS session_mois,
      h.jours_des_cours,
      n.nom_niveau,
      m.nom_motivation,
      sa.nom_salle
    FROM inscription i
    LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
    LEFT JOIN employe e ON i.id_employe = e.id
    LEFT JOIN session s ON i.id_session = s.id
    LEFT JOIN horaire h ON i.id_horaire = h.id
    LEFT JOIN niveau n ON i.id_niveau = n.id
    LEFT JOIN motivation m ON i.id_motivation = m.id
    LEFT JOIN salle sa ON i.id_salle = sa.id
    WHERE i.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer une inscription
export const createInscription = async (data) => {
  const {
    id_type_cours,
    id_employe,
    id_session,
    id_horaire,
    id_niveau,
    num_carte,
    etat_inscription,
    sexe,
    nom,
    prenom,
    date_n,
    adresse,
    tel,
    id_motivation,
    etablissement,
    niveau_scolaire,
    lieu_n,
    nationalite,
    id_salle
  } = data;

  const query = `
    INSERT INTO inscription (
      id_type_cours, id_employe, id_session, id_horaire, id_niveau,
      num_carte, etat_inscription, sexe, nom, prenom, date_n, adresse,
      tel, id_motivation, etablissement, niveau_scolaire, lieu_n, nationalite, id_salle
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING *;
  `;

  const values = [
    id_type_cours,
    id_employe,
    id_session,
    id_horaire,
    id_niveau,
    num_carte || null,
    etat_inscription ?? true,
    sexe || null,
    nom || null,
    prenom || null,
    date_n || null,
    adresse || null,
    tel || null,
    id_motivation,
    etablissement || null,
    niveau_scolaire || null,
    lieu_n || null,
    nationalite || null,
    id_salle
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Mettre à jour une inscription
export const updateInscription = async (id, data) => {
  const {
    id_type_cours,
    id_employe,
    id_session,
    id_horaire,
    id_niveau,
    num_carte,
    etat_inscription,
    sexe,
    nom,
    prenom,
    date_n,
    adresse,
    tel,
    id_motivation,
    etablissement,
    niveau_scolaire,
    lieu_n,
    nationalite,
    id_salle
  } = data;

  const query = `
    UPDATE inscription SET
      id_type_cours = $1,
      id_employe = $2,
      id_session = $3,
      id_horaire = $4,
      id_niveau = $5,
      num_carte = $6,
      etat_inscription = $7,
      sexe = $8,
      nom = $9,
      prenom = $10,
      date_n = $11,
      adresse = $12,
      tel = $13,
      id_motivation = $14,
      etablissement = $15,
      niveau_scolaire = $16,
      lieu_n = $17,
      nationalite = $18,
      id_salle = $19
    WHERE id = $20
    RETURNING *;
  `;

  const values = [
    id_type_cours,
    id_employe,
    id_session,
    id_horaire,
    id_niveau,
    num_carte || null,
    etat_inscription ?? true,
    sexe || null,
    nom || null,
    prenom || null,
    date_n || null,
    adresse || null,
    tel || null,
    id_motivation,
    etablissement || null,
    niveau_scolaire || null,
    lieu_n || null,
    nationalite || null,
    id_salle,
    id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Supprimer une inscription
export const deleteInscription = async (id) => {
  const query = 'DELETE FROM inscription WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fonctions de validation d’existence
const tables = {
  type_cours: 'type_cours',
  employe: 'employe',
  session: 'session',
  horaire: 'horaire',
  niveau: 'niveau',
  motivation: 'motivation',
  salle: 'salle'
};

export const doesEntityExist = async (table, id) => {
  if (id === null || id === undefined) return false;
  const res = await pool.query(`SELECT 1 FROM ${table} WHERE id = $1`, [id]);
  return res.rowCount > 0;
};