import { pool } from '../config/db.js';

const getAllAffectations = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*,
                s.nom_salle,
                g.nom_groupe
            FROM attribution_salle a
            LEFT JOIN salle s ON a.id_salle = s.id
            LEFT JOIN groupe g ON a.id_groupe = g.id
            ORDER BY a.date_cours DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAffectationById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM attribution_salle WHERE id=$1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Attribution non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAffectation = async (req, res) => {
    const { id_groupe, date_cours, id_salle } = req.body;
    if (!id_groupe || !date_cours || !id_salle) return res.status(400).json({ message: 'id_groupe, date_cours et id_salle sont requis' });
    try {
        const result = await pool.query('INSERT INTO attribution_salle (id_groupe, date_cours, id_salle) VALUES ($1,$2,$3) RETURNING *', [id_groupe, date_cours, id_salle]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Attribution déjà existante pour ce groupe et cette salle' });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateAffectation = async (req, res) => {
    const { id } = req.params;
    const { id_groupe, date_cours, id_salle } = req.body;
    try {
        const result = await pool.query('UPDATE attribution_salle SET id_groupe=$1, date_cours=$2, id_salle=$3 WHERE id=$4 RETURNING *', [id_groupe, date_cours, id_salle, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Attribution non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAffectation = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM attribution_salle WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Attribution non trouvée' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllAffectations, getAffectationById, createAffectation, updateAffectation, deleteAffectation };
