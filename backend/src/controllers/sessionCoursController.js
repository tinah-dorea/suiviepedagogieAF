import { pool } from '../config/db.js';

// CRUD pour session_cours
const getAllSessionCours = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT sc.*,
                tc.nom_type_cours,
                s.mois,
                s.annee,
                n.nom_niveau,
                c.nom_categorie
            FROM session_cours sc
            LEFT JOIN type_cours tc ON sc.id_type_cours = tc.id
            LEFT JOIN session s ON sc.id_session = s.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            LEFT JOIN categorie c ON sc.id_categorie = c.id
            ORDER BY sc.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSessionCoursById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM session_cours WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'session_cours non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSessionCours = async (req, res) => {
    const { id_session, id_type_cours, id_niveau, id_categorie } = req.body;
    if (!id_session || !id_type_cours) {
        return res.status(400).json({ message: 'id_session et id_type_cours requis' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO session_cours (id_session, id_type_cours, id_niveau, id_categorie) VALUES ($1,$2,$3,$4) RETURNING *`,
            [id_session, id_type_cours, id_niveau || null, id_categorie || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSessionCours = async (req, res) => {
    const { id } = req.params;
    const { id_session, id_type_cours, id_niveau, id_categorie } = req.body;
    try {
        const result = await pool.query(
            `UPDATE session_cours SET id_session=$1, id_type_cours=$2, id_niveau=$3, id_categorie=$4 WHERE id=$5 RETURNING *`,
            [id_session, id_type_cours, id_niveau || null, id_categorie || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'session_cours non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSessionCours = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM session_cours WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'session_cours non trouvé' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllSessionCours,
    getSessionCoursById,
    createSessionCours,
    updateSessionCours,
    deleteSessionCours
};
