import { pool } from '../config/db.js';

// Récupérer toutes les sessions
const getAllSessions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, tc.nom_type_cours
            FROM session s
            LEFT JOIN type_cours tc ON s.id_type_cours = tc.id
            ORDER BY s.annee DESC, s.mois DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une session par ID
const getSessionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT s.*, tc.nom_type_cours
            FROM session s
            LEFT JOIN type_cours tc ON s.id_type_cours = tc.id
            WHERE s.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle session
const createSession = async (req, res) => {
    const {
        mois,
        annee,
        id_type_cours,
        date_fin_inscription,
        date_debut,
        date_fin,
        date_exam
    } = req.body;

    try {
        // Vérifier si une session existe déjà pour ce mois/année/type de cours
        const sessionExistante = await pool.query(`
            SELECT * FROM session
            WHERE mois = $1 AND annee = $2 AND id_type_cours = $3
        `, [mois, annee, id_type_cours]);

        if (sessionExistante.rows.length > 0) {
            return res.status(400).json({
                message: 'Une session existe déjà pour ce mois/année/type de cours'
            });
        }

        // Vérifier la cohérence des dates (optionnelles)
        if (date_fin_inscription && date_debut && new Date(date_fin_inscription) >= new Date(date_debut)) {
            return res.status(400).json({
                message: 'La date de fin d\'inscription doit être antérieure à la date de début'
            });
        }
        if (date_debut && date_fin && new Date(date_debut) >= new Date(date_fin)) {
            return res.status(400).json({
                message: 'La date de début doit être antérieure à la date de fin'
            });
        }
        if (date_fin && date_exam && new Date(date_fin) > new Date(date_exam)) {
            return res.status(400).json({
                message: 'La date d\'examen doit être postérieure ou égale à la date de fin'
            });
        }

        const result = await pool.query(
            `INSERT INTO session (
                mois,
                annee,
                id_type_cours,
                date_fin_inscription,
                date_debut,
                date_fin,
                date_exam
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Le type de cours spécifié n\'existe pas' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Mettre à jour une session
const updateSession = async (req, res) => {
    const { id } = req.params;
    const {
        mois,
        annee,
        id_type_cours,
        date_fin_inscription,
        date_debut,
        date_fin,
        date_exam
    } = req.body;

    try {
        // Vérifier si une autre session existe déjà pour ce mois/année/type de cours
        const sessionExistante = await pool.query(`
            SELECT * FROM session
            WHERE mois = $1 AND annee = $2 AND id_type_cours = $3 AND id != $4
        `, [mois, annee, id_type_cours, id]);

        if (sessionExistante.rows.length > 0) {
            return res.status(400).json({
                message: 'Une autre session existe déjà pour ce mois/année/type de cours'
            });
        }

        // Vérifier la cohérence des dates (optionnelles)
        if (date_fin_inscription && date_debut && new Date(date_fin_inscription) >= new Date(date_debut)) {
            return res.status(400).json({
                message: 'La date de fin d\'inscription doit être antérieure à la date de début'
            });
        }
        if (date_debut && date_fin && new Date(date_debut) >= new Date(date_fin)) {
            return res.status(400).json({
                message: 'La date de début doit être antérieure à la date de fin'
            });
        }
        if (date_fin && date_exam && new Date(date_fin) > new Date(date_exam)) {
            return res.status(400).json({
                message: 'La date d\'examen doit être postérieure ou égale à la date de fin'
            });
        }

        const result = await pool.query(
            `UPDATE session SET
                mois = $1,
                annee = $2,
                id_type_cours = $3,
                date_fin_inscription = $4,
                date_debut = $5,
                date_fin = $6,
                date_exam = $7
            WHERE id = $8 RETURNING *`,
            [mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Le type de cours spécifié n\'existe pas' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Supprimer une session
const deleteSession = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM session WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }
        res.json({ message: 'Session supprimée avec succès' });
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Cette session ne peut pas être supprimée car elle est utilisée par d\'autres enregistrements'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Récupérer les sessions par type de cours
const getSessionsByTypeCours = async (req, res) => {
    const { typeCoursId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM session
            WHERE id_type_cours = $1
            ORDER BY annee DESC, mois DESC`,
            [typeCoursId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les sessions actives (en cours ou à venir)
const getSessionsActives = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, tc.nom_type_cours
            FROM session s
            LEFT JOIN type_cours tc ON s.id_type_cours = tc.id
            WHERE date_fin >= CURRENT_DATE
            ORDER BY date_debut ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    getSessionsByTypeCours,
    getSessionsActives
};
