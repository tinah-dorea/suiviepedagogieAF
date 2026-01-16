import { pool } from '../config/db.js';

const getAllGroupes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT g.*,
                c.jour_semaine,
                c.heure_debut,
                c.heure_fin,
                e.nom as prof_nom,
                e.prenom as prof_prenom
            FROM groupe g
            LEFT JOIN creneau c ON g.id_creneau = c.id
            LEFT JOIN employe e ON g.id_employe_prof = e.id
            ORDER BY g.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupeById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM groupe WHERE id=$1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Groupe non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGroupe = async (req, res) => {
    const { id_creneau, numero_groupe, id_employe_prof } = req.body;
    if (!id_creneau || !numero_groupe) return res.status(400).json({ message: 'id_creneau et numero_groupe requis' });
    try {
        const result = await pool.query(`INSERT INTO groupe (id_creneau, numero_groupe, id_employe_prof) VALUES ($1,$2,$3) RETURNING *`, [id_creneau, numero_groupe, id_employe_prof || null]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGroupe = async (req, res) => {
    const { id } = req.params;
    const { id_creneau, numero_groupe, id_employe_prof } = req.body;
    try {
        const result = await pool.query(`UPDATE groupe SET id_creneau=$1, numero_groupe=$2, id_employe_prof=$3 WHERE id=$4 RETURNING *`, [id_creneau, numero_groupe, id_employe_prof || null, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Groupe non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroupe = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM groupe WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Groupe non trouvé' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllGroupes, getGroupeById, createGroupe, updateGroupe, deleteGroupe };
