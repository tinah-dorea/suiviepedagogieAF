import { pool } from '../config/db.js';

// Récupérer tous les niveaux
const getAllNiveaux = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM niveau ORDER BY nom_niveau ASC, sous_niveau ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un niveau par ID
const getNiveauById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM niveau WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Niveau non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau niveau
const createNiveau = async (req, res) => {
    const { nom_niveau, sous_niveau } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO niveau (nom_niveau, sous_niveau) VALUES ($1, $2) RETURNING *',
            [nom_niveau, sous_niveau]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un niveau
const updateNiveau = async (req, res) => {
    const { id } = req.params;
    const { nom_niveau, sous_niveau } = req.body;
    try {
        const result = await pool.query(
            'UPDATE niveau SET nom_niveau = $1, sous_niveau = $2 WHERE id = $3 RETURNING *',
            [nom_niveau, sous_niveau, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Niveau non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un niveau
const deleteNiveau = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM niveau WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Niveau non trouvé' });
        }
        res.json({ message: 'Niveau supprimé avec succès' });
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Ce niveau ne peut pas être supprimé car il est utilisé par d\'autres enregistrements' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export {
    getAllNiveaux,
    getNiveauById,
    createNiveau,
    updateNiveau,
    deleteNiveau
};
