// src/controllers/employe.controller.js
import {
  getAllEmployes,
  getEmployeById,
  createEmploye,
  updateEmploye,
  deleteEmploye,
  doesRoleActiviteExist
} from '../models/employe.model.js';

// GET /api/employes
export const getEmployes = async (req, res) => {
  try {
    const employes = await getAllEmployes();
    res.status(200).json(employes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des employés' });
  }
};

// GET /api/employes/:id
export const getEmploye = async (req, res) => {
  try {
    const { id } = req.params;
    const employe = await getEmployeById(id);
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.status(200).json(employe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l’employé' });
  }
};

// POST /api/employes
export const createEmployeCtrl = async (req, res) => {
  try {
    const {
      service,
      fonction,
      nom,
      prenom,
      age,
      adresse,
      tel,
      mot_passe,
      id_role_activite
    } = req.body;

    // Validation des champs obligatoires
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      return res.status(400).json({ message: 'nom est requis' });
    }
    if (!prenom || typeof prenom !== 'string' || prenom.trim().length === 0) {
      return res.status(400).json({ message: 'prenom est requis' });
    }
    if (!mot_passe || typeof mot_passe !== 'string' || mot_passe.length < 6) {
      return res.status(400).json({ message: 'mot_passe est requis (min 6 caractères)' });
    }

    // Validation de id_role_activite (obligatoire selon votre schéma)
    if (!id_role_activite || !Number.isInteger(Number(id_role_activite))) {
      return res.status(400).json({ message: 'id_role_activite doit être un entier valide' });
    }

    const roleActiviteExists = await doesRoleActiviteExist(id_role_activite);
    if (!roleActiviteExists) {
      return res.status(400).json({ message: 'L’association role_activite spécifiée n’existe pas' });
    }

    // Validation de l’âge (optionnel mais logique)
    if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 120)) {
      return res.status(400).json({ message: 'age doit être un nombre entre 0 et 120' });
    }

    const newEmploye = await createEmploye({
      service,
      fonction,
      nom: nom.trim(),
      prenom: prenom.trim(),
      age,
      adresse,
      tel,
      mot_passe,
      id_role_activite
    });

    // Ne pas renvoyer le mot de passe dans la réponse
    const { mot_passe: _, ...safeEmploye } = newEmploye;
    res.status(201).json(safeEmploye);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Violation de clé étrangère (role_activite)' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l’employé' });
  }
};

// PUT /api/employes/:id
export const updateEmployeCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getEmployeById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    const {
      service,
      fonction,
      nom,
      prenom,
      age,
      adresse,
      tel,
      mot_passe,
      id_role_activite
    } = req.body;

    if (nom !== undefined && (typeof nom !== 'string' || nom.trim().length === 0)) {
      return res.status(400).json({ message: 'nom est requis' });
    }
    if (prenom !== undefined && (typeof prenom !== 'string' || prenom.trim().length === 0)) {
      return res.status(400).json({ message: 'prenom est requis' });
    }
    if (mot_passe !== undefined && (typeof mot_passe !== 'string' || mot_passe.length < 6)) {
      return res.status(400).json({ message: 'mot_passe doit avoir au moins 6 caractères' });
    }

    if (id_role_activite !== undefined) {
      if (!Number.isInteger(Number(id_role_activite))) {
        return res.status(400).json({ message: 'id_role_activite doit être un entier valide' });
      }
      const exists = await doesRoleActiviteExist(id_role_activite);
      if (!exists) {
        return res.status(400).json({ message: 'L’association role_activite n’existe pas' });
      }
    }

    if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 120)) {
      return res.status(400).json({ message: 'age doit être un nombre entre 0 et 120' });
    }

    const updated = await updateEmploye(id, {
      service,
      fonction,
      nom: nom?.trim(),
      prenom: prenom?.trim(),
      age,
      adresse,
      tel,
      mot_passe,
      id_role_activite
    });

    const { mot_passe: _, ...safeUpdated } = updated;
    res.status(200).json(safeUpdated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’employé' });
  }
};

// DELETE /api/employes/:id
export const deleteEmployeCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getEmployeById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    await deleteEmploye(id);
    res.status(200).json({ message: 'Employé supprimé avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : cet employé est utilisé par des inscriptions ou des tests'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};