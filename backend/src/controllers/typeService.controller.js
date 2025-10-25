// src/controllers/typeService.controller.js
import {
  getAllTypeServices,
  getTypeServiceById,
  createTypeService,
  updateTypeService,
  deleteTypeService
} from '../models/typeService.model.js';

// GET /api/type-services
export const getTypeServices = async (req, res) => {
  try {
    const services = await getAllTypeServices();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des types de service' });
  }
};

// GET /api/type-services/:id
export const getTypeService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await getTypeServiceById(id);
    if (!service) {
      return res.status(404).json({ message: 'Type de service non trouvé' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du type de service' });
  }
};

// POST /api/type-services
export const createTypeServiceCtrl = async (req, res) => {
  try {
    const { nom_service } = req.body;

    if (!nom_service || typeof nom_service !== 'string' || nom_service.trim().length === 0) {
      return res.status(400).json({ message: 'Le champ "nom_service" est requis et doit être une chaîne non vide' });
    }

    const newService = await createTypeService(nom_service.trim());
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce type de service existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du type de service' });
  }
};

// PUT /api/type-services/:id
export const updateTypeServiceCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_service } = req.body;

    if (!nom_service || typeof nom_service !== 'string' || nom_service.trim().length === 0) {
      return res.status(400).json({ message: 'Le champ "nom_service" est requis' });
    }

    const existing = await getTypeServiceById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Type de service non trouvé' });
    }

    const updated = await updateTypeService(id, nom_service.trim());
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce nom de service existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

// DELETE /api/type-services/:id
export const deleteTypeServiceCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getTypeServiceById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Type de service non trouvé' });
    }

    await deleteTypeService(id);
    res.status(200).json({ message: 'Type de service supprimé avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : ce type de service est utilisé par des cours'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};