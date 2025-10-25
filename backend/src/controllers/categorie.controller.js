// src/controllers/categorie.controller.js
import {
  getAllCategories,
  getCategorieById,
  createCategorie,
  updateCategorie,
  deleteCategorie,
  doesTypeCoursExist
} from '../models/categorie.model.js';

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
  }
};

// GET /api/categories/:id
export const getCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const categorie = await getCategorieById(id);
    if (!categorie) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.status(200).json(categorie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie' });
  }
};

// POST /api/categories
export const createCategorieCtrl = async (req, res) => {
  try {
    const { nom_categorie, id_type_cours, min_age, max_age } = req.body;

    // Validation
    if (!nom_categorie || typeof nom_categorie !== 'string' || nom_categorie.trim().length === 0) {
      return res.status(400).json({ message: 'nom_categorie est requis (max 10 caractères)' });
    }
    if (nom_categorie.trim().length > 10) {
      return res.status(400).json({ message: 'nom_categorie ne doit pas dépasser 10 caractères' });
    }

    if (!id_type_cours || !Number.isInteger(Number(id_type_cours))) {
      return res.status(400).json({ message: 'id_type_cours doit être un entier valide' });
    }

    const typeCoursExists = await doesTypeCoursExist(id_type_cours);
    if (!typeCoursExists) {
      return res.status(400).json({ message: 'Le type_cours spécifié n’existe pas' });
    }

    let minAge = null, maxAge = null;
    if (min_age !== undefined && min_age !== null) {
      if (!Number.isInteger(Number(min_age))) {
        return res.status(400).json({ message: 'min_age doit être un entier' });
      }
      minAge = Number(min_age);
    }
    if (max_age !== undefined && max_age !== null) {
      if (!Number.isInteger(Number(max_age))) {
        return res.status(400).json({ message: 'max_age doit être un entier' });
      }
      maxAge = Number(max_age);
    }

    if (minAge !== null && maxAge !== null && minAge > maxAge) {
      return res.status(400).json({ message: 'min_age ne peut pas être supérieur à max_age' });
    }

    const newCategorie = await createCategorie(nom_categorie.trim(), id_type_cours, minAge, maxAge);
    res.status(201).json(newCategorie);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Cette catégorie existe déjà' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Violation de clé étrangère' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
  }
};

// PUT /api/categories/:id
export const updateCategorieCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_categorie, id_type_cours, min_age, max_age } = req.body;

    const existing = await getCategorieById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    if (!nom_categorie || typeof nom_categorie !== 'string' || nom_categorie.trim().length === 0) {
      return res.status(400).json({ message: 'nom_categorie est requis' });
    }
    if (nom_categorie.trim().length > 10) {
      return res.status(400).json({ message: 'nom_categorie ne doit pas dépasser 10 caractères' });
    }

    if (!id_type_cours || !Number.isInteger(Number(id_type_cours))) {
      return res.status(400).json({ message: 'id_type_cours doit être un entier valide' });
    }

    const typeCoursExists = await doesTypeCoursExist(id_type_cours);
    if (!typeCoursExists) {
      return res.status(400).json({ message: 'Le type_cours spécifié n’existe pas' });
    }

    let minAge = null, maxAge = null;
    if (min_age !== undefined && min_age !== null) {
      if (!Number.isInteger(Number(min_age))) {
        return res.status(400).json({ message: 'min_age doit être un entier' });
      }
      minAge = Number(min_age);
    }
    if (max_age !== undefined && max_age !== null) {
      if (!Number.isInteger(Number(max_age))) {
        return res.status(400).json({ message: 'max_age doit être un entier' });
      }
      maxAge = Number(max_age);
    }

    if (minAge !== null && maxAge !== null && minAge > maxAge) {
      return res.status(400).json({ message: 'min_age ne peut pas être supérieur à max_age' });
    }

    const updated = await updateCategorie(id, nom_categorie.trim(), id_type_cours, minAge, maxAge);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie' });
  }
};

// DELETE /api/categories/:id
export const deleteCategorieCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getCategorieById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    await deleteCategorie(id);
    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : cette catégorie est utilisée par des horaires ou inscriptions'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};