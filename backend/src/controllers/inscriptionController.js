import { pool } from '../config/db.js';

const toNullableInt = (value) => {
    if (value === undefined || value === null || value === '') return null;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
};

const toNullableText = (value) => {
    if (value === undefined || value === null) return null;
    const trimmed = value.toString().trim();
    return trimmed === '' ? null : trimmed;
};

const toNullableDate = (value) => (value ? value : null);

const toBooleanValue = (value, defaultValue = false) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    const normalized = value.toString().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'oui';
};

const resolveEmployeId = (reqUser, providedId) => {
    const authId = reqUser?.id ? parseInt(reqUser.id, 10) : null;
    return toNullableInt(providedId) || authId || null;
};

// Récupérer toutes les inscriptions avec leurs relations (utilise id_creneau -> creneau -> session_cours)
const getAllInscriptions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT i.*,
                h.heure_debut,
                h.heure_fin,
                h.jour_semaine,
                sc.id AS id_session_cours,
                sc.id_type_cours,
                sc.id_session,
                sc.id_niveau,
                sc.id_categorie,
                tc.nom_type_cours,
                ts.nom_service,
                s.mois,
                s.annee,
                n.nom_niveau,
                n.sous_niveau,
                m.nom_motivation
            FROM inscription i
            LEFT JOIN creneau h ON i.id_creneau = h.id
            LEFT JOIN session_cours sc ON h.id_session_cours = sc.id
            LEFT JOIN type_cours tc ON sc.id_type_cours = tc.id
            LEFT JOIN type_service ts ON tc.id_type_service = ts.id
            LEFT JOIN session s ON sc.id_session = s.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            LEFT JOIN motivation m ON i.id_motivation = m.id
            ORDER BY i.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une inscription par ID (avec info de créneau/session_cours)
const getInscriptionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                h.heure_debut,
                h.heure_fin,
                h.jour_semaine,
                sc.id AS id_session_cours,
                sc.id_type_cours,
                tc.nom_type_cours,
                ts.nom_service,
                s.mois,
                s.annee,
                n.nom_niveau,
                n.sous_niveau,
                m.nom_motivation
            FROM inscription i
            LEFT JOIN creneau h ON i.id_creneau = h.id
            LEFT JOIN session_cours sc ON h.id_session_cours = sc.id
            LEFT JOIN type_cours tc ON sc.id_type_cours = tc.id
            LEFT JOIN type_service ts ON tc.id_type_service = ts.id
            LEFT JOIN session s ON sc.id_session = s.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            LEFT JOIN motivation m ON i.id_motivation = m.id
            WHERE i.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle inscription
const createInscription = async (req, res) => {
    // Nouveau schéma: l'inscription référence un `id_creneau` (créneau -> session_cours -> type_cours/session/etc.)
    const payload = {
        id_creneau: toNullableInt(req.body.id_creneau),
        num_carte: toNullableText(req.body.num_carte),
        etat_inscription: toBooleanValue(req.body.etat_inscription, true),
        sexe: toNullableText(req.body.sexe),
        nom: toNullableText(req.body.nom),
        prenom: toNullableText(req.body.prenom),
        date_n: toNullableDate(req.body.date_n),
        adresse: toNullableText(req.body.adresse),
        tel: toNullableText(req.body.tel),
        id_motivation: toNullableInt(req.body.id_motivation),
        etablissement: toNullableText(req.body.etablissement),
        niveau_scolaire: toNullableText(req.body.niveau_scolaire),
        lieu_n: toNullableText(req.body.lieu_n),
        nationalite: toNullableText(req.body.nationalite)
    };

    if (!payload.id_creneau || !payload.nom || !payload.prenom) {
        return res.status(400).json({ message: 'Les champs id_creneau, nom et prénom sont obligatoires.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO inscription (
                id_creneau,
                num_carte,
                etat_inscription,
                sexe,
                nom,
                prenom,
                date_n,
                adresse,
                tel,
                id_motivation,
                etablissement,
                niveau_scolaire,
                lieu_n,
                nationalite
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [
                payload.id_creneau,
                payload.num_carte,
                payload.etat_inscription,
                payload.sexe,
                payload.nom,
                payload.prenom,
                payload.date_n,
                payload.adresse,
                payload.tel,
                payload.id_motivation,
                payload.etablissement,
                payload.niveau_scolaire,
                payload.lieu_n,
                payload.nationalite
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Une des références (creneau, motivation, ...) n\'existe pas'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Mettre à jour une inscription
const updateInscription = async (req, res) => {
    const { id } = req.params;
    const payload = {
        id_creneau: toNullableInt(req.body.id_creneau),
        num_carte: toNullableText(req.body.num_carte),
        etat_inscription: toBooleanValue(req.body.etat_inscription, true),
        sexe: toNullableText(req.body.sexe),
        nom: toNullableText(req.body.nom),
        prenom: toNullableText(req.body.prenom),
        date_n: toNullableDate(req.body.date_n),
        adresse: toNullableText(req.body.adresse),
        tel: toNullableText(req.body.tel),
        id_motivation: toNullableInt(req.body.id_motivation),
        etablissement: toNullableText(req.body.etablissement),
        niveau_scolaire: toNullableText(req.body.niveau_scolaire),
        lieu_n: toNullableText(req.body.lieu_n),
        nationalite: toNullableText(req.body.nationalite)
    };

    try {
        const result = await pool.query(
            `UPDATE inscription SET
                id_creneau = $1,
                num_carte = $2,
                etat_inscription = $3,
                sexe = $4,
                nom = $5,
                prenom = $6,
                date_n = $7,
                adresse = $8,
                tel = $9,
                id_motivation = $10,
                etablissement = $11,
                niveau_scolaire = $12,
                lieu_n = $13,
                nationalite = $14
            WHERE id = $15 RETURNING *`,
            [
                payload.id_creneau,
                payload.num_carte,
                payload.etat_inscription,
                payload.sexe,
                payload.nom,
                payload.prenom,
                payload.date_n,
                payload.adresse,
                payload.tel,
                payload.id_motivation,
                payload.etablissement,
                payload.niveau_scolaire,
                payload.lieu_n,
                payload.nationalite,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Une des références (creneau, motivation, ...) n\'existe pas'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Supprimer une inscription
const deleteInscription = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM inscription WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }
        res.json({ message: 'Inscription supprimée avec succès' });
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Cette inscription ne peut pas être supprimée car elle est référencée par d\'autres enregistrements'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Récupérer les inscriptions par type de cours (via session_cours)
const getInscriptionsByTypeCours = async (req, res) => {
    const { typeCoursId } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                s.mois,
                s.annee,
                n.nom_niveau,
                n.sous_niveau,
                h.heure_debut,
                h.heure_fin
            FROM inscription i
            LEFT JOIN creneau h ON i.id_creneau = h.id
            LEFT JOIN session_cours sc ON h.id_session_cours = sc.id
            LEFT JOIN session s ON sc.id_session = s.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            WHERE sc.id_type_cours = $1
            ORDER BY i.nom ASC, i.prenom ASC
        `, [typeCoursId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les inscriptions par session (via session_cours)
const getInscriptionsBySession = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                tc.nom_type_cours,
                n.nom_niveau,
                n.sous_niveau,
                h.heure_debut,
                h.heure_fin
            FROM inscription i
            LEFT JOIN creneau h ON i.id_creneau = h.id
            LEFT JOIN session_cours sc ON h.id_session_cours = sc.id
            LEFT JOIN type_cours tc ON sc.id_type_cours = tc.id
            LEFT JOIN niveau n ON sc.id_niveau = n.id
            WHERE sc.id_session = $1
            ORDER BY i.nom ASC, i.prenom ASC
        `, [sessionId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllInscriptions,
    getInscriptionById,
    createInscription,
    updateInscription,
    deleteInscription,
    getInscriptionsByTypeCours,
    getInscriptionsBySession
};
