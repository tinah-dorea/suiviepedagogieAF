// src/controllers/role.controller.js
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from '../models/role.model.js';

// GET /api/roles
export const getRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des rôles' });
  }
};

// GET /api/roles/:id
export const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);
    if (!role) {
      return res.status(404).json({ message: 'Rôle non trouvé' });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du rôle' });
  }
};

// POST /api/roles
export const createRoleCtrl = async (req, res) => {
  try {
    const { nom_role } = req.body;

    if (!nom_role || typeof nom_role !== 'string' || nom_role.trim().length === 0) {
      return res.status(400).json({ message: 'Le champ "nom_role" est requis et doit être une chaîne non vide' });
    }

    const newRole = await createRole(nom_role.trim());
    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce rôle existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du rôle' });
  }
};

// PUT /api/roles/:id
export const updateRoleCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_role } = req.body;

    if (!nom_role || typeof nom_role !== 'string' || nom_role.trim().length === 0) {
      return res.status(400).json({ message: 'Le champ "nom_role" est requis' });
    }

    const existing = await getRoleById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Rôle non trouvé' });
    }

    const updated = await updateRole(id, nom_role.trim());
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ce nom de rôle existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

// DELETE /api/roles/:id
export const deleteRoleCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getRoleById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Rôle non trouvé' });
    }

    await deleteRole(id);
    res.status(200).json({ message: 'Rôle supprimé avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : ce rôle est utilisé par des employés ou des associations role_activite'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};