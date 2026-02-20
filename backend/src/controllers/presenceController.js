import { pool } from '../config/db.js';

// Obtenir toutes les présences
const getAllPresences = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*,
                   i.id_apprenant,
                   a.nom AS nom_apprenant,
                   a.prenom AS prenom_apprenant,
                   g.nom_groupe,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe
            FROM presence p
            LEFT JOIN inscription i ON p.id_inscription = i.id
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN groupe g ON p.id_groupe = g.id
            LEFT JOIN employe e ON p.id_employe_saisie = e.id
            ORDER BY p.date_saisie DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une présence par ID
const getPresenceById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT p.*,
                   i.id_apprenant,
                   a.nom AS nom_apprenant,
                   a.prenom AS prenom_apprenant,
                   g.nom_groupe,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe
            FROM presence p
            LEFT JOIN inscription i ON p.id_inscription = i.id
            LEFT JOIN apprenant a ON i.id_apprenant = a.id
            LEFT JOIN groupe g ON p.id_groupe = g.id
            LEFT JOIN employe e ON p.id_employe_saisie = e.id
            WHERE p.id = $1
        `, [id]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Présence non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle présence
const createPresence = async (req, res) => {
    const { 
        id_inscription, 
        id_groupe, 
        date_cours, 
        est_present, 
        remarque, 
        id_employe_saisie 
    } = req.body;
    
    if (!id_inscription || !id_groupe || !date_cours) {
        return res.status(400).json({ message: 'id_inscription, id_groupe et date_cours sont requis' });
    }
    
    try {
        // Vérifier si l'inscription existe
        const inscriptionCheck = await pool.query('SELECT id FROM inscription WHERE id = $1', [id_inscription]);
        if (inscriptionCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }
        
        // Vérifier si le groupe existe
        const groupeCheck = await pool.query('SELECT id FROM groupe WHERE id = $1', [id_groupe]);
        if (groupeCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }
        
        // Vérifier si l'employé existe (si fourni)
        if (id_employe_saisie) {
            const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [id_employe_saisie]);
            if (employeCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Employé non trouvé' });
            }
        }
        
        // Vérifier s'il existe déjà une présence pour cette combinaison inscription/date_cours
        const existingPresence = await pool.query(
            'SELECT id FROM presence WHERE id_inscription = $1 AND date_cours = $2',
            [id_inscription, date_cours]
        );
        if (existingPresence.rows.length > 0) {
            return res.status(409).json({ message: 'Une présence pour cette inscription et cette date existe déjà' });
        }
        
        const result = await pool.query(
            `INSERT INTO presence (
                id_inscription, 
                id_groupe, 
                date_cours, 
                est_present, 
                remarque, 
                id_employe_saisie
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                id_inscription, 
                id_groupe, 
                date_cours, 
                est_present !== undefined ? est_present : true, 
                remarque || null, 
                id_employe_saisie || null
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une présence
const updatePresence = async (req, res) => {
    const { id } = req.params;
    const { 
        id_inscription, 
        id_groupe, 
        date_cours, 
        est_present, 
        remarque, 
        id_employe_saisie 
    } = req.body;
    
    try {
        // Vérifier si l'inscription existe
        const inscriptionCheck = await pool.query('SELECT id FROM inscription WHERE id = $1', [id_inscription]);
        if (inscriptionCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }
        
        // Vérifier si le groupe existe
        const groupeCheck = await pool.query('SELECT id FROM groupe WHERE id = $1', [id_groupe]);
        if (groupeCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }
        
        // Vérifier si l'employé existe (si fourni)
        if (id_employe_saisie) {
            const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [id_employe_saisie]);
            if (employeCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Employé non trouvé' });
            }
        }
        
        const result = await pool.query(
            `UPDATE presence SET 
                id_inscription = $1, 
                id_groupe = $2, 
                date_cours = $3, 
                est_present = $4, 
                remarque = $5, 
                id_employe_saisie = $6
            WHERE id = $7 RETURNING *`,
            [
                id_inscription, 
                id_groupe, 
                date_cours, 
                est_present !== undefined ? est_present : true, 
                remarque || null, 
                id_employe_saisie || null, 
                id
            ]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Présence non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une présence
const deletePresence = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM presence WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Présence non trouvée' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    getAllPresences, 
    getPresenceById, 
    createPresence, 
    updatePresence, 
    deletePresence
};