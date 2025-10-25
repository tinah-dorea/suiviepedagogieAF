// src/models/employe.model.js
import pool from '../config/db.js';

// Récupérer tous les employés avec détails de role_activite
export const getAllEmployes = async () => {
  const query = `
    SELECT 
      e.id,
      e.service,
      e.fonction,
      e.nom,
      e.prenom,
      e.age,
      e.adresse,
      e.tel,
      e.mot_passe,
      e.id_role_activite,
      e.date_creation,
      ra.id_role,
      ra.id_activite,
      r.nom_role,
      a.nom_activite
    FROM employe e
    LEFT JOIN role_activite ra ON e.id_role_activite = ra.id
    LEFT JOIN role r ON ra.id_role = r.id
    LEFT JOIN activite a ON ra.id_activite = a.id
    ORDER BY e.id;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer un employé par ID
export const getEmployeById = async (id) => {
  const query = `
    SELECT 
      e.id,
      e.service,
      e.fonction,
      e.nom,
      e.prenom,
      e.age,
      e.adresse,
      e.tel,
      e.mot_passe,
      e.id_role_activite,
      e.date_creation,
      ra.id_role,
      ra.id_activite,
      r.nom_role,
      a.nom_activite
    FROM employe e
    LEFT JOIN role_activite ra ON e.id_role_activite = ra.id
    LEFT JOIN role r ON ra.id_role = r.id
    LEFT JOIN activite a ON ra.id_activite = a.id
    WHERE e.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Créer un employé
export const createEmploye = async (data) => {
  const {
    service,
    fonction,
    nom,
    prenom,
    age,
    adresse,
    tel,
    mot_passe,
    id_role_activite
  } = data;

  const query = `
    INSERT INTO employe (
      service, fonction, nom, prenom, age, adresse, tel, mot_passe, id_role_activite
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    service || null,
    fonction || null,
    nom,
    prenom,
    age || null,
    adresse || null,
    tel || null,
    mot_passe,
    id_role_activite
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Mettre à jour un employé
export const updateEmploye = async (id, data) => {
  const {
    service,
    fonction,
    nom,
    prenom,
    age,
    adresse,
    tel,
    mot_passe,
    id_role_activite
  } = data;

  const query = `
    UPDATE employe SET
      service = $1,
      fonction = $2,
      nom = $3,
      prenom = $4,
      age = $5,
      adresse = $6,
      tel = $7,
      mot_passe = $8,
      id_role_activite = $9
    WHERE id = $10
    RETURNING *;
  `;

  const values = [
    service || null,
    fonction || null,
    nom || null,
    prenom || null,
    age || null,
    adresse || null,
    tel || null,
    mot_passe || null,
    id_role_activite || null,
    id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Supprimer un employé
export const deleteEmploye = async (id) => {
  const query = 'DELETE FROM employe WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Vérifier qu’une association role_activite existe
export const doesRoleActiviteExist = async (id) => {
  if (id === null || id === undefined) return true; // facultatif selon votre logique métier
  const res = await pool.query('SELECT 1 FROM role_activite WHERE id = $1', [id]);
  return res.rowCount > 0;
};