import { pool } from '../config/db.js';

// Obtenir tous les horaires de cours
const getAllHorairesCours = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT hc.*,
                   s.nom_session,
                   s.date_debut,
                   s.date_fin,
                   ARRAY_AGG(DISTINCT n.code) AS niveaux,
                   c.nom_categorie
            FROM horaire_cours hc
            LEFT JOIN session s ON hc.id_session = s.id
            LEFT JOIN niveau n ON n.id = ANY(hc.id_niveau)  -- Accès aux éléments du tableau
            LEFT JOIN categorie c ON hc.id_categorie = c.id
            GROUP BY hc.id, s.id, c.id
            ORDER BY hc.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un horaire de cours par ID
const getHoraireCoursById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT hc.*,
                   s.nom_session,
                   s.date_debut,
                   s.date_fin,
                   ARRAY_AGG(DISTINCT n.code) AS niveaux,
                   c.nom_categorie
            FROM horaire_cours hc
            LEFT JOIN session s ON hc.id_session = s.id
            LEFT JOIN niveau n ON n.id = ANY(hc.id_niveau)  -- Accès aux éléments du tableau
            LEFT JOIN categorie c ON hc.id_categorie = c.id
            WHERE hc.id = $1
            GROUP BY hc.id, s.id, c.id
        `, [id]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Horaire de cours non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouvel horaire de cours
const createHoraireCours = async (req, res) => {
    const { id_session, id_niveau, id_categorie, duree_heures, duree_semaines } = req.body;
    
    if (!id_session || !id_categorie) {
        return res.status(400).json({ message: 'id_session et id_categorie sont requis' });
    }
    
    try {
        const result = await pool.query(
            `INSERT INTO horaire_cours (id_session, id_niveau, id_categorie, duree_heures, duree_semaines) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_session, id_niveau || [], id_categorie, duree_heures || 30, duree_semaines || 5]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un horaire de cours
const updateHoraireCours = async (req, res) => {
    const { id } = req.params;
    const { id_session, id_niveau, id_categorie, duree_heures, duree_semaines } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE horaire_cours SET 
                id_session=$1, 
                id_niveau=$2, 
                id_categorie=$3, 
                duree_heures=$4, 
                duree_semaines=$5 
             WHERE id=$6 RETURNING *`,
            [id_session, id_niveau || [], id_categorie, duree_heures, duree_semaines, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Horaire de cours non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un horaire de cours
const deleteHoraireCours = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM horaire_cours WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Horaire de cours non trouvé' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les horaires de cours par session
const getHorairesCoursBySession = async (req, res) => {
    const { id_session } = req.params;
    try {
        const result = await pool.query(`
            SELECT hc.*,
                   s.nom_session,
                   s.date_debut,
                   s.date_fin,
                   ARRAY_AGG(DISTINCT n.code) AS niveaux,
                   c.nom_categorie
            FROM horaire_cours hc
            LEFT JOIN session s ON hc.id_session = s.id
            LEFT JOIN niveau n ON n.id = ANY(hc.id_niveau)  -- Accès aux éléments du tableau
            LEFT JOIN categorie c ON hc.id_categorie = c.id
            WHERE hc.id_session = $1
            GROUP BY hc.id, s.id, c.id
            ORDER BY hc.id ASC
        `, [id_session]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    getAllHorairesCours, 
    getHoraireCoursById, 
    createHoraireCours, 
    updateHoraireCours, 
    deleteHoraireCours,
    getHorairesCoursBySession
};