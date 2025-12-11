import { pool } from '../config/db.js';

// Récupérer toutes les salles
const getAllSalles = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*,
                   (SELECT COUNT(*) FROM inscription WHERE id_salle = s.id) as inscriptions_count
            FROM salle s
            ORDER BY s.nom_salle ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une salle par ID
const getSalleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT s.*,
                   (SELECT COUNT(*) FROM inscription WHERE id_salle = s.id) as inscriptions_count
            FROM salle s
            WHERE s.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Salle non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle salle
const createSalle = async (req, res) => {
    const {
        nom_salle,
        capacite
    } = req.body;

    try {
        // Vérifier si le nom de salle existe déjà
        const salleCheck = await pool.query(
            'SELECT id FROM salle WHERE nom_salle = $1',
            [nom_salle]
        );

        if (salleCheck.rows.length > 0) {
            return res.status(400).json({
                message: 'Une salle avec ce nom existe déjà'
            });
        }

        const result = await pool.query(
            `INSERT INTO salle (
                nom_salle,
                capacite_max
            ) VALUES ($1, $2) RETURNING *`,
            [
                nom_salle,
                capacite
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une salle
const updateSalle = async (req, res) => {
    const { id } = req.params;
    const {
        nom_salle,
        capacite
    } = req.body;

    try {
        // Vérifier si le nom de salle existe déjà pour une autre salle
        if (nom_salle) {
            const salleCheck = await pool.query(
                'SELECT id FROM salle WHERE nom_salle = $1 AND id != $2',
                [nom_salle, id]
            );

            if (salleCheck.rows.length > 0) {
                return res.status(400).json({
                    message: 'Une salle avec ce nom existe déjà'
                });
            }
        }

        const result = await pool.query(
            `UPDATE salle SET
                nom_salle = COALESCE($1, nom_salle),
                capacite_max = COALESCE($2, capacite_max)
            WHERE id = $3 RETURNING *`,
            [
                nom_salle,
                capacite,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Salle non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une salle
const deleteSalle = async (req, res) => {
    const { id } = req.params;
    try {
        // Vérifier si la salle est utilisée par des inscriptions
        const inscriptionCheck = await pool.query(
            'SELECT COUNT(*) as count FROM inscription WHERE id_salle = $1',
            [id]
        );

        if (inscriptionCheck.rows[0].count > 0) {
            return res.status(400).json({
                message: 'Cette salle ne peut pas être supprimée car elle est utilisée par des inscriptions'
            });
        }

        const result = await pool.query('DELETE FROM salle WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Salle non trouvée' });
        }
        res.json({ message: 'Salle supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les salles disponibles (avec places libres)
const getSallesDisponibles = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*,
                   (SELECT COUNT(*) FROM inscription WHERE id_salle = s.id) as inscriptions_count,
                   (s.capacite_max - (SELECT COUNT(*) FROM inscription WHERE id_salle = s.id)) as places_libres
            FROM salle s
            WHERE (s.capacite_max - (SELECT COUNT(*) FROM inscription WHERE id_salle = s.id)) > 0
            ORDER BY s.nom_salle ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les statistiques des salles
const getSallesStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) as total_salles,
                SUM(capacite_max) as capacite_totale,
                SUM((SELECT COUNT(*) FROM inscription WHERE id_salle = s.id)) as inscriptions_totales,
                AVG(capacite_max) as capacite_moyenne
            FROM salle s
        `);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllSalles,
    getSalleById,
    createSalle,
    updateSalle,
    deleteSalle,
    getSallesDisponibles,
    getSallesStats
};
