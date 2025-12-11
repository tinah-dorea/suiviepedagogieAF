import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

const PROFESSOR_ROLE_NAME = 'Professeur';
const PROFESSOR_SERVICE_LABEL = 'Professeurs';

// Fonction utilitaire pour convertir en nombre
const toInt = (value) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? null : parsed;
};

const enforceServiceByRole = (service, roleName) => {
  if ((roleName || '').toLowerCase() === PROFESSOR_ROLE_NAME.toLowerCase()) {
    return PROFESSOR_SERVICE_LABEL;
  }
  return service;
};

// GET: Liste des rôles
export const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nom_role FROM role ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur dans getRoles:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des rôles" });
  }
};

// GET: Liste des employés
export const getEmployes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id, 
        e.service, 
        e.nom, 
        e.prenom, 
        e.age,
        e.adresse,
        e.tel,
        e.email,
        e.is_active,
        e.date_creation,
        r.id AS id_role, 
        r.nom_role
      FROM employe e
      LEFT JOIN role r ON e.id_role = r.id
      ORDER BY e.date_creation DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur dans getEmployes:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des employés" });
  }
};

// POST: Créer un nouvel employé
export const createEmploye = async (req, res) => {
  const { service, nom, prenom, age, adresse, tel, email, mot_passe, id_role } = req.body;

  if (!nom || !prenom || !email || !mot_passe || !id_role) {
    return res.status(400).json({ 
      message: "Tous les champs obligatoires doivent être remplis",
      details: "nom, prenom, email, mot_passe et id_role sont requis"
    });
  }

  try {
    // Vérifier si le rôle existe
    const roleCheck = await pool.query('SELECT id, nom_role FROM role WHERE id = $1', [id_role]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ message: "Le rôle spécifié n'existe pas" });
    }
    const roleName = roleCheck.rows[0].nom_role;

    // Vérifier si l'email existe déjà
    const emailCheck = await pool.query('SELECT id FROM employe WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(mot_passe, 10);
    const finalService = enforceServiceByRole(service, roleName);

    const result = await pool.query(`
      INSERT INTO employe (
        service, nom, prenom, age, adresse, tel, email, mot_passe, 
        id_role, is_active, date_creation
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, CURRENT_TIMESTAMP)
      RETURNING id, service, nom, prenom, age, adresse, tel, email, 
               id_role, is_active, date_creation
    `, [finalService, nom, prenom, age, adresse, tel, email, hashedPassword, id_role]);

    // Récupérer le nom du rôle pour la réponse
    const employeWithRole = {
      ...result.rows[0],
      nom_role: roleName
    };

    res.status(201).json(employeWithRole);
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
    res.status(500).json({ 
      message: "Erreur lors de la création de l'employé",
      details: error.message 
    });
  }
};

// PUT: Mettre à jour un employé
export const updateEmploye = async (req, res) => {
  const { id } = req.params;
  const { service, nom, prenom, age, adresse, tel, email, mot_passe, id_role } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ message: "Les champs nom, prénom et email sont requis" });
  }

  try {
    const roleCheck = await pool.query('SELECT id, nom_role FROM role WHERE id = $1', [id_role]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ message: "Le rôle spécifié n'existe pas" });
    }
    const roleName = roleCheck.rows[0].nom_role;
    const finalService = enforceServiceByRole(service, roleName);

    // Construire la requête de mise à jour de façon explicite pour éviter les variables undefined
    let query = `
      UPDATE employe
      SET service = $1, nom = $2, prenom = $3, age = $4, adresse = $5, tel = $6, email = $7, id_role = $8
    `;
    const values = [finalService, nom, prenom, age, adresse, tel, email, id_role];

    if (mot_passe) {
      const hashedPassword = await bcrypt.hash(mot_passe, 10);
      query += `, mot_passe = $9`;
      values.push(hashedPassword);
    }

    // id en dernière position
    query += ` WHERE id = $${values.length + 1} RETURNING id, service, nom, prenom, age, adresse, tel, email, id_role, is_active`;
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
    // Valider l'ID de l'employé
    const employeId = parseInt(id);
    if (isNaN(employeId)) {
      return res.status(400).json({ message: "ID employé invalide" });
    }

    // S'assurer que l'employé existe
    const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [employeId]);
    if (employeCheck.rows.length === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    // Construction de la requête
    const values = [Boolean(is_active)];
    let deactivatedBy = null;

    // Si on désactive l'employé, on ajoute l'ID de l'utilisateur qui fait l'action
    if (!is_active && req.user?.id) {
      deactivatedBy = Number(req.user.id); // Conversion explicite en nombre
    }

    const query = `
      UPDATE employe
      SET is_active = $1,
          deactivated_at = CASE 
            WHEN $1 = true THEN NULL 
            ELSE CURRENT_TIMESTAMP 
          END,
          deactivated_by = CASE 
            WHEN $1 = true THEN NULL 
            ELSE $2::integer
          END
      WHERE id = $3
      RETURNING id, service, nom, prenom, age, adresse, tel, email, id_role, is_active`;

    const result = await pool.query(query, [values[0], deactivatedBy, employeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la modification du statut :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE: Supprimer un employé (soft delete avec is_active)
export const deleteEmploye = async (req, res) => {
  const { id } = req.params;
  console.log('Tentative de suppression de l\'employé avec l\'ID:', id);
  console.log('Utilisateur connecté:', req.user);

  try {
    // Valider et convertir l'ID de l'employé en nombre
    const employeId = parseInt(id);
    console.log('ID employé converti:', employeId);
    
    if (isNaN(employeId)) {
      console.log('ID employé invalide');
      return res.status(400).json({ message: "ID employé invalide" });
    }

    // S'assurer que l'employé existe et récupérer son statut actuel
    console.log('Vérification de l\'existence de l\'employé...');
    const employeCheck = await pool.query(`
      SELECT e.id, e.is_active, e.deactivated_at, e.deactivated_by, 
             u.nom as deactivated_by_name 
      FROM employe e 
      LEFT JOIN employe u ON e.deactivated_by = u.id 
      WHERE e.id = $1
    `, [employeId]);
    
    if (employeCheck.rows.length === 0) {
      console.log('Employé non trouvé');
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    // Vérifier si l'employé est déjà désactivé
    if (!employeCheck.rows[0].is_active) {
      console.log('L\'employé est déjà désactivé');
      const deactivationInfo = {
        message: "L'employé est déjà désactivé",
        deactivatedAt: employeCheck.rows[0].deactivated_at,
        deactivatedBy: employeCheck.rows[0].deactivated_by_name
      };
      return res.status(400).json(deactivationInfo);
    }

    // Valider et convertir l'ID de l'utilisateur connecté
    let deactivatedBy = null;
    if (req.user && req.user.id) {
      deactivatedBy = parseInt(req.user.id);
      if (isNaN(deactivatedBy)) {
        console.log('ID utilisateur invalide');
        return res.status(400).json({ message: "ID utilisateur invalide" });
      }
    } else {
      console.log('Utilisateur non connecté');
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    console.log('Exécution de la requête de suppression avec deactivatedBy:', deactivatedBy);
    const result = await pool.query(`
      UPDATE employe
      SET is_active = FALSE, 
          deactivated_at = CURRENT_TIMESTAMP, 
          deactivated_by = $1
      WHERE id = $2 AND is_active = TRUE
      RETURNING id, service, nom, prenom, age, adresse, tel, email, id_role, is_active
    `, [deactivatedBy, employeId]);

    if (result.rows.length === 0) {
      console.log('Aucune ligne mise à jour');
      return res.status(400).json({ message: "La désactivation a échoué" });
    }

    console.log('Employé désactivé avec succès:', result.rows[0]);
    res.status(200).json({ message: "Employé désactivé avec succès", employe: result.rows[0] });
  } catch (error) {
    console.error("Erreur détaillée lors de la suppression de l'employé :", error);
    console.error("Message d'erreur :", error.message);
    console.error("Code d'erreur :", error.code);
    res.status(500).json({ 
      message: "Erreur lors de la désactivation de l'employé",
      details: error.message
    });
  }
};

// GET: Liste des professeurs
export const getProfesseurs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id, 
        e.service, 
        e.nom, 
        e.prenom, 
        e.age,
        e.adresse,
        e.tel,
        e.email,
        e.is_active,
        e.date_creation,
        r.id AS id_role, 
        r.nom_role
      FROM employe e
      INNER JOIN role r ON e.id_role = r.id
      WHERE LOWER(r.nom_role) = LOWER($1)
        AND LOWER(COALESCE(e.service, '')) = LOWER($2)
      ORDER BY e.nom ASC, e.prenom ASC
    `, [PROFESSOR_ROLE_NAME, PROFESSOR_SERVICE_LABEL]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur dans getProfesseurs:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des professeurs" });
  }
};