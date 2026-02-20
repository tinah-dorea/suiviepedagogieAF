import express from 'express';
import { 
    getAllCategories, 
    getCategorieById, 
    createCategorie, 
    updateCategorie, 
    deleteCategorie
} from '../controllers/categorieController.js';
import { 
    createCategorieValidation, 
    updateCategorieValidation 
} from '../validations/categorieValidation.js';

const router = express.Router();

// GET /api/categories - Récupérer toutes les catégories
router.get('/', getAllCategories);

// GET /api/categories/:id - Récupérer une catégorie par ID
router.get('/:id', getCategorieById);

// POST /api/categories - Créer une nouvelle catégorie
router.post('/', createCategorieValidation, createCategorie);

// PUT /api/categories/:id - Mettre à jour une catégorie
router.put('/:id', updateCategorieValidation, updateCategorie);

// DELETE /api/categories/:id - Supprimer une catégorie
router.delete('/:id', deleteCategorie);

export default router;
