// src/controllers/activite.controller.js
import {
  getAllActivites,
  getActiviteById,
  createActivite,
  updateActivite,
  deleteActivite
} from '../models/activite.model.js';

// GET /api/activites
export const getActivites = async (req, res) => {
  try {
    const activites = await getAllActivites();
    res.status(200).json(activites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des activités' });
  }
};

// GET /api/activites/:id
export const getActivite = async (req, res) => {
  try {
    const { id } = req.params;
    const activite = await getActiviteById(id);
    if (!activite) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    res.status(200).json(activite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l’activité' });
  }
};

// POST /api/activites
export const createActiviteCtrl = async (req, res) => {
  try {
    const { nom_activite } = req.body;

    if (!nom_activite || typeof nom_activite !== 'string' || nom_activite.trim().length === 0) {
      return res.status(400).json({ message: 'Le champ "nom_activite" est requis et doit être une chaîne non vide' });
    }

    const newActivite = await createActivite(nom_activite.trim());
    res.status(201).json(newActivite);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Cette activité existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l’activité' });
  }
};

// PUT /api/activites/:id
export const updateActiviteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_activite } = req.body;

    if (!nom_activite || typeof nom_activite !== 'string' || nom_activite.trim().length === 0) {
      return res.status(400).json({ message: 'Le champ "nom_activite" est requis' });
    }

    const existing = await getActiviteById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }

    const updated = await updateActivite(id, nom_activite.trim());
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce nom d’activité existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

// DELETE /api/activites/:id
export const deleteActiviteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getActiviteById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }

    await deleteActivite(id);
    res.status(200).json({ message: 'Activité supprimée avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : cette activité est utilisée dans des associations role_activite'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};