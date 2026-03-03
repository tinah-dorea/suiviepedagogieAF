import { pool } from '../config/db.js';

const getAllCreneaux = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*,
                   hc.id AS id_horaire_cours,
                   hc.id_type_cours,
                   hc.id_niveau,
                   tc.nom_type_cours,
                   hc.id_categorie,
                   cat.nom_categorie
            FROM creneau c
            LEFT JOIN horaire_cours hc ON c.id_horaire_cours = hc.id
            LEFT JOIN type_cours tc ON hc.id_type_cours = tc.id
            LEFT JOIN categorie cat ON hc.id_categorie = cat.id
            ORDER BY c.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCreneauById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT c.*,
                   hc.id AS id_horaire_cours,
                   hc.id_type_cours,
                   hc.id_niveau,
                   tc.nom_type_cours,
                   hc.id_categorie,
                   cat.nom_categorie
            FROM creneau c
            LEFT JOIN horaire_cours hc ON c.id_horaire_cours = hc.id
            LEFT JOIN type_cours tc ON hc.id_type_cours = tc.id
            LEFT JOIN categorie cat ON hc.id_categorie = cat.id
            WHERE c.id=$1
        `, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Créneau non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCreneau = async (req, res) => {
    const { id_horaire_cours, jour_semaine, heure_debut, heure_fin } = req.body;
    if (!id_horaire_cours || !jour_semaine || !heure_debut || !heure_fin) {
        return res.status(400).json({ message: 'Tous les champs sont requis: id_horaire_cours, jour_semaine, heure_debut, heure_fin' });
    }

    try {
        // Convert JavaScript array to PostgreSQL array format if needed
        let joursArray = jour_semaine;
        if (Array.isArray(jour_semaine)) {
            joursArray = `{${jour_semaine.join(',')}}`;
        }
        
        const result = await pool.query(
            `INSERT INTO creneau (id_horaire_cours, jour_semaine, heure_debut, heure_fin)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_horaire_cours, joursArray, heure_debut, heure_fin]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating creneau:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateCreneau = async (req, res) => {
    const { id } = req.params;
    const { id_horaire_cours, jour_semaine, heure_debut, heure_fin } = req.body;

    try {
        // Convert JavaScript array to PostgreSQL array format if needed
        let joursArray = jour_semaine;
        if (Array.isArray(jour_semaine)) {
            joursArray = `{${jour_semaine.join(',')}}`;
        }
        
        const result = await pool.query(
            `UPDATE creneau SET
                id_horaire_cours=$1,
                jour_semaine=$2,
                heure_debut=$3,
                heure_fin=$4
             WHERE id=$5 RETURNING *`,
            [id_horaire_cours, joursArray, heure_debut, heure_fin, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Créneau non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating creneau:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteCreneau = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM creneau WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Créneau non trouvé' });
        res.json({ message: 'Créneau supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nouvelle fonction pour obtenir les créneaux par horaire_cours
const getCreneauxByHoraireCours = async (req, res) => {
    const { id_horaire_cours } = req.params;
    try {
        const result = await pool.query(`
            SELECT c.*,
                   hc.id AS id_horaire_cours,
                   hc.id_type_cours,
                   tc.nom_type_cours,
                   hc.id_categorie,
                   cat.nom_categorie
            FROM creneau c
            LEFT JOIN horaire_cours hc ON c.id_horaire_cours = hc.id
            LEFT JOIN type_cours tc ON hc.id_type_cours = tc.id
            LEFT JOIN categorie cat ON hc.id_categorie = cat.id
            WHERE c.id_horaire_cours = $1
            ORDER BY c.id ASC
        `, [id_horaire_cours]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    getAllCreneaux, 
    getCreneauById, 
    createCreneau, 
    updateCreneau, 
    deleteCreneau,
    getCreneauxByHoraireCours
};