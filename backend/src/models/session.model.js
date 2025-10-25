// src/models/session.model.js
import pool from '../config/db.js';

// Récupérer toutes les sessions avec le nom du type_cours
export const getAllSessions = async () => {
  const query = `
    SELECT 
      s.id,
      s.mois,
      s.annee,
      s.id_type_cours,
      s.date_fin_inscription,
      s.date_debut,
      s.date_fin,
      s.date_exam,
      tc.nom_type_cours
    FROM session s
    JOIN type_cours tc ON s.id_type_cours = tc.id
    ORDER BY s.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer une session par ID
export const getSessionById = async (id) => {
  const query = `
    SELECT 
      s.id,
      s.mois,
      s.annee,
      s.id_type_cours,
      s.date_fin_inscription,
      s.date_debut,
      s.date_fin,
      s.date_exam,
      tc.nom_type_cours
    FROM session s
    JOIN type_cours tc ON s.id_type_cours = tc.id
    WHERE s.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer une session
export const createSession = async (mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam) => {
  const query = `
    INSERT INTO session (mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    mois,
    annee,
    id_type_cours,
    date_fin_inscription,
    date_debut,
    date_fin,
    date_exam
  ]);
  return result.rows[0];
};

// Mettre à jour une session
export const updateSession = async (id, mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam) => {
  const query = `
    UPDATE session
    SET 
      mois = $1,
      annee = $2,
      id_type_cours = $3,
      date_fin_inscription = $4,
      date_debut = $5,
      date_fin = $6,
      date_exam = $7
    WHERE id = $8
    RETURNING *;
  `;
  const result = await pool.query(query, [
    mois,
    annee,
    id_type_cours,
    date_fin_inscription,
    date_debut,
    date_fin,
    date_exam,
    id
  ]);
  return result.rows[0];
};

// Supprimer une session
export const deleteSession = async (id) => {
  const query = 'DELETE FROM session WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Vérifier qu’un type_cours existe
export const doesTypeCoursExist = async (id) => {
  const res = await pool.query('SELECT 1 FROM type_cours WHERE id = $1', [id]);
  return res.rowCount > 0;
};