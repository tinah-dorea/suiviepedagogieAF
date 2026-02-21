import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

const ROLES_DISPONIBLES = ['Admin', 'Pédagogie', 'Professeurs', 'Accueil'];

// GET: Liste des rôles (liste fixe, table role supprimée)
export const getRoles = async (req, res) => {
  try {
    res.status(200).json(ROLES_DISPONIBLES.map((nom, i) => ({ id: i + 1, nom_role: nom })));
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des rôles" });
  }
};

// GET: Liste des employés
export const getEmployes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nom, prenom, age, adresse, tel, email, is_active, date_creation, role, deactivated_at, deactivated_by
      FROM employe
      ORDER BY date_creation DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur dans getEmployes:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des employés" });
  }
};

// POST: Créer un nouvel employé
export const createEmploye = async (req, res) => {
  const { nom, prenom, age, adresse, tel, email, mot_passe, role } = req.body;

  if (!nom || !prenom || !email || !mot_passe || !role) {
    return res.status(400).json({ 
      message: "Tous les champs obligatoires doivent être remplis",
      details: "nom, prenom, email, mot_passe et role sont requis"
    });
  }

  try {
    const emailCheck = await pool.query('SELECT id FROM employe WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(mot_passe, 10);

    const result = await pool.query(`
      INSERT INTO employe (nom, prenom, age, adresse, tel, email, mot_passe, role, is_active, date_creation)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, CURRENT_TIMESTAMP)
      RETURNING id, nom, prenom, age, adresse, tel, email, role, is_active, date_creation, deactivated_at, deactivated_by
    `, [nom, prenom, age || null, adresse || null, tel || null, email, hashedPassword, role]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
    res.status(500).json({ message: "Erreur lors de la création de l'employé", details: error.message });
  }
};

// PUT: Mettre à jour un employé
export const updateEmploye = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, age, adresse, tel, email, mot_passe, role } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ message: "Les champs nom, prénom et email sont requis" });
  }

  try {
    let query = `
      UPDATE employe
      SET nom = $1, prenom = $2, age = $3, adresse = $4, tel = $5, email = $6, role = $7
    `;
    const values = [nom, prenom, age || null, adresse || null, tel || null, email, role || null];

    if (mot_passe) {
      const hashedPassword = await bcrypt.hash(mot_passe, 10);
      query += `, mot_passe = $8`;
      values.push(hashedPassword);
    }

    query += ` WHERE id = $${values.length + 1} RETURNING id, nom, prenom, age, adresse, tel, email, role, is_active, date_creation, deactivated_at, deactivated_by`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PATCH: Activer/Désactiver un employé
export const toggleEmployeStatus = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const employeId = parseInt(id);
    if (isNaN(employeId)) {
      return res.status(400).json({ message: "ID employé invalide" });
    }

    const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [employeId]);
    if (employeCheck.rows.length === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    let deactivatedBy = null;
    if (!is_active && req.user?.id) {
      deactivatedBy = Number(req.user.id);
    }

    const result = await pool.query(`
      UPDATE employe
      SET is_active = $1,
          deactivated_at = CASE WHEN $1 = true THEN NULL ELSE CURRENT_TIMESTAMP END,
          deactivated_by = CASE WHEN $1 = true THEN NULL ELSE $2::integer END
      WHERE id = $3
      RETURNING id, nom, prenom, age, adresse, tel, email, role, is_active, date_creation, deactivated_at, deactivated_by
    `, [Boolean(is_active), deactivatedBy, employeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la modification du statut :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE: Désactiver un employé (soft delete)
export const deleteEmploye = async (req, res) => {
  const { id } = req.params;

  try {
    const employeId = parseInt(id);
    if (isNaN(employeId)) {
      return res.status(400).json({ message: "ID employé invalide" });
    }

    const employeCheck = await pool.query(`
      SELECT e.id, e.is_active, e.deactivated_at, e.deactivated_by, u.nom as deactivated_by_name 
      FROM employe e 
      LEFT JOIN employe u ON e.deactivated_by = u.id 
      WHERE e.id = $1
    `, [employeId]);
    
    if (employeCheck.rows.length === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    if (!employeCheck.rows[0].is_active) {
      return res.status(400).json({
        message: "L'employé est déjà désactivé",
        deactivatedAt: employeCheck.rows[0].deactivated_at,
        deactivatedBy: employeCheck.rows[0].deactivated_by_name
      });
    }

    let deactivatedBy = null;
    if (req.user?.id) {
      deactivatedBy = parseInt(req.user.id);
      if (isNaN(deactivatedBy)) {
        return res.status(400).json({ message: "ID utilisateur invalide" });
      }
    } else {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const result = await pool.query(`
      UPDATE employe
      SET is_active = FALSE, deactivated_at = CURRENT_TIMESTAMP, deactivated_by = $1
      WHERE id = $2 AND is_active = TRUE
      RETURNING id, nom, prenom, age, adresse, tel, email, role, is_active, date_creation, deactivated_at, deactivated_by
    `, [deactivatedBy, employeId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "La désactivation a échoué" });
    }

    res.status(200).json({ message: "Employé désactivé avec succès", employe: result.rows[0] });
  } catch (error) {
    console.error("Erreur lors de la désactivation:", error);
    res.status(500).json({ message: "Erreur lors de la désactivation", details: error.message });
  }
};

// GET: Liste des professeurs (employes avec role contenant 'professeur')
export const getProfesseurs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id, e.nom, e.prenom, e.age, e.adresse, e.tel, e.email, e.is_active, e.date_creation, e.role
      FROM employe e
      WHERE LOWER(COALESCE(e.role, '')) LIKE '%professeur%'
      ORDER BY e.nom ASC, e.prenom ASC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur dans getProfesseurs:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des professeurs" });
  }
};
