import { pool } from '../config/db.js';

// Obtenir tous les professeurs
const getAllProfesseurs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe,
                   e.tel AS tel_employe,
                   e.email AS email_employe,
                   e.role AS role_employe
            FROM professeur p
            LEFT JOIN employe e ON p.id_employe = e.id
            ORDER BY e.nom ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un professeur par ID
const getProfesseurById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT p.*,
                   e.nom AS nom_employe,
                   e.prenom AS prenom_employe,
                   e.tel AS tel_employe,
                   e.email AS email_employe,
                   e.role AS role_employe
            FROM professeur p
            LEFT JOIN employe e ON p.id_employe = e.id
            WHERE p.id = $1
        `, [id]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Professeur non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau professeur
const createProfesseur = async (req, res) => {
    const { id_employe, specialite_niveaux } = req.body;
    
    if (!id_employe) {
        return res.status(400).json({ message: 'id_employe est requis' });
    }
    
    try {
        // Vérifier si l'employé existe
        const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [id_employe]);
        if (employeCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        
        // Vérifier si ce professeur existe déjà
        const existingProf = await pool.query('SELECT id FROM professeur WHERE id_employe = $1', [id_employe]);
        if (existingProf.rows.length > 0) {
            return res.status(409).json({ message: 'Cet employé est déjà enregistré comme professeur' });
        }
        
        const result = await pool.query(
            `INSERT INTO professeur (id_employe, specialite_niveaux) 
             VALUES ($1, $2) RETURNING *`,
            [id_employe, specialite_niveaux || []]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un professeur
const updateProfesseur = async (req, res) => {
    const { id } = req.params;
    const { id_employe, specialite_niveaux } = req.body;
    
    try {
        // Vérifier si l'employé existe
        const employeCheck = await pool.query('SELECT id FROM employe WHERE id = $1', [id_employe]);
        if (employeCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        
        const result = await pool.query(
            `UPDATE professeur SET 
                id_employe = $1, 
                specialite_niveaux = $2 
             WHERE id = $3 RETURNING *`,
            [id_employe, specialite_niveaux || [], id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Professeur non trouvé' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un professeur
const deleteProfesseur = async (req, res) => {
    const { id } = req.params;
    try {
        // Vérifier s'il y a des dépendances (groupes associés à ce professeur)
        const dependanciesCheck = await pool.query('SELECT id FROM groupe WHERE id_professeur = $1', [id]);
        if (dependanciesCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Impossible de supprimer ce professeur car il est assigné à un ou plusieurs groupes' });
        }
        
        const result = await pool.query('DELETE FROM professeur WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Professeur non trouvé' });
        res.json({ message: 'Supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    getAllProfesseurs, 
    getProfesseurById, 
    createProfesseur, 
    updateProfesseur, 
    deleteProfesseur
};