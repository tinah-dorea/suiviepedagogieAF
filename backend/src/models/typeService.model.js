import pool from '../config/db.js';

// Récupérer tous les type_service
export const getAllTypeServices = async () => {
  const result = await pool.query('SELECT * FROM type_service ORDER BY id');
  return result.rows;
};

// Récupérer un type_service par ID
export const getTypeServiceById = async (id) => {
  const result = await pool.query('SELECT * FROM type_service WHERE id = $1', [id]);
  return result.rows[0];
};

// Créer un nouveau type_service
export const createTypeService = async (nom_service) => {
  const result = await pool.query(
    'INSERT INTO type_service (nom_service) VALUES ($1) RETURNING *',
    [nom_service]
  );
  return result.rows[0];
};

// Mettre à jour un type_service
export const updateTypeService = async (id, nom_service) => {
  const result = await pool.query(
    'UPDATE type_service SET nom_service = $1 WHERE id = $2 RETURNING *',
    [nom_service, id]
  );
  return result.rows[0];
};

// Supprimer un type_service
export const deleteTypeService = async (id) => {
  const result = await pool.query('DELETE FROM type_service WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};