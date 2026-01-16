import { pool } from '../config/db.js';

// NOTE: le schéma actuel utilise la table `creneau` liée à `session_cours`.
// Récupérer tous les créneaux avec leurs relations
const getAllHoraires = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT h.*,
                h.jour_semaine,
                sc.id AS id_session_cours,
                sc.id_type_cours,
                sc.id_session,
                sc.id_niveau,
                tc.nom_type_cours,
                s.mois,
                s.annee,
                n.nom_niveau
            FROM creneau h
            LEFT JOIN session_cours sc ON h.id_session_cours = sc.id
            LEFT JOIN type_cours tc ON sc.id_type_cours = tc.id
            LEFT JOIN session s ON sc.id_session = s.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            ORDER BY h.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un créneau par ID
const getHoraireById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT h.*,
                h.jour_semaine,
                sc.id AS id_session_cours,
                sc.id_type_cours,
                tc.nom_type_cours,
                s.mois,
                s.annee,
                n.nom_niveau
            FROM creneau h
            LEFT JOIN session_cours sc ON h.id_session_cours = sc.id
            LEFT JOIN type_cours tc ON sc.id_type_cours = tc.id
            LEFT JOIN session s ON sc.id_session = s.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            WHERE h.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Créneau non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau créneau
const createHoraire = async (req, res) => {
    const { id_session_cours, jour_semaine, heure_debut, heure_fin } = req.body;
    if (!id_session_cours || !jour_semaine || !heure_debut || !heure_fin) {
        return res.status(400).json({ message: 'id_session_cours, jour_semaine, heure_debut et heure_fin sont requis.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO creneau (
                id_session_cours,
                jour_semaine,
                heure_debut,
                heure_fin
            ) VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_session_cours, jour_semaine, heure_debut, heure_fin]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'La référence session_cours n\'existe pas.' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Mettre à jour un créneau
const updateHoraire = async (req, res) => {
    const { id } = req.params;
    const { id_session_cours, jour_semaine, heure_debut, heure_fin } = req.body;
    try {
        const result = await pool.query(
            `UPDATE creneau SET
                id_session_cours = $1,
                jour_semaine = $2,
                heure_debut = $3,
                heure_fin = $4
            WHERE id = $5 RETURNING *`,
            [id_session_cours, jour_semaine, heure_debut, heure_fin, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Créneau non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'La référence session_cours n\'existe pas.' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Supprimer un créneau
const deleteHoraire = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM creneau WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Créneau non trouvé' });
        }
        res.json({ message: 'Créneau supprimé avec succès' });
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Ce créneau ne peut pas être supprimé car il est utilisé par d\'autres enregistrements' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Récupérer les créneaux par type de cours (via session_cours)
const getHorairesByTypeCours = async (req, res) => {
    const { typeCoursId } = req.params;
    try {
        const result = await pool.query(
            `SELECT h.*,
                sc.id AS id_session_cours,
                n.nom_niveau
            FROM creneau h
            LEFT JOIN session_cours sc ON h.id_session_cours = sc.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            WHERE sc.id_type_cours = $1
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
