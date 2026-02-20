import { pool } from '../config/db.js';

// Obtenir tous les groupes
const getAllGroupes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT g.*,
                   hc.id AS id_horaire_cours,
                   s.nom_session,
                   e.nom AS nom_prof,
                   e.prenom AS prenom_prof
            FROM groupe g
            LEFT JOIN horaire_cours hc ON g.id_horaire_cours = hc.id
            LEFT JOIN session s ON hc.id_session = s.id
            LEFT JOIN professeur p ON g.id_professeur = p.id
            LEFT JOIN employe e ON p.id_employe = e.id
            ORDER BY g.nom_groupe ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un groupe par ID
const getGroupeById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT g.*,
                   hc.id AS id_horaire_cours,
                   s.nom_session,
                   e.nom AS nom_prof,
                   e.prenom AS prenom_prof
            FROM groupe g
            LEFT JOIN horaire_cours hc ON g.id_horaire_cours = hc.id
            LEFT JOIN session s ON hc.id_session = s.id
            LEFT JOIN professeur p ON g.id_professeur = p.id
            LEFT JOIN employe e ON p.id_employe = e.id
            WHERE g.id = $1
        `, [id]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Groupe non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau groupe
const createGroupe = async (req, res) => {
    const { nom_groupe, id_horaire_cours, id_professeur } = req.body;
    
    if (!nom_groupe || !id_horaire_cours || !id_professeur) {
        return res.status(400).json({ message: 'nom_groupe, id_horaire_cours et id_professeur sont requis' });
    }
    
    try {
        // Vérifier si l'horaire_cours existe
        const horaireCheck = await pool.query('SELECT id FROM horaire_cours WHERE id = $1', [id_horaire_cours]);
        if (horaireCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Horaire de cours non trouvé' });
        }
        
        // Vérifier si le professeur existe
        const profCheck = await pool.query('SELECT id FROM professeur WHERE id = $1', [id_professeur]);
        if (profCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Professeur non trouvé' });
        }
        
        // Vérifier si un groupe avec ce nom et cet horaire existe déjà
        const existingGroupe = await pool.query(
            'SELECT id FROM groupe WHERE nom_groupe = $1 AND id_horaire_cours = $2',
            [nom_groupe, id_horaire_cours]
        );
        if (existingGroupe.rows.length > 0) {
            return res.status(409).json({ message: 'Un groupe avec ce nom existe déjà pour cet horaire' });
        }
        
        const result = await pool.query(
            `INSERT INTO groupe (nom_groupe, id_horaire_cours, id_professeur) 
             VALUES ($1, $2, $3) RETURNING *`,
            [nom_groupe, id_horaire_cours, id_professeur]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un groupe
const updateGroupe = async (req, res) => {
    const { id } = req.params;
    const { nom_groupe, id_horaire_cours, id_professeur } = req.body;
    
    try {
        // Vérifier si l'horaire_cours existe
        const horaireCheck = await pool.query('SELECT id FROM horaire_cours WHERE id = $1', [id_horaire_cours]);
        if (horaireCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Horaire de cours non trouvé' });
        }
        
        // Vérifier si le professeur existe
        const profCheck = await pool.query('SELECT id FROM professeur WHERE id = $1', [id_professeur]);
        if (profCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Professeur non trouvé' });
        }
        
        // Vérifier si un autre groupe avec ce nom et cet horaire existe déjà
        const existingGroupe = await pool.query(
            'SELECT id FROM groupe WHERE nom_groupe = $1 AND id_horaire_cours = $2 AND id != $3',
            [nom_groupe, id_horaire_cours, id]
        );
        if (existingGroupe.rows.length > 0) {
            return res.status(409).json({ message: 'Un groupe avec ce nom existe déjà pour cet horaire' });
        }
        
        const result = await pool.query(
            `UPDATE groupe SET 
                nom_groupe=$1, 
                id_horaire_cours=$2, 
                id_professeur=$3 
             WHERE id=$4 RETURNING *`,
            [nom_groupe, id_horaire_cours, id_professeur, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Groupe non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un groupe
const deleteGroupe = async (req, res) => {
    const { id } = req.params;
    try {
        // Vérifier s'il y a des inscriptions associées à ce groupe
        const inscriptionsCheck = await pool.query('SELECT id FROM inscription WHERE id_groupe = $1', [id]);
        if (inscriptionsCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Impossible de supprimer le groupe car des inscriptions y sont associées' });
        }
        
        const result = await pool.query('DELETE FROM groupe WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Groupe non trouvé' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    getAllGroupes, 
    getGroupeById, 
    createGroupe, 
    updateGroupe, 
    deleteGroupe
};