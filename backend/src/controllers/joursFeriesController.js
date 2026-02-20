import { pool } from '../config/db.js';

// Obtenir tous les jours fériés
const getAllJoursFeries = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jours_feries ORDER BY date_ferie ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un jour férié par ID
const getJourFerieById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM jours_feries WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Jour férié non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau jour férié
const createJourFerie = async (req, res) => {
    const { date_ferie, libelle, annee } = req.body;
    
    if (!date_ferie || !libelle || !annee) {
        return res.status(400).json({ message: 'date_ferie, libelle et annee sont requis' });
    }
    
    try {
        // Vérifier si ce jour férié existe déjà
        const existingJourFerie = await pool.query(
            'SELECT id FROM jours_feries WHERE date_ferie = $1',
            [date_ferie]
        );
        if (existingJourFerie.rows.length > 0) {
            return res.status(409).json({ message: 'Ce jour férié existe déjà' });
        }
        
        const result = await pool.query(
            `INSERT INTO jours_feries (date_ferie, libelle, annee) 
             VALUES ($1, $2, $3) RETURNING *`,
            [date_ferie, libelle, annee]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un jour férié
const updateJourFerie = async (req, res) => {
    const { id } = req.params;
    const { date_ferie, libelle, annee } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE jours_feries SET 
                date_ferie = $1, 
                libelle = $2, 
                annee = $3 
             WHERE id = $4 RETURNING *`,
            [date_ferie, libelle, annee, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Jour férié non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un jour férié
const deleteJourFerie = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM jours_feries WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Jour férié non trouvé' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les jours fériés pour une année spécifique
const getJoursFeriesByAnnee = async (req, res) => {
    const { annee } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM jours_feries WHERE annee = $1 ORDER BY date_ferie ASC',
            [annee]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    getAllJoursFeries, 
    getJourFerieById, 
    createJourFerie, 
    updateJourFerie, 
    deleteJourFerie,
    getJoursFeriesByAnnee
};