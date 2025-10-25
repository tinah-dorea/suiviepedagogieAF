// src/controllers/typeCours.controller.js
import {
  getAllTypeCours,
  getTypeCoursById,
  createTypeCours,
  updateTypeCours,
  deleteTypeCours,
  doesTypeServiceExist
} from '../models/typeCours.model.js';

// GET /api/type-cours
export const getTypeCoursList = async (req, res) => {
  try {
    const cours = await getAllTypeCours();
    res.status(200).json(cours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des types de cours' });
  }
};

// GET /api/type-cours/:id
export const getTypeCours = async (req, res) => {
  try {
    const { id } = req.params;
    const cours = await getTypeCoursById(id);
    if (!cours) {
      return res.status(404).json({ message: 'Type de cours non trouvé' });
    }
    res.status(200).json(cours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du type de cours' });
  }
};

// POST /api/type-cours
export const createTypeCoursCtrl = async (req, res) => {
  try {
    const { id_type_service, nom_type_cours } = req.body;

    // Validation
    if (!id_type_service || !Number.isInteger(Number(id_type_service))) {
      return res.status(400).json({ message: 'id_type_service doit être un entier valide' });
    }
    if (!nom_type_cours || typeof nom_type_cours !== 'string' || nom_type_cours.trim().length === 0) {
      return res.status(400).json({ message: 'nom_type_cours est requis' });
    }

    // Vérifier que le type_service existe
    const serviceExists = await doesTypeServiceExist(id_type_service);
    if (!serviceExists) {
      return res.status(400).json({ message: 'Le type_service spécifié n’existe pas' });
    }

    const newCours = await createTypeCours(id_type_service, nom_type_cours.trim());
    res.status(201).json(newCours);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce type de cours existe déjà' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Violation de clé étrangère' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du type de cours' });
  }
};

// PUT /api/type-cours/:id
export const updateTypeCoursCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_type_service, nom_type_cours } = req.body;

    if (!id_type_service || !Number.isInteger(Number(id_type_service))) {
      return res.status(400).json({ message: 'id_type_service doit être un entier valide' });
    }
    if (!nom_type_cours || typeof nom_type_cours !== 'string' || nom_type_cours.trim().length === 0) {
      return res.status(400).json({ message: 'nom_type_cours est requis' });
    }

    const existing = await getTypeCoursById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Type de cours non trouvé' });
    }

    const serviceExists = await doesTypeServiceExist(id_type_service);
    if (!serviceExists) {
      return res.status(400).json({ message: 'Le type_service spécifié n’existe pas' });
    }

    const updated = await updateTypeCours(id, id_type_service, nom_type_cours.trim());
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce nom de cours existe déjà pour ce service' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

// DELETE /api/type-cours/:id
export const deleteTypeCoursCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getTypeCoursById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Type de cours non trouvé' });
    }

    await deleteTypeCours(id);
    res.status(200).json({ message: 'Type de cours supprimé avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : ce type de cours est utilisé par des catégories, horaires ou inscriptions'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};