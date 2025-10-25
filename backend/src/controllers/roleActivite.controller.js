// src/controllers/roleActivite.controller.js
import {
  getAllRoleActivites,
  getRoleActiviteById,
  createRoleActivite,
  updateRoleActivite,
  deleteRoleActivite,
  doesRoleExist,
  doesActiviteExist,
  doesPairExist
} from '../models/roleActivite.model.js';

// GET /api/role-activites
export const getRoleActivites = async (req, res) => {
  try {
    const roleActivites = await getAllRoleActivites();
    res.status(200).json(roleActivites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des associations rôle-activité' });
  }
};

// GET /api/role-activites/:id
export const getRoleActivite = async (req, res) => {
  try {
    const { id } = req.params;
    const roleActivite = await getRoleActiviteById(id);
    if (!roleActivite) {
      return res.status(404).json({ message: 'Association rôle-activité non trouvée' });
    }
    res.status(200).json(roleActivite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l’association' });
  }
};

// POST /api/role-activites
export const createRoleActiviteCtrl = async (req, res) => {
  try {
    const { id_role, id_activite } = req.body;

    if (!id_role || !Number.isInteger(Number(id_role))) {
      return res.status(400).json({ message: 'id_role doit être un entier valide' });
    }
    if (!id_activite || !Number.isInteger(Number(id_activite))) {
      return res.status(400).json({ message: 'id_activite doit être un entier valide' });
    }

    const [roleExists, activiteExists] = await Promise.all([
      doesRoleExist(id_role),
      doesActiviteExist(id_activite)
    ]);

    if (!roleExists) return res.status(400).json({ message: 'Rôle introuvable' });
    if (!activiteExists) return res.status(400).json({ message: 'Activité introuvable' });

    const pairExists = await doesPairExist(id_role, id_activite);
    if (pairExists) {
      return res.status(400).json({ message: 'Cette association rôle-activité existe déjà' });
    }

    const newRoleActivite = await createRoleActivite(id_role, id_activite);
    res.status(201).json(newRoleActivite);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Doublon détecté' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Violation de clé étrangère' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l’association' });
  }
};

// PUT /api/role-activites/:id
export const updateRoleActiviteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_role, id_activite } = req.body;

    const existing = await getRoleActiviteById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Association non trouvée' });
    }

    if (!id_role || !Number.isInteger(Number(id_role))) {
      return res.status(400).json({ message: 'id_role doit être un entier valide' });
    }
    if (!id_activite || !Number.isInteger(Number(id_activite))) {
      return res.status(400).json({ message: 'id_activite doit être un entier valide' });
    }

    const [roleExists, activiteExists] = await Promise.all([
      doesRoleExist(id_role),
      doesActiviteExist(id_activite)
    ]);

    if (!roleExists) return res.status(400).json({ message: 'Rôle introuvable' });
    if (!activiteExists) return res.status(400).json({ message: 'Activité introuvable' });

    const pairExists = await doesPairExist(id_role, id_activite);
    if (pairExists && (existing.id_role !== id_role || existing.id_activite !== id_activite)) {
      return res.status(400).json({ message: 'Cette association existe déjà' });
    }

    const updated = await updateRoleActivite(id, id_role, id_activite);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’association' });
  }
};

// DELETE /api/role-activites/:id
export const deleteRoleActiviteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getRoleActiviteById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Association non trouvée' });
    }

    await deleteRoleActivite(id);
    res.status(200).json({ message: 'Association rôle-activité supprimée avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : cette association est utilisée par des employés'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};