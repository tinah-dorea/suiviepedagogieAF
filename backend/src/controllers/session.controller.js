// src/controllers/session.controller.js
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  doesTypeCoursExist
} from '../models/session.model.js';

// Utilitaire pour valider une date au format YYYY-MM-DD
const isValidDate = (dateStr) => {
  if (!dateStr) return true; // null/undefined autorisé
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 10) === dateStr;
};

// GET /api/sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await getAllSessions();
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des sessions' });
  }
};

// GET /api/sessions/:id
export const getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await getSessionById(id);
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la session' });
  }
};

// POST /api/sessions
export const createSessionCtrl = async (req, res) => {
  try {
    const { mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam } = req.body;

    // Validation de id_type_cours
    if (!id_type_cours || !Number.isInteger(Number(id_type_cours))) {
      return res.status(400).json({ message: 'id_type_cours doit être un entier valide' });
    }

    // Validation des dates
    const dates = { date_fin_inscription, date_debut, date_fin, date_exam };
    for (const [key, value] of Object.entries(dates)) {
      if (value !== undefined && value !== null && !isValidDate(value)) {
        return res.status(400).json({ message: `${key} doit être au format YYYY-MM-DD ou null` });
      }
    }

    // Validation de l'année
    if (annee !== undefined && annee !== null) {
      if (!Number.isInteger(Number(annee)) || annee < 1900 || annee > 2100) {
        return res.status(400).json({ message: 'annee doit être un entier entre 1900 et 2100' });
      }
    }

    // Vérification du type_cours
    const typeCoursExists = await doesTypeCoursExist(id_type_cours);
    if (!typeCoursExists) {
      return res.status(400).json({ message: 'Le type_cours spécifié n’existe pas' });
    }

    const newSession = await createSession(
      mois || null,
      annee || null,
      id_type_cours,
      date_fin_inscription || null,
      date_debut || null,
      date_fin || null,
      date_exam || null
    );

    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Cette session existe déjà' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Violation de clé étrangère' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de la session' });
  }
};

// PUT /api/sessions/:id
export const updateSessionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { mois, annee, id_type_cours, date_fin_inscription, date_debut, date_fin, date_exam } = req.body;

    const existing = await getSessionById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    if (!id_type_cours || !Number.isInteger(Number(id_type_cours))) {
      return res.status(400).json({ message: 'id_type_cours doit être un entier valide' });
    }

    const dates = { date_fin_inscription, date_debut, date_fin, date_exam };
    for (const [key, value] of Object.entries(dates)) {
      if (value !== undefined && value !== null && !isValidDate(value)) {
        return res.status(400).json({ message: `${key} doit être au format YYYY-MM-DD ou null` });
      }
    }

    if (annee !== undefined && annee !== null) {
      if (!Number.isInteger(Number(annee)) || annee < 1900 || annee > 2100) {
        return res.status(400).json({ message: 'annee doit être un entier entre 1900 et 2100' });
      }
    }

    const typeCoursExists = await doesTypeCoursExist(id_type_cours);
    if (!typeCoursExists) {
      return res.status(400).json({ message: 'Le type_cours spécifié n’existe pas' });
    }

    const updated = await updateSession(
      id,
      mois || null,
      annee || null,
      id_type_cours,
      date_fin_inscription || null,
      date_debut || null,
      date_fin || null,
      date_exam || null
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la session' });
  }
};

// DELETE /api/sessions/:id
export const deleteSessionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getSessionById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    await deleteSession(id);
    res.status(200).json({ message: 'Session supprimée avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : cette session est utilisée par des inscriptions'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};