import { pool } from '../config/db.js';

// Obtenir toutes les inscriptions
const getAllInscriptions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT i.*,
                   a.nom AS nom_apprenant,
                   a.prenom AS prenom_apprenant,
                   a.tel AS tel_apprenant,
                   a.email AS email_apprenant,
                   s.nom_session,
                   n.code AS code_niveau,
                   c.nom_categorie,
                   cr.jour_semaine,
                   cr.heure_debut,
                   cr.heure_fin,
                   g.nom_groupe,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe
            FROM inscription i
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN categorie c ON i.id_categorie = c.id
            LEFT JOIN creneau cr ON i.id_creneau = cr.id
            LEFT JOIN groupe g ON i.id_groupe = g.id
            LEFT JOIN employe e ON i.id_employe = e.id
            ORDER BY i.date_inscription DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une inscription par ID
const getInscriptionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                   a.nom AS nom_apprenant,
                   a.prenom AS prenom_apprenant,
                   a.tel AS tel_apprenant,
                   a.email AS email_apprenant,
                   s.nom_session,
                   n.code AS code_niveau,
                   c.nom_categorie,
                   cr.jour_semaine,
                   cr.heure_debut,
                   cr.heure_fin,
                   g.nom_groupe,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe
            FROM inscription i
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN categorie c ON i.id_categorie = c.id
            LEFT JOIN creneau cr ON i.id_creneau = cr.id
            LEFT JOIN groupe g ON i.id_groupe = g.id
            LEFT JOIN employe e ON i.id_employe = e.id
            WHERE i.id = $1
        `, [id]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Inscription non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle inscription
const createInscription = async (req, res) => {
    const { 
        id_apprenant, 
        id_employe, 
        id_session, 
        id_motivation, 
        num_carte, 
        ticket, 
        etat_inscription, 
        id_niveau, 
        id_categorie, 
        id_creneau, 
        id_groupe,
        validation_examen
    } = req.body;
    
    if (!id_apprenant || !id_session) {
        return res.status(400).json({ message: 'id_apprenant et id_session sont requis' });
    }
    
    try {
        // Vérifier si l'apprenant existe
        const apprenantCheck = await pool.query('SELECT id FROM apprenant WHERE id = $1', [id_apprenant]);
        if (apprenantCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Apprenant non trouvé' });
        }
        
        // Vérifier si la session existe
        const sessionCheck = await pool.query('SELECT id FROM session WHERE id = $1', [id_session]);
        if (sessionCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }
        
        // Vérifier si l'employé existe (si fourni)
        if (id_employe) {
            const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [id_employe]);
            if (employeCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Employé non trouvé' });
            }
        }
        
        // Vérifier si la motivation existe (si fournie)
        if (id_motivation) {
            const motivationCheck = await pool.query('SELECT id FROM motivation WHERE id = $1', [id_motivation]);
            if (motivationCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Motivation non trouvée' });
            }
        }
        
        // Vérifier si le niveau existe (si fourni)
        if (id_niveau) {
            const niveauCheck = await pool.query('SELECT id FROM niveau WHERE id = $1', [id_niveau]);
            if (niveauCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Niveau non trouvé' });
            }
        }
        
        // Vérifier si la catégorie existe (si fournie)
        if (id_categorie) {
            const categorieCheck = await pool.query('SELECT id FROM categorie WHERE id = $1', [id_categorie]);
            if (categorieCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
        }
        
        // Vérifier si le créneau existe (si fourni)
        if (id_creneau) {
            const creneauCheck = await pool.query('SELECT id FROM creneau WHERE id = $1', [id_creneau]);
            if (creneauCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Créneau non trouvé' });
            }
        }
        
        // Vérifier si le groupe existe (si fourni)
        if (id_groupe) {
            const groupeCheck = await pool.query('SELECT id FROM groupe WHERE id = $1', [id_groupe]);
            if (groupeCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Groupe non trouvé' });
            }
        }
        
        const result = await pool.query(
            `INSERT INTO inscription (
                id_apprenant, 
                id_employe, 
                id_session, 
                id_motivation, 
                num_carte, 
                ticket, 
                etat_inscription, 
                id_niveau, 
                id_categorie, 
                id_creneau, 
                id_groupe,
                validation_examen
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [
                id_apprenant, 
                id_employe || null, 
                id_session, 
                id_motivation || null, 
                num_carte || null, 
                ticket || null, 
                etat_inscription || 'inscription', 
                id_niveau || null, 
                id_categorie || null, 
                id_creneau || null, 
                id_groupe || null,
                validation_examen || null
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une inscription
const updateInscription = async (req, res) => {
    const { id } = req.params;
    const {
        id_apprenant,
        id_employe,
        id_session,
        id_motivation,
        num_carte,
        ticket,
        etat_inscription,
        id_niveau,
        id_categorie,
        id_creneau,
        id_groupe,
        validation_examen
    } = req.body;

    try {
        // Vérifier si l'inscription existe
        const inscriptionCheck = await pool.query('SELECT id FROM inscription WHERE id = $1', [id]);
        if (inscriptionCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }

        // Vérifier si l'apprenant existe (si fourni)
        if (id_apprenant) {
            const apprenantCheck = await pool.query('SELECT id FROM apprenant WHERE id = $1', [id_apprenant]);
            if (apprenantCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Apprenant non trouvé' });
            }
        }

        // Vérifier si la session existe (si fournie)
        if (id_session) {
            const sessionCheck = await pool.query('SELECT id FROM session WHERE id = $1', [id_session]);
            if (sessionCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Session non trouvée' });
            }
        }
        
        // Vérifier si l'employé existe (si fourni)
        if (id_employe) {
            const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [id_employe]);
            if (employeCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Employé non trouvé' });
            }
        }
        
        // Vérifier si la motivation existe (si fournie)
        if (id_motivation) {
            const motivationCheck = await pool.query('SELECT id FROM motivation WHERE id = $1', [id_motivation]);
            if (motivationCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Motivation non trouvée' });
            }
        }
        
        // Vérifier si le niveau existe (si fourni)
        if (id_niveau) {
            const niveauCheck = await pool.query('SELECT id FROM niveau WHERE id = $1', [id_niveau]);
            if (niveauCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Niveau non trouvé' });
            }
        }
        
        // Vérifier si la catégorie existe (si fournie)
        if (id_categorie) {
            const categorieCheck = await pool.query('SELECT id FROM categorie WHERE id = $1', [id_categorie]);
            if (categorieCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
        }
        
        // Vérifier si le créneau existe (si fourni)
        if (id_creneau) {
            const creneauCheck = await pool.query('SELECT id FROM creneau WHERE id = $1', [id_creneau]);
            if (creneauCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Créneau non trouvé' });
            }
        }
        
        // Vérifier si le groupe existe (si fourni)
        if (id_groupe) {
            const groupeCheck = await pool.query('SELECT id FROM groupe WHERE id = $1', [id_groupe]);
            if (groupeCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Groupe non trouvé' });
            }
        }
        
        // Build dynamic UPDATE query with only provided fields
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        if (id_apprenant !== undefined) {
            updateFields.push(`id_apprenant=$${paramIndex++}`);
            updateValues.push(id_apprenant);
        }
        if (id_employe !== undefined) {
            updateFields.push(`id_employe=$${paramIndex++}`);
            updateValues.push(id_employe || null);
        }
        if (id_session !== undefined) {
            updateFields.push(`id_session=$${paramIndex++}`);
            updateValues.push(id_session);
        }
        if (id_motivation !== undefined) {
            updateFields.push(`id_motivation=$${paramIndex++}`);
            updateValues.push(id_motivation || null);
        }
        if (num_carte !== undefined) {
            updateFields.push(`num_carte=$${paramIndex++}`);
            updateValues.push(num_carte || null);
        }
        if (ticket !== undefined) {
            updateFields.push(`ticket=$${paramIndex++}`);
            updateValues.push(ticket || null);
        }
        if (etat_inscription !== undefined) {
            updateFields.push(`etat_inscription=$${paramIndex++}`);
            updateValues.push(etat_inscription);
        }
        if (id_niveau !== undefined) {
            updateFields.push(`id_niveau=$${paramIndex++}`);
            updateValues.push(id_niveau || null);
        }
        if (id_categorie !== undefined) {
            updateFields.push(`id_categorie=$${paramIndex++}`);
            updateValues.push(id_categorie || null);
        }
        if (id_creneau !== undefined) {
            updateFields.push(`id_creneau=$${paramIndex++}`);
            updateValues.push(id_creneau || null);
        }
        if (id_groupe !== undefined) {
            updateFields.push(`id_groupe=$${paramIndex++}`);
            updateValues.push(id_groupe || null);
        }
        if (validation_examen !== undefined) {
            updateFields.push(`validation_examen=$${paramIndex++}`);
            updateValues.push(validation_examen || null);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'Aucun champ à mettre à jour' });
        }

        updateValues.push(id);

        const result = await pool.query(
            `UPDATE inscription SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`,
            updateValues
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Inscription non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'inscription:', error);
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une inscription
const deleteInscription = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM inscription WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Inscription non trouvée' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les inscriptions par email
const getInscriptionsByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                   a.nom AS nom_apprenant,
                   a.prenom AS prenom_apprenant,
                   a.tel AS tel_apprenant,
                   a.email AS email_apprenant,
                   s.nom_session,
                   n.code AS code_niveau,
                   c.nom_categorie,
                   cr.jour_semaine,
                   cr.heure_debut,
                   cr.heure_fin,
                   g.nom_groupe,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe
            FROM inscription i
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN categorie c ON i.id_categorie = c.id
            LEFT JOIN creneau cr ON i.id_creneau = cr.id
            LEFT JOIN groupe g ON i.id_groupe = g.id
            LEFT JOIN employe e ON i.id_employe = e.id
            WHERE a.email = $1
            ORDER BY i.date_inscription DESC
        `, [email]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Aucune inscription trouvée pour cet email' });
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les inscriptions par session
const getInscriptionsBySession = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                   a.nom AS nom_apprenant,
                   a.prenom AS prenom_apprenant,
                   a.tel AS tel_apprenant,
                   a.email AS email_apprenant,
                   s.nom_session,
                   n.code AS code_niveau,
                   c.nom_categorie,
                   cr.jour_semaine,
                   cr.heure_debut,
                   cr.heure_fin,
                   g.nom_groupe,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe
            FROM inscription i
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN categorie c ON i.id_categorie = c.id
            LEFT JOIN creneau cr ON i.id_creneau = cr.id
            LEFT JOIN groupe g ON i.id_groupe = g.id
            LEFT JOIN employe e ON i.id_employe = e.id
            WHERE i.id_session = $1
            ORDER BY i.date_inscription DESC
        `, [sessionId]);
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les inscriptions par type de cours
const getInscriptionsByTypeCours = async (req, res) => {
    const { typeCoursId } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                   a.nom AS nom_apprenant,
                   a.prenom AS prenom_apprenant,
                   a.tel AS tel_apprenant,
                   a.email AS email_apprenant,
                   s.nom_session,
                   tc.nom_type_cours,
                   n.code AS code_niveau,
                   c.nom_categorie,
                   cr.jour_semaine,
                   cr.heure_debut,
                   cr.heure_fin,
                   g.nom_groupe,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe
            FROM inscription i
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN type_cours tc ON s.id_type_cours = tc.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN categorie c ON i.id_categorie = c.id
            LEFT JOIN creneau cr ON i.id_creneau = cr.id
            LEFT JOIN groupe g ON i.id_groupe = g.id
            LEFT JOIN employe e ON i.id_employe = e.id
            WHERE s.id_type_cours = $1
            ORDER BY i.date_inscription DESC
        `, [typeCoursId]);
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les inscriptions (apprenants) par groupe
const getInscriptionsByGroupe = async (req, res) => {
    const { groupeId } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                   a.nom,
                   a.prenom,
                   a.email,
                   a.tel,
                   a.sexe as genre,
                   s.nom_session,
                   n.nom_niveau,
                   c.nom_categorie,
                   cr.jour_semaine,
                   cr.heure_debut,
                   cr.heure_fin,
                   g.nom_groupe,
                   pr.nom AS nom_professeur,
                   pr.prenom AS prenom_professeur
            FROM inscription i
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN categorie c ON i.id_categorie = c.id
            LEFT JOIN creneau cr ON i.id_creneau = cr.id
            LEFT JOIN groupe g ON i.id_groupe = g.id
            LEFT JOIN employe pr ON g.id_professeur = pr.id
            WHERE i.id_groupe = $1
            ORDER BY a.nom, a.prenom
        `, [groupeId]);
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    getAllInscriptions, 
    getInscriptionById, 
    createInscription, 
    updateInscription, 
    deleteInscription,
    getInscriptionsByEmail,
    getInscriptionsBySession,
    getInscriptionsByTypeCours,
    getInscriptionsByGroupe
};