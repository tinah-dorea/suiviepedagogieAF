import { pool } from '../config/db.js';

// Récupérer toutes les catégories
const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, tc.nom_type_cours
            FROM categorie c
            LEFT JOIN type_cours tc ON c.id_type_cours = tc.id
            ORDER BY c.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une catégorie par ID
const getCategorieById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT c.*, tc.nom_type_cours
            FROM categorie c
            LEFT JOIN type_cours tc ON c.id_type_cours = tc.id
            WHERE c.id = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle catégorie
const createCategorie = async (req, res) => {
    const { nom_categorie, id_type_cours, min_age, max_age } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO categorie (nom_categorie, id_type_cours, min_age, max_age) VALUES ($1, $2, $3, $4) RETURNING *',
            [nom_categorie, id_type_cours, min_age, max_age]
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

// Mettre à jour une catégorie
const updateCategorie = async (req, res) => {
    const { id } = req.params;
    const { nom_categorie, id_type_cours, min_age, max_age } = req.body;
    try {
        const result = await pool.query(
            'UPDATE categorie SET nom_categorie = $1, id_type_cours = $2, min_age = $3, max_age = $4 WHERE id = $5 RETURNING *',
            [nom_categorie, id_type_cours, min_age, max_age, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
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

// Supprimer une catégorie
const deleteCategorie = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM categorie WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Cette catégorie ne peut pas être supprimée car elle est utilisée par d\'autres enregistrements' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Récupérer les catégories par type de cours
const getCategoriesByTypeCours = async (req, res) => {
    const { typeCoursId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM categorie WHERE id_type_cours = $1 ORDER BY id ASC',
            [typeCoursId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie,
    getCategoriesByTypeCours
};
