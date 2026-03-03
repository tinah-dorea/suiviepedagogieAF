import { pool } from '../config/db.js';

// Récupérer tous les apprenants
const getAllApprenants = async (req, res) => {
  try {
    const query = `
      SELECT id, nom, prenom, date_n, sexe, adresse, tel, email, 
             nationalite, lieu_n, etablissement, niveau_scolaire, 
             date_premiere_inscription, statut
      FROM apprenant
      ORDER BY nom, prenom
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des apprenants:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des apprenants' });
  }
};

// Rechercher des apprenants par nom ou prénom
const searchApprenants = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    
    const query = `
      SELECT id, nom, prenom, date_n, sexe, adresse, tel, email, 
             nationalite, lieu_n, etablissement, niveau_scolaire, 
             date_premiere_inscription, statut
      FROM apprenant
      WHERE LOWER(nom) LIKE LOWER($1) 
         OR LOWER(prenom) LIKE LOWER($1)
         OR LOWER(email) LIKE LOWER($1)
      ORDER BY nom, prenom
      LIMIT 20
    `;
    const result = await pool.query(query, [`%${q}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la recherche d\'apprenants:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche' });
  }
};

// Récupérer un apprenant par ID
const getApprenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id, nom, prenom, date_n, sexe, adresse, tel, email, 
             nationalite, lieu_n, etablissement, niveau_scolaire, 
             date_premiere_inscription, statut
      FROM apprenant
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apprenant non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'apprenant:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un apprenant
const createApprenant = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      date_n,
      sexe,
      adresse,
      tel,
      email,
      nationalite,
      lieu_n,
      etablissement,
      niveau_scolaire,
      statut = 'actif',
      mot_passe
    } = req.body;

    // Hash du mot de passe par défaut si non fourni
    const bcrypt = await import('bcrypt');
    const defaultPassword = mot_passe || '12345678';
    const hashedPassword = await bcrypt.default.hash(defaultPassword, 10);

    const query = `
      INSERT INTO apprenant (
        nom, prenom, date_n, sexe, adresse, tel, email,
        nationalite, lieu_n, etablissement, niveau_scolaire, statut, mot_passe
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      nom,
      prenom,
      date_n || null,
      sexe || 'Autre',
      adresse || null,
      tel || null,
      email || null,
      nationalite || null,
      lieu_n || null,
      etablissement || null,
      niveau_scolaire || null,
      statut,
      hashedPassword
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'apprenant:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
};

// Mettre à jour un apprenant
const updateApprenant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      prenom,
      date_n,
      sexe,
      adresse,
      tel,
      email,
      nationalite,
      lieu_n,
      etablissement,
      niveau_scolaire,
      statut,
      mot_passe
    } = req.body;

    const bcrypt = await import('bcrypt');
    const hashedPassword = mot_passe ? await bcrypt.default.hash(mot_passe, 10) : null;

    const query = `
      UPDATE apprenant
      SET nom = COALESCE($1, nom),
          prenom = COALESCE($2, prenom),
          date_n = COALESCE($3, date_n),
          sexe = COALESCE($4, sexe),
          adresse = COALESCE($5, adresse),
          tel = COALESCE($6, tel),
          email = COALESCE($7, email),
          nationalite = COALESCE($8, nationalite),
          lieu_n = COALESCE($9, lieu_n),
          etablissement = COALESCE($10, etablissement),
          niveau_scolaire = COALESCE($11, niveau_scolaire),
          statut = COALESCE($12, statut),
          mot_passe = COALESCE($13, mot_passe)
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      nom,
      prenom,
      date_n,
      sexe,
      adresse,
      tel,
      email,
      nationalite,
      lieu_n,
      etablissement,
      niveau_scolaire,
      statut,
      hashedPassword,
      id
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apprenant non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'apprenant:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};

// Supprimer un apprenant
const deleteApprenant = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM apprenant WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apprenant non trouvé' });
    }

    res.json({ message: 'Apprenant supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'apprenant:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
};

export {
  getAllApprenants,
  searchApprenants,
  getApprenantById,
  createApprenant,
  updateApprenant,
  deleteApprenant
};

export default {
  getAllApprenants,
  searchApprenants,
  getApprenantById,
  createApprenant,
  updateApprenant,
  deleteApprenant
};
