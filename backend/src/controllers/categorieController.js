import { pool } from '../config/db.js';

// Obtenir toutes les catégories
const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*
            FROM categorie c
            ORDER BY c.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une catégorie par ID
const getCategorieById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT c.*
            FROM categorie c
            WHERE c.id = $1
        `, [id]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle catégorie
const createCategorie = async (req, res) => {
    const { nom_categorie, min_age, max_age } = req.body;
    
    if (!nom_categorie || min_age === undefined || max_age === undefined) {
        return res.status(400).json({ message: 'nom_categorie, min_age et max_age sont requis' });
    }
    
    try {
        // Vérifier si une catégorie avec le même nom existe déjà
        const existingCategorie = await pool.query(
            'SELECT id FROM categorie WHERE nom_categorie = $1',
            [nom_categorie]
        );
        if (existingCategorie.rows.length > 0) {
            return res.status(409).json({ message: 'Une catégorie avec ce nom existe déjà' });
        }
        
        const result = await pool.query(
            `INSERT INTO categorie (nom_categorie, min_age, max_age) VALUES ($1, $2, $3) RETURNING *`,
            [nom_categorie, min_age, max_age]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une catégorie
const updateCategorie = async (req, res) => {
    const { id } = req.params;
    const { nom_categorie, min_age, max_age } = req.body;
    
    try {
        // Vérifier si une autre catégorie avec le même nom existe déjà
        const existingCategorie = await pool.query(
            'SELECT id FROM categorie WHERE nom_categorie = $1 AND id != $2',
            [nom_categorie, id]
        );
        if (existingCategorie.rows.length > 0) {
            return res.status(409).json({ message: 'Une catégorie avec ce nom existe déjà' });
        }
        
        const result = await pool.query(
            `UPDATE categorie SET nom_categorie = $1, min_age = $2, max_age = $3 WHERE id = $4 RETURNING *`,
            [nom_categorie, min_age, max_age, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une catégorie
const deleteCategorie = async (req, res) => {
    const { id } = req.params;
    try {
        // Vérifier s'il y a des dépendances avec cette catégorie
        const dependanciesCheck = await pool.query(`
            SELECT 
                COUNT(*) as count
            FROM (
                SELECT id FROM horaire_cours WHERE id_categorie = $1
                UNION ALL
                SELECT id FROM inscription WHERE id_categorie = $1
            ) AS combined
        `, [id]);
        
        if (parseInt(dependanciesCheck.rows[0].count) > 0) {
            return res.status(409).json({ message: 'Impossible de supprimer la catégorie car elle est utilisée dans d\'autres tables' });
        }
        
        const result = await pool.query('DELETE FROM categorie WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les catégories par type de cours (maintenant obsolète car id_type_cours n'existe plus dans la table categorie)
// Cette fonction peut être supprimée ou adaptée si nécessaire
const getCategoriesByTypeCours = async (req, res) => {
    // Cette fonction n'est plus applicable car la table categorie ne contient plus id_type_cours
    res.status(404).json({ message: 'Cette fonctionnalité n\'est plus disponible car la table categorie ne contient plus de référence à id_type_cours' });
};

export { 
    getAllCategories, 
    getCategorieById, 
    createCategorie, 
    updateCategorie, 
    deleteCategorie,
    getCategoriesByTypeCours
};
