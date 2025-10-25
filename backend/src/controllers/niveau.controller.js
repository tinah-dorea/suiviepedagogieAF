// src/controllers/niveau.controller.js
import {
  getAllNiveaux,
  getNiveauById,
  createNiveau,
  updateNiveau,
  deleteNiveau
} from '../models/niveau.model.js';

// GET /api/niveaux
export const getNiveaux = async (req, res) => {
  try {
    const niveaux = await getAllNiveaux();
    res.status(200).json(niveaux);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des niveaux' });
  }
};

// GET /api/niveaux/:id
export const getNiveau = async (req, res) => {
  try {
    const { id } = req.params;
    const niveau = await getNiveauById(id);
    if (!niveau) {
      return res.status(404).json({ message: 'Niveau non trouvé' });
    }
    res.status(200).json(niveau);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du niveau' });
  }
};

// POST /api/niveaux
export const createNiveauCtrl = async (req, res) => {
  try {
    const { nom_niveau, sous_niveau } = req.body;

    // Validation de nom_niveau
    if (!nom_niveau || typeof nom_niveau !== 'string' || nom_niveau.trim().length === 0) {
      return res.status(400).json({ message: 'nom_niveau est requis (chaîne non vide)' });
    }
    if (nom_niveau.trim().length > 5) {
      return res.status(400).json({ message: 'nom_niveau ne doit pas dépasser 5 caractères' });
    }

    // Traitement de sous_niveau (sans vérification d'existence)
    let sousNiveauId = null;
    if (sous_niveau !== undefined && sous_niveau !== null) {
      if (!Number.isInteger(Number(sous_niveau))) {
        return res.status(400).json({ message: 'sous_niveau doit être un entier ou null' });
      }
      sousNiveauId = Number(sous_niveau);
    }

    const newNiveau = await createNiveau(nom_niveau.trim(), sousNiveauId);
    res.status(201).json(newNiveau);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce niveau existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du niveau' });
  }
};

// PUT /api/niveaux/:id
export const updateNiveauCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_niveau, sous_niveau } = req.body;

    const existing = await getNiveauById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Niveau non trouvé' });
    }

    if (!nom_niveau || typeof nom_niveau !== 'string' || nom_niveau.trim().length === 0) {
      return res.status(400).json({ message: 'nom_niveau est requis' });
    }
    if (nom_niveau.trim().length > 5) {
      return res.status(400).json({ message: 'nom_niveau ne doit pas dépasser 5 caractères' });
    }

    // Traitement de sous_niveau (sans vérification d'existence)
    let sousNiveauId = null;
    if (sous_niveau !== undefined && sous_niveau !== null) {
      if (!Number.isInteger(Number(sous_niveau))) {
        return res.status(400).json({ message: 'sous_niveau doit être un entier ou null' });
      }
      sousNiveauId = Number(sous_niveau);
    }

    const updated = await updateNiveau(id, nom_niveau.trim(), sousNiveauId);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du niveau' });
  }
};

// DELETE /api/niveaux/:id
export const deleteNiveauCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getNiveauById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Niveau non trouvé' });
    }

    await deleteNiveau(id);
    res.status(200).json({ message: 'Niveau supprimé avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : ce niveau est utilisé ailleurs'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};