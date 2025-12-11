import { pool } from '../config/db.js';

// Récupérer tous les rôles
const getAllRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM role ORDER BY nom_role ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un rôle par ID
const getRoleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM role WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau rôle
const createRole = async (req, res) => {
    const { nom_role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO role (nom_role) VALUES ($1) RETURNING *',
            [nom_role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Ce nom de rôle existe déjà' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un rôle
const updateRole = async (req, res) => {
    const { id } = req.params;
    const { nom_role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE role SET nom_role = $1 WHERE id = $2 RETURNING *',
            [nom_role, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Ce nom de rôle existe déjà' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un rôle
const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM role WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.json({ message: 'Rôle supprimé avec succès' });
    } catch (error) {
        if (error.code === '23503') { // Foreign key violation
            return res.status(400).json({ message: 'Ce rôle ne peut pas être supprimé car il est utilisé par d\'autres enregistrements.' });
        }
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
