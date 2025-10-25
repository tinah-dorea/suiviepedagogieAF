// src/models/roleActivite.model.js
import pool from '../config/db.js';

// Récupérer toutes les associations avec détails
export const getAllRoleActivites = async () => {
  const query = `
    SELECT 
      ra.id,
      ra.id_role,
      ra.id_activite,
      r.nom_role,
      a.nom_activite
    FROM role_activite ra
    JOIN role r ON ra.id_role = r.id
    JOIN activite a ON ra.id_activite = a.id
    ORDER BY ra.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer une association par ID
export const getRoleActiviteById = async (id) => {
  const query = `
    SELECT 
      ra.id,
      ra.id_role,
      ra.id_activite,
      r.nom_role,
      a.nom_activite
    FROM role_activite ra
    JOIN role r ON ra.id_role = r.id
    JOIN activite a ON ra.id_activite = a.id
    WHERE ra.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer une association
export const createRoleActivite = async (id_role, id_activite) => {
  const query = `
    INSERT INTO role_activite (id_role, id_activite)
    VALUES ($1, $2)
    RETURNING id, id_role, id_activite;
  `;
  const result = await pool.query(query, [id_role, id_activite]);
  return result.rows[0];
};

// Mettre à jour une association
export const updateRoleActivite = async (id, id_role, id_activite) => {
  const query = `
    UPDATE role_activite
    SET id_role = $1, id_activite = $2
    WHERE id = $3
    RETURNING id, id_role, id_activite;
  `;
  const result = await pool.query(query, [id_role, id_activite, id]);
  return result.rows[0];
};

// Supprimer une association
export const deleteRoleActivite = async (id) => {
  const query = 'DELETE FROM role_activite WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Vérifier l’existence des entités liées
export const doesRoleExist = async (id) => {
  const res = await pool.query('SELECT 1 FROM role WHERE id = $1', [id]);
  return res.rowCount > 0;
};

export const doesActiviteExist = async (id) => {
  const res = await pool.query('SELECT 1 FROM activite WHERE id = $1', [id]);
  return res.rowCount > 0;
};

// Vérifier si la paire (id_role, id_activite) existe déjà (pour éviter les doublons logiques)
export const doesPairExist = async (id_role, id_activite) => {
  const res = await pool.query(
    'SELECT 1 FROM role_activite WHERE id_role = $1 AND id_activite = $2',
    [id_role, id_activite]
  );
  return res.rowCount > 0;
};