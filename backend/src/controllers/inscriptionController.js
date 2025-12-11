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

// Récupérer toutes les inscriptions avec leurs relations
const getAllInscriptions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT i.*,
                tc.nom_type_cours,
                ts.nom_service,
                s.mois,
                s.annee,
                s.date_fin_inscription,
                n.nom_niveau,
                n.sous_niveau,
                h.heure_debut,
                h.heure_fin,
                h.jours_des_cours,
                sal.nom_salle,
                sal.capacite_max,
                e.nom as employe_nom,
                e.prenom as employe_prenom,
                m.nom_motivation
            FROM inscription i
            LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
            LEFT JOIN type_service ts ON tc.id_type_service = ts.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN horaire h ON i.id_horaire = h.id
            LEFT JOIN salle sal ON i.id_salle = sal.id
            LEFT JOIN employe e ON i.id_employe = e.id
            LEFT JOIN motivation m ON i.id_motivation = m.id
            ORDER BY i.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une inscription par ID
const getInscriptionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                tc.nom_type_cours,
                ts.nom_service,
                s.mois,
                s.annee,
                s.date_fin_inscription,
                n.nom_niveau,
                n.sous_niveau,
                h.heure_debut,
                h.heure_fin,
                h.jours_des_cours,
                sal.nom_salle,
                sal.capacite_max,
                e.nom as employe_nom,
                e.prenom as employe_prenom,
                m.nom_motivation
            FROM inscription i
            LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
            LEFT JOIN type_service ts ON tc.id_type_service = ts.id
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN horaire h ON i.id_horaire = h.id
            LEFT JOIN salle sal ON i.id_salle = sal.id
            LEFT JOIN employe e ON i.id_employe = e.id
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
    const payload = {
        id_type_cours: toNullableInt(req.body.id_type_cours),
        id_employe: resolveEmployeId(req.user, req.body.id_employe),
        id_session: toNullableInt(req.body.id_session),
        id_horaire: toNullableInt(req.body.id_horaire),
        id_niveau: toNullableInt(req.body.id_niveau),
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
        nationalite: toNullableText(req.body.nationalite),
        id_salle: toNullableInt(req.body.id_salle)
    };

    if (!payload.id_type_cours || !payload.id_session || !payload.id_horaire || !payload.id_niveau || !payload.nom || !payload.prenom || !payload.sexe) {
        return res.status(400).json({ message: 'Les champs type de cours, session, horaire, niveau, nom, prénom et sexe sont obligatoires.' });
    }

    if (!payload.id_employe) {
        return res.status(401).json({ message: "Impossible de déterminer l'employé ayant créé l'inscription." });
    }

    try {
        // Vérifier la capacité de la salle si elle est spécifiée
        if (payload.id_salle) {
            const salleCheck = await pool.query(`
                SELECT capacite_max,
                       (SELECT COUNT(*) FROM inscription WHERE id_salle = $1) as inscriptions_count
                FROM salle WHERE id = $1
            `, [payload.id_salle]);

            if (salleCheck.rows.length > 0) {
                const { capacite_max, inscriptions_count } = salleCheck.rows[0];
                if (inscriptions_count >= capacite_max) {
                    return res.status(400).json({
                        message: 'La salle a atteint sa capacité maximale'
                    });
                }
            }
        }

        const result = await pool.query(
            `INSERT INTO inscription (
                id_type_cours,
                id_employe,
                id_session,
                id_horaire,
                id_niveau,
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
                nationalite,
                id_salle
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
            [
                payload.id_type_cours,
                payload.id_employe,
                payload.id_session,
                payload.id_horaire,
                payload.id_niveau,
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
                payload.id_salle
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503') {
            res.status(400).json({
                message: 'Une des références (type_cours, employe, session, horaire, niveau, motivation ou salle) n\'existe pas'
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
        id_type_cours: toNullableInt(req.body.id_type_cours),
        id_employe: resolveEmployeId(req.user, req.body.id_employe),
        id_session: toNullableInt(req.body.id_session),
        id_horaire: toNullableInt(req.body.id_horaire),
        id_niveau: toNullableInt(req.body.id_niveau),
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
        nationalite: toNullableText(req.body.nationalite),
        id_salle: toNullableInt(req.body.id_salle)
    };

    try {
        // Vérifier la capacité de la salle si elle est spécifiée et différente
        if (payload.id_salle) {
            const salleCheck = await pool.query(`
                SELECT capacite_max,
                       (SELECT COUNT(*) FROM inscription WHERE id_salle = $1 AND id != $2) as inscriptions_count
                FROM salle WHERE id = $1
            `, [payload.id_salle, id]);

            if (salleCheck.rows.length > 0) {
                const { capacite_max, inscriptions_count } = salleCheck.rows[0];
                if (inscriptions_count >= capacite_max) {
                    return res.status(400).json({
                        message: 'La salle a atteint sa capacité maximale'
                    });
                }
            }
        }

        const result = await pool.query(
            `UPDATE inscription SET
                id_type_cours = $1,
                id_employe = $2,
                id_session = $3,
                id_horaire = $4,
                id_niveau = $5,
                num_carte = $6,
                etat_inscription = $7,
                sexe = $8,
                nom = $9,
                prenom = $10,
                date_n = $11,
                adresse = $12,
                tel = $13,
                id_motivation = $14,
                etablissement = $15,
                niveau_scolaire = $16,
                lieu_n = $17,
                nationalite = $18,
                id_salle = $19
            WHERE id = $20 RETURNING *`,
            [
                payload.id_type_cours,
                payload.id_employe,
                payload.id_session,
                payload.id_horaire,
                payload.id_niveau,
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
                payload.id_salle,
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
                message: 'Une des références (type_cours, employe, session, horaire, niveau, motivation ou salle) n\'existe pas'
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

// Récupérer les inscriptions par type de cours
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
                h.heure_fin,
                sal.nom_salle,
                e.nom as employe_nom,
                e.prenom as employe_prenom
            FROM inscription i
            LEFT JOIN session s ON i.id_session = s.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN horaire h ON i.id_horaire = h.id
            LEFT JOIN salle sal ON i.id_salle = sal.id
            LEFT JOIN employe e ON i.id_employe = e.id
            WHERE i.id_type_cours = $1
            ORDER BY i.nom ASC, i.prenom ASC
        `, [typeCoursId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les inscriptions par session
const getInscriptionsBySession = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*,
                tc.nom_type_cours,
                n.nom_niveau,
                n.sous_niveau,
                h.heure_debut,
                h.heure_fin,
                sal.nom_salle,
                e.nom as employe_nom,
                e.prenom as employe_prenom
            FROM inscription i
            LEFT JOIN type_cours tc ON i.id_type_cours = tc.id
            LEFT JOIN niveau n ON i.id_niveau = n.id
            LEFT JOIN horaire h ON i.id_horaire = h.id
            LEFT JOIN salle sal ON i.id_salle = sal.id
            LEFT JOIN employe e ON i.id_employe = e.id
            WHERE i.id_session = $1
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
