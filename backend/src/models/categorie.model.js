// src/models/categorie.model.js
import pool from '../config/db.js';

// Récupérer toutes les catégories avec le nom du type_cours
export const getAllCategories = async () => {
  const query = `
    SELECT 
      c.id,
      c.nom_categorie,
      c.id_type_cours,
      c.min_age,
      c.max_age,
      tc.nom_type_cours
    FROM categorie c
    JOIN type_cours tc ON c.id_type_cours = tc.id
    ORDER BY c.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer une catégorie par ID
export const getCategorieById = async (id) => {
  const query = `
    SELECT 
      c.id,
      c.nom_categorie,
      c.id_type_cours,
      c.min_age,
      c.max_age,
      tc.nom_type_cours
    FROM categorie c
    JOIN type_cours tc ON c.id_type_cours = tc.id
    WHERE c.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer une nouvelle catégorie
export const createCategorie = async (nom_categorie, id_type_cours, min_age = null, max_age = null) => {
  const query = `
    INSERT INTO categorie (nom_categorie, id_type_cours, min_age, max_age)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nom_categorie, id_type_cours, min_age, max_age;
  `;
  const result = await pool.query(query, [nom_categorie, id_type_cours, min_age, max_age]);
  return result.rows[0];
};

// Mettre à jour une catégorie
export const updateCategorie = async (id, nom_categorie, id_type_cours, min_age = null, max_age = null) => {
  const query = `
    UPDATE categorie
    SET nom_categorie = $1, id_type_cours = $2, min_age = $3, max_age = $4
    WHERE id = $5
    RETURNING id, nom_categorie, id_type_cours, min_age, max_age;
  `;
  const result = await pool.query(query, [nom_categorie, id_type_cours, min_age, max_age, id]);
  return result.rows[0];
};

// Supprimer une catégorie
export const deleteCategorie = async (id) => {
  const query = 'DELETE FROM categorie WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Vérifier qu’un type_cours existe
export const doesTypeCoursExist = async (id_type_cours) => {
  const result = await pool.query('SELECT 1 FROM type_cours WHERE id = $1', [id_type_cours]);
  return result.rowCount > 0;
};