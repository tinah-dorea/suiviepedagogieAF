import { pool } from '../config/db.js';

const getAllPresences = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*,
                i.nom as etudiant_nom,
                i.prenom as etudiant_prenom,
                g.numero_groupe,
                e.nom as saisie_nom,
                e.prenom as saisie_prenom
            FROM presence p
            LEFT JOIN inscription i ON p.id_inscription = i.id
            LEFT JOIN groupe g ON p.id_groupe = g.id
            LEFT JOIN employe e ON p.id_employe_saisie = e.id
            ORDER BY p.date_cours DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPresenceById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM presence WHERE id=$1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Présence non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPresence = async (req, res) => {
    const { id_inscription, id_groupe, date_cours, est_present, heure_arrivee, remarque, id_employe_saisie } = req.body;
    if (!id_inscription || !id_groupe || !date_cours) return res.status(400).json({ message: 'id_inscription, id_groupe et date_cours requis' });
    try {
        const result = await pool.query(
            `INSERT INTO presence (id_inscription, id_groupe, date_cours, est_present, heure_arrivee, remarque, id_employe_saisie) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [id_inscription, id_groupe, date_cours, est_present ?? true, heure_arrivee || null, remarque || null, id_employe_saisie || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePresence = async (req, res) => {
    const { id } = req.params;
    const { id_inscription, id_groupe, date_cours, est_present, heure_arrivee, remarque, id_employe_saisie } = req.body;
    try {
        const result = await pool.query(
            `UPDATE presence SET id_inscription=$1, id_groupe=$2, date_cours=$3, est_present=$4, heure_arrivee=$5, remarque=$6, id_employe_saisie=$7 WHERE id=$8 RETURNING *`,
            [id_inscription, id_groupe, date_cours, est_present, heure_arrivee || null, remarque || null, id_employe_saisie || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Présence non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePresence = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM presence WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Présence non trouvée' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllPresences, getPresenceById, createPresence, updatePresence, deletePresence };
