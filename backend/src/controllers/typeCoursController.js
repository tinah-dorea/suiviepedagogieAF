import { pool } from '../config/db.js';

// Récupérer tous les types de cours
const getAllTypeCours = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT tc.*, ts.nom_service
            FROM type_cours tc
            LEFT JOIN type_service ts ON tc.id_type_service = ts.id
            ORDER BY tc.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un type de cours par ID
const getTypeCoursById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT tc.*, ts.nom_service
            FROM type_cours tc
            LEFT JOIN type_service ts ON tc.id_type_service = ts.id
            WHERE tc.id = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Type de cours non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau type de cours
const createTypeCours = async (req, res) => {
    const { id_type_service, nom_type_cours } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO type_cours (id_type_service, nom_type_cours) VALUES ($1, $2) RETURNING *',
            [id_type_service, nom_type_cours]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Le type de service spécifié n\'existe pas' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Mettre à jour un type de cours
const updateTypeCours = async (req, res) => {
    const { id } = req.params;
    const { id_type_service, nom_type_cours } = req.body;
    try {
        const result = await pool.query(
            'UPDATE type_cours SET id_type_service = $1, nom_type_cours = $2 WHERE id = $3 RETURNING *',
            [id_type_service, nom_type_cours, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Type de cours non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Le type de service spécifié n\'existe pas' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Supprimer un type de cours
const deleteTypeCours = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM type_cours WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Type de cours non trouvé' });
        }
        res.json({ message: 'Type de cours supprimé avec succès' });
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Ce type de cours ne peut pas être supprimé car il est utilisé par d\'autres enregistrements' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Récupérer les types de cours par type de service
const getTypeCoursByService = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM type_cours WHERE id_type_service = $1 ORDER BY id ASC',
            [serviceId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllTypeCours,
    getTypeCoursById,
    createTypeCours,
    updateTypeCours,
    deleteTypeCours,
    getTypeCoursByService
};
