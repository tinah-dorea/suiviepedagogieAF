// src/controllers/inscription.controller.js
import {
  getAllInscriptions,
  getInscriptionById,
  createInscription,
  updateInscription,
  deleteInscription,
  doesEntityExist
} from '../models/inscription.model.js';

// Utilitaire de validation de date
const isValidDate = (dateStr) => {
  if (!dateStr) return true;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 10) === dateStr;
};

// GET /api/inscriptions
export const getInscriptions = async (req, res) => {
  try {
    const inscriptions = await getAllInscriptions();
    res.status(200).json(inscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des inscriptions' });
  }
};

// GET /api/inscriptions/:id
export const getInscription = async (req, res) => {
  try {
    const { id } = req.params;
    const inscription = await getInscriptionById(id);
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }
    res.status(200).json(inscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l’inscription' });
  }
};

// POST /api/inscriptions
export const createInscriptionCtrl = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Validation des clés étrangères obligatoires
    const requiredRefs = {
      id_type_cours,
      id_employe,
      id_session,
      id_horaire,
      id_niveau,
      id_motivation,
      id_salle
    };

    for (const [key, value] of Object.entries(requiredRefs)) {
      if (!value || !Number.isInteger(Number(value))) {
        return res.status(400).json({ message: `${key} doit être un entier valide` });
      }
    }

    // Validation des dates
    if (date_n && !isValidDate(date_n)) {
      return res.status(400).json({ message: 'date_n doit être au format YYYY-MM-DD' });
    }

    // Vérification des entités liées
    const checks = await Promise.all([
      doesEntityExist('type_cours', id_type_cours),
      doesEntityExist('employe', id_employe),
      doesEntityExist('session', id_session),
      doesEntityExist('horaire', id_horaire),
      doesEntityExist('niveau', id_niveau),
      doesEntityExist('motivation', id_motivation),
      doesEntityExist('salle', id_salle)
    ]);

    const refNames = ['type_cours', 'employe', 'session', 'horaire', 'niveau', 'motivation', 'salle'];
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i]) {
        return res.status(400).json({ message: `${refNames[i]} introuvable` });
      }
    }

    const newInscription = await createInscription(req.body);
    res.status(201).json(newInscription);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Violation de clé étrangère' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l’inscription' });
  }
};

// PUT /api/inscriptions/:id
export const updateInscriptionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getInscriptionById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }

    const {
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
    } = req.body;

    const requiredRefs = {
      id_type_cours,
      id_employe,
      id_session,
      id_horaire,
      id_niveau,
      id_motivation,
      id_salle
    };

    for (const [key, value] of Object.entries(requiredRefs)) {
      if (!value || !Number.isInteger(Number(value))) {
        return res.status(400).json({ message: `${key} doit être un entier valide` });
      }
    }

    if (date_n && !isValidDate(date_n)) {
      return res.status(400).json({ message: 'date_n doit être au format YYYY-MM-DD' });
    }

    const checks = await Promise.all([
      doesEntityExist('type_cours', id_type_cours),
      doesEntityExist('employe', id_employe),
      doesEntityExist('session', id_session),
      doesEntityExist('horaire', id_horaire),
      doesEntityExist('niveau', id_niveau),
      doesEntityExist('motivation', id_motivation),
      doesEntityExist('salle', id_salle)
    ]);

    const refNames = ['type_cours', 'employe', 'session', 'horaire', 'niveau', 'motivation', 'salle'];
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i]) {
        return res.status(400).json({ message: `${refNames[i]} introuvable` });
      }
    }

    const updated = await updateInscription(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’inscription' });
  }
};

// DELETE /api/inscriptions/:id
export const deleteInscriptionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getInscriptionById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }

    await deleteInscription(id);
    res.status(200).json({ message: 'Inscription supprimée avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : cette inscription est utilisée par des examens'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};