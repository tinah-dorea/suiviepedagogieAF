// src/models/typeCours.model.js
import pool from '../config/db.js';

// Récupérer tous les type_cours avec le nom du service
export const getAllTypeCours = async () => {
  const query = `
    SELECT 
      tc.id,
      tc.nom_type_cours,
      tc.id_type_service,
      ts.nom_service
    FROM type_cours tc
    JOIN type_service ts ON tc.id_type_service = ts.id
    ORDER BY tc.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer un type_cours par ID
export const getTypeCoursById = async (id) => {
  const query = `
    SELECT 
      tc.id,
      tc.nom_type_cours,
      tc.id_type_service,
      ts.nom_service
    FROM type_cours tc
    JOIN type_service ts ON tc.id_type_service = ts.id
    WHERE tc.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer un nouveau type_cours
export const createTypeCours = async (id_type_service, nom_type_cours) => {
  const query = `
    INSERT INTO type_cours (id_type_service, nom_type_cours)
    VALUES ($1, $2)
    RETURNING id, id_type_service, nom_type_cours;
  `;
  const result = await pool.query(query, [id_type_service, nom_type_cours]);
  return result.rows[0];
};

// Mettre à jour un type_cours
export const updateTypeCours = async (id, id_type_service, nom_type_cours) => {
  const query = `
    UPDATE type_cours
    SET id_type_service = $1, nom_type_cours = $2
    WHERE id = $3
    RETURNING id, id_type_service, nom_type_cours;
  `;
  const result = await pool.query(query, [id_type_service, nom_type_cours, id]);
  return result.rows[0];
};

// Supprimer un type_cours
export const deleteTypeCours = async (id) => {
  const query = 'DELETE FROM type_cours WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Vérifier qu’un type_service existe (utile pour validation)
export const doesTypeServiceExist = async (id_type_service) => {
  const result = await pool.query('SELECT 1 FROM type_service WHERE id = $1', [id_type_service]);
  return result.rowCount > 0;
};