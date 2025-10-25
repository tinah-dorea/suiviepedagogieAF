// src/models/role.model.js
import pool from '../config/db.js';

// Récupérer tous les rôles
export const getAllRoles = async () => {
  const result = await pool.query('SELECT * FROM role ORDER BY id');
  return result.rows;
};

// Récupérer un rôle par ID
export const getRoleById = async (id) => {
  const result = await pool.query('SELECT * FROM role WHERE id = $1', [id]);
  return result.rows[0];
};

// Créer un nouveau rôle
export const createRole = async (nom_role) => {
  const result = await pool.query(
    'INSERT INTO role (nom_role) VALUES ($1) RETURNING *',
    [nom_role]
  );
  return result.rows[0];
};

// Mettre à jour un rôle
export const updateRole = async (id, nom_role) => {
  const result = await pool.query(
    'UPDATE role SET nom_role = $1 WHERE id = $2 RETURNING *',
    [nom_role, id]
  );
  return result.rows[0];
};

// Supprimer un rôle
export const deleteRole = async (id) => {
  const result = await pool.query('DELETE FROM role WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};