// src/models/activite.model.js
import pool from '../config/db.js';

// Récupérer toutes les activités
export const getAllActivites = async () => {
  const result = await pool.query('SELECT * FROM activite ORDER BY id');
  return result.rows;
};

// Récupérer une activité par ID
export const getActiviteById = async (id) => {
  const result = await pool.query('SELECT * FROM activite WHERE id = $1', [id]);
  return result.rows[0];
};

// Créer une nouvelle activité
export const createActivite = async (nom_activite) => {
  const result = await pool.query(
    'INSERT INTO activite (nom_activite) VALUES ($1) RETURNING *',
    [nom_activite]
  );
  return result.rows[0];
};

// Mettre à jour une activité
export const updateActivite = async (id, nom_activite) => {
  const result = await pool.query(
    'UPDATE activite SET nom_activite = $1 WHERE id = $2 RETURNING *',
    [nom_activite, id]
  );
  return result.rows[0];
};

// Supprimer une activité
export const deleteActivite = async (id) => {
  const result = await pool.query('DELETE FROM activite WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};