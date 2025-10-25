// src/models/horaire.model.js
import pool from '../config/db.js';

// Récupérer tous les horaires avec jointures
export const getAllHoraires = async () => {
  const query = `
    SELECT 
      h.id,
      h.id_type_cours,
      h.id_niveau,
      h.id_categorie,
      h.jours_des_cours,
      h.heure_debut,
      h.heure_fin,
      tc.nom_type_cours,
      n.nom_niveau AS nom_niveau,
      c.nom_categorie
    FROM horaire h
    JOIN type_cours tc ON h.id_type_cours = tc.id
    JOIN niveau n ON h.id_niveau = n.id
    JOIN categorie c ON h.id_categorie = c.id
    ORDER BY h.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer un horaire par ID
export const getHoraireById = async (id) => {
  const query = `
    SELECT 
      h.id,
      h.id_type_cours,
      h.id_niveau,
      h.id_categorie,
      h.jours_des_cours,
      h.heure_debut,
      h.heure_fin,
      tc.nom_type_cours,
      n.nom_niveau,
      c.nom_categorie
    FROM horaire h
    JOIN type_cours tc ON h.id_type_cours = tc.id
    JOIN niveau n ON h.id_niveau = n.id
    JOIN categorie c ON h.id_categorie = c.id
    WHERE h.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer un horaire
export const createHoraire = async (id_type_cours, id_niveau, id_categorie, jours_des_cours, heure_debut, heure_fin) => {
  const query = `
    INSERT INTO horaire (id_type_cours, id_niveau, id_categorie, jours_des_cours, heure_debut, heure_fin)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    id_type_cours,
    id_niveau,
    id_categorie,
    jours_des_cours,
    heure_debut,
    heure_fin
  ]);
  return result.rows[0];
};

// Mettre à jour un horaire
export const updateHoraire = async (id, id_type_cours, id_niveau, id_categorie, jours_des_cours, heure_debut, heure_fin) => {
  const query = `
    UPDATE horaire
    SET 
      id_type_cours = $1,
      id_niveau = $2,
      id_categorie = $3,
      jours_des_cours = $4,
      heure_debut = $5,
      heure_fin = $6
    WHERE id = $7
    RETURNING *;
  `;
  const result = await pool.query(query, [
    id_type_cours,
    id_niveau,
    id_categorie,
    jours_des_cours,
    heure_debut,
    heure_fin,
    id
  ]);
  return result.rows[0];
};

// Supprimer un horaire
export const deleteHoraire = async (id) => {
  const query = 'DELETE FROM horaire WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fonctions de validation d’existence
export const doesTypeCoursExist = async (id) => {
  const res = await pool.query('SELECT 1 FROM type_cours WHERE id = $1', [id]);
  return res.rowCount > 0;
};

export const doesNiveauExist = async (id) => {
  const res = await pool.query('SELECT 1 FROM niveau WHERE id = $1', [id]);
  return res.rowCount > 0;
};

export const doesCategorieExist = async (id) => {
  const res = await pool.query('SELECT 1 FROM categorie WHERE id = $1', [id]);
  return res.rowCount > 0;
};