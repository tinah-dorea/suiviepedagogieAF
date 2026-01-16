import { pool } from '../config/db.js';

const getAllMotivations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM motivation ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMotivationById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM motivation WHERE id=$1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Motivation non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMotivation = async (req, res) => {
    const { nom_motivation } = req.body;
    if (!nom_motivation) return res.status(400).json({ message: 'nom_motivation requis' });
    try {
        const result = await pool.query('INSERT INTO motivation (nom_motivation) VALUES ($1) RETURNING *', [nom_motivation]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMotivation = async (req, res) => {
    const { id } = req.params;
    const { nom_motivation } = req.body;
    try {
        const result = await pool.query('UPDATE motivation SET nom_motivation=$1 WHERE id=$2 RETURNING *', [nom_motivation, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Motivation non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMotivation = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM motivation WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Motivation non trouvée' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllMotivations, getMotivationById, createMotivation, updateMotivation, deleteMotivation };
