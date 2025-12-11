import { pool } from '../config/db.js';

// Récupérer tous les types de service
const getAllTypeServices = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM type_service ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un type de service par ID
const getTypeServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM type_service WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Type de service non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau type de service
const createTypeService = async (req, res) => {
    const { nom_service } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO type_service (nom_service) VALUES ($1) RETURNING *',
            [nom_service]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un type de service
const updateTypeService = async (req, res) => {
    const { id } = req.params;
    const { nom_service } = req.body;
    try {
        const result = await pool.query(
            'UPDATE type_service SET nom_service = $1 WHERE id = $2 RETURNING *',
            [nom_service, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Type de service non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un type de service
const deleteTypeService = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM type_service WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Type de service non trouvé' });
        }
        res.json({ message: 'Type de service supprimé avec succès' });
    } catch (error) {
        if (error.code === '23503') { // Foreign key violation
            res.status(400).json({ message: 'Ce type de service ne peut pas être supprimé car il est utilisé par d\'autres enregistrements' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export {
    getAllTypeServices,
    getTypeServiceById,
    createTypeService,
    updateTypeService,
    deleteTypeService
};
