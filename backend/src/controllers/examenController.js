import { pool } from '../config/db.js';

// Récupérer tous les examens avec leurs relations
const getAllExamens = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*,
                i.nom,
                i.prenom,
                i.sexe,
                i.date_n,
                i.etat_inscription,
                tc.nom_type_cours,
                s.mois,
                s.annee,
                n.nom_niveau,
                n.sous_niveau
            FROM examen e
            LEFT JOIN inscription i ON e.id_inscription = i.id
            LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            ORDER BY e.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un examen par ID
const getExamenById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.*,
                i.nom,
                i.prenom,
                i.sexe,
                i.date_n,
                i.etat_inscription,
                tc.nom_type_cours,
                s.mois,
                s.annee,
                n.nom_niveau,
                n.sous_niveau
            FROM examen e
            LEFT JOIN inscription i ON e.id_inscription = i.id
            LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            WHERE e.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouvel examen
const createExamen = async (req, res) => {
    const {
        id_inscription,
        etat_inscription,
        auto_inscription,
        verification
    } = req.body;

    try {
        // Vérifier si l'inscription existe
        const inscriptionCheck = await pool.query(
            'SELECT id FROM inscription WHERE id = $1',
            [id_inscription]
        );

        if (inscriptionCheck.rows.length === 0) {
            return res.status(400).json({
                message: 'L\'inscription spécifiée n\'existe pas'
            });
        }

        // Vérifier si un examen existe déjà pour cette inscription
        const examenCheck = await pool.query(
            'SELECT id FROM examen WHERE id_inscription = $1',
            [id_inscription]
        );

        if (examenCheck.rows.length > 0) {
            return res.status(400).json({
                message: 'Un examen existe déjà pour cette inscription'
            });
        }

        const result = await pool.query(
            `INSERT INTO examen (
                id_inscription,
                etat_inscription,
                auto_inscription,
                verification
            ) VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                id_inscription,
                etat_inscription,
                auto_inscription,
                verification
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'La référence à l\'inscription n\'existe pas'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Mettre à jour un examen
const updateExamen = async (req, res) => {
    const { id } = req.params;
    const {
        id_inscription,
        etat_inscription,
        auto_inscription,
        verification
    } = req.body;

    try {
        // Vérifier si l'inscription existe (si elle est modifiée)
        if (id_inscription) {
            const inscriptionCheck = await pool.query(
                'SELECT id FROM inscription WHERE id = $1',
                [id_inscription]
            );

            if (inscriptionCheck.rows.length === 0) {
                return res.status(400).json({
                    message: 'L\'inscription spécifiée n\'existe pas'
                });
            }

            // Vérifier si un autre examen utilise déjà cette inscription
            const examenCheck = await pool.query(
                'SELECT id FROM examen WHERE id_inscription = $1 AND id != $2',
                [id_inscription, id]
            );

            if (examenCheck.rows.length > 0) {
                return res.status(400).json({
                    message: 'Un autre examen utilise déjà cette inscription'
                });
            }
        }

        const result = await pool.query(
            `UPDATE examen SET
                id_inscription = COALESCE($1, id_inscription),
                etat_inscription = COALESCE($2, etat_inscription),
                auto_inscription = COALESCE($3, auto_inscription),
                verification = COALESCE($4, verification)
            WHERE id = $5 RETURNING *`,
            [
                id_inscription,
                etat_inscription,
                auto_inscription,
                verification,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'La référence à l\'inscription n\'existe pas'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Supprimer un examen
const deleteExamen = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM examen WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }
        res.json({ message: 'Examen supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les examens par inscription
const getExamensByInscription = async (req, res) => {
    const { inscriptionId } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.*,
                i.nom,
                i.prenom,
                tc.nom_type_cours,
                s.mois,
                s.annee
            FROM examen e
            LEFT JOIN inscription i ON e.id_inscription = i.id
            LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
            LEFT JOIN session s ON i.id_session = s.id
            WHERE e.id_inscription = $1
            ORDER BY e.id ASC
        `, [inscriptionId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les examens par session
const getExamensBySession = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.*,
                i.nom,
                i.prenom,
                i.sexe,
                i.date_n,
                tc.nom_type_cours,
                n.nom_niveau,
                n.sous_niveau
            FROM examen e
            LEFT JOIN inscription i ON e.id_inscription = i.id
            LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            WHERE i.id_session = $1
            ORDER BY i.nom ASC, i.prenom ASC
        `, [sessionId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllExamens,
    getExamenById,
    createExamen,
    updateExamen,
    deleteExamen,
    getExamensByInscription,
    getExamensBySession
};
