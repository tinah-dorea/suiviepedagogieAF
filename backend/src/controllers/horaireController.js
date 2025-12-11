import { pool } from '../config/db.js';

// Récupérer tous les horaires avec leurs relations
const getAllHoraires = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT h.*,
                tc.nom_type_cours,
                n.nom_niveau,
                n.sous_niveau,
                c.nom_categorie
            FROM horaire h
            LEFT JOIN type_cours tc ON h.id_type_cours = tc.id
            LEFT JOIN niveau n ON h.id_niveau = n.id
            LEFT JOIN categorie c ON h.id_categorie = c.id
            ORDER BY h.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un horaire par ID
const getHoraireById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT h.*,
                tc.nom_type_cours,
                n.nom_niveau,
                n.sous_niveau,
                c.nom_categorie
            FROM horaire h
            LEFT JOIN type_cours tc ON h.id_type_cours = tc.id
            LEFT JOIN niveau n ON h.id_niveau = n.id
            LEFT JOIN categorie c ON h.id_categorie = c.id
            WHERE h.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Horaire non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouvel horaire
const createHoraire = async (req, res) => {
    const {
        id_type_cours,
        id_niveau,
        id_categorie,
        jours_des_cours,
        heure_debut,
        heure_fin
    } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO horaire (
                id_type_cours,
                id_niveau,
                id_categorie,
                jours_des_cours,
                heure_debut,
                heure_fin
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id_type_cours, id_niveau, id_categorie, jours_des_cours, heure_debut, heure_fin]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Une des références (type_cours, niveau ou catégorie) n\'existe pas'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Mettre à jour un horaire
const updateHoraire = async (req, res) => {
    const { id } = req.params;
    const {
        id_type_cours,
        id_niveau,
        id_categorie,
        jours_des_cours,
        heure_debut,
        heure_fin
    } = req.body;

    try {

        const result = await pool.query(
            `UPDATE horaire SET
                id_type_cours = $1,
                id_niveau = $2,
                id_categorie = $3,
                jours_des_cours = $4,
                heure_debut = $5,
                heure_fin = $6
            WHERE id = $7 RETURNING *`,
            [id_type_cours, id_niveau, id_categorie, jours_des_cours, heure_debut, heure_fin, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Horaire non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Une des références (type_cours, niveau ou catégorie) n\'existe pas'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Supprimer un horaire
const deleteHoraire = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM horaire WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Horaire non trouvé' });
        }
        res.json({ message: 'Horaire supprimé avec succès' });
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Cet horaire ne peut pas être supprimé car il est utilisé par d\'autres enregistrements'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Récupérer les horaires par type de cours
const getHorairesByTypeCours = async (req, res) => {
    const { typeCoursId } = req.params;
    try {
        const result = await pool.query(
            `SELECT h.*,
                n.nom_niveau,
                n.sous_niveau,
                c.nom_categorie
            FROM horaire h
            LEFT JOIN niveau n ON h.id_niveau = n.id
            LEFT JOIN categorie c ON h.id_categorie = c.id
            WHERE h.id_type_cours = $1
            ORDER BY h.heure_debut ASC`,
            [typeCoursId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllHoraires,
    getHoraireById,
    createHoraire,
    updateHoraire,
    deleteHoraire,
    getHorairesByTypeCours
};
