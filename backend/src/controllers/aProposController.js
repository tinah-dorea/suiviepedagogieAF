import { pool } from '../config/db.js';

// Obtenir les informations 'À propos'
const getAPropos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM a_propos LIMIT 1');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Informations À propos non trouvées' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour les informations 'À propos'
const updateAPropos = async (req, res) => {
    const { 
        nom_etablissement, 
        tel, 
        email, 
        adresse, 
        heure_ouverture, 
        heure_fermeture, 
        jours_ouverture, 
        description, 
        logo_url 
    } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE a_propos SET 
                nom_etablissement = $1, 
                tel = $2, 
                email = $3, 
                adresse = $4, 
                heure_ouverture = $5, 
                heure_fermeture = $6, 
                jours_ouverture = $7, 
                description = $8, 
                logo_url = $9,
                date_mise_a_jour = CURRENT_TIMESTAMP
            WHERE id = 1 RETURNING *`,
            [
                nom_etablissement, 
                tel, 
                email, 
                adresse, 
                heure_ouverture, 
                heure_fermeture, 
                jours_ouverture, 
                description, 
                logo_url
            ]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Informations À propos non trouvées' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23514') { // Violation de contrainte de vérification
            res.status(400).json({ message: 'Heure de fermeture doit être après l\'heure d\'ouverture' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export { 
    getAPropos, 
    updateAPropos
};