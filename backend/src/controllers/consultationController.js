import { pool } from '../config/db.js';

// Liste publique des sessions (sans nb_inscrits, nb_groupes)
const getSessionsPublic = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.id, s.nom_session, s.mois, s.annee, s.date_debut, s.date_fin,
                   s.date_fin_inscription, s.date_exam, s.duree_cours,
                   tc.id AS id_type_cours, tc.nom_type_cours
            FROM session s
            LEFT JOIN type_cours tc ON s.id_type_cours = tc.id
            ORDER BY s.date_debut DESC NULLS LAST, s.annee DESC, s.mois DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getSessionsPublic:', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des sessions', error: error.message });
    }
};

// Détail complet d'une session : session + horaire_cours + creneaux
const getSessionDetailPublic = async (req, res) => {
    const { id } = req.params;
    try {
        // Vérifier si l'ID est valide
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'ID de session invalide' });
        }

        const sessionResult = await pool.query(`
            SELECT s.*, tc.nom_type_cours
            FROM session s
            LEFT JOIN type_cours tc ON s.id_type_cours = tc.id
            WHERE s.id = $1
        `, [id]);

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }

        const session = sessionResult.rows[0];

        // Get horaires_cours by id_session (direct link to session)
        const horairesResult = await pool.query(`
            SELECT hc.*, c.nom_categorie
            FROM horaire_cours hc
            LEFT JOIN categorie c ON hc.id_categorie = c.id
            WHERE hc.id_session = $1
            ORDER BY hc.id ASC
        `, [id]);

        const horaires = horairesResult.rows;

        for (const h of horaires) {
            const creneauxResult = await pool.query(`
                SELECT c.id, c.jour_semaine, c.heure_debut, c.heure_fin
                FROM creneau c
                WHERE c.id_horaire_cours = $1
                ORDER BY c.id ASC
            `, [h.id]);
            h.creneaux = creneauxResult.rows;
        }

        res.json({
            session,
            horaires_cours: horaires
        });
    } catch (error) {
        console.error('Erreur getSessionDetailPublic:', error.message);
        console.error('Détails:', error.stack);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des détails', error: error.message });
    }
};

// Liste publique des types de cours (pour le filtre)
const getTypeCoursPublic = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, nom_type_cours FROM type_cours ORDER BY nom_type_cours ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getTypeCoursPublic:', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des types de cours', error: error.message });
    }
};

export {
    getSessionsPublic,
    getSessionDetailPublic,
    getTypeCoursPublic
};
