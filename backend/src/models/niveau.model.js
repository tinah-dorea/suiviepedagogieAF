// src/models/niveau.model.js
import pool from '../config/db.js';

// Récupérer tous les niveaux (avec auto-référence pour sous_niveau)
export const getAllNiveaux = async () => {
  const query = `
    SELECT 
      n1.id,
      n1.nom_niveau,
      n1.sous_niveau,
      n2.nom_niveau AS nom_sous_niveau
    FROM niveau n1
    LEFT JOIN niveau n2 ON n1.sous_niveau = n2.id
    ORDER BY n1.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer un niveau par ID
export const getNiveauById = async (id) => {
  const query = `
    SELECT 
      n1.id,
      n1.nom_niveau,
      n1.sous_niveau,
      n2.nom_niveau AS nom_sous_niveau
    FROM niveau n1
    LEFT JOIN niveau n2 ON n1.sous_niveau = n2.id
    WHERE n1.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer un nouveau niveau
export const createNiveau = async (nom_niveau, sous_niveau = null) => {
  const query = `
    INSERT INTO niveau (nom_niveau, sous_niveau)
    VALUES ($1, $2)
    RETURNING id, nom_niveau, sous_niveau;
  `;
  const result = await pool.query(query, [nom_niveau, sous_niveau]);
  return result.rows[0];
};

// Mettre à jour un niveau
export const updateNiveau = async (id, nom_niveau, sous_niveau = null) => {
  const query = `
    UPDATE niveau
    SET nom_niveau = $1, sous_niveau = $2
    WHERE id = $3
    RETURNING id, nom_niveau, sous_niveau;
  `;
  const result = await pool.query(query, [nom_niveau, sous_niveau, id]);
  return result.rows[0];
};

// Supprimer un niveau
export const deleteNiveau = async (id) => {
  const query = 'DELETE FROM niveau WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Vérifier qu’un niveau parent existe (pour validation de sous_niveau)
export const doesNiveauExist = async (id) => {
  if (id === null || id === undefined) return true;
  const result = await pool.query('SELECT 1 FROM niveau WHERE id = $1', [id]);
  return result.rowCount > 0;
};