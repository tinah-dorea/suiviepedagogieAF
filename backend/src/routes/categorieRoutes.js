import express from 'express';
import {
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie,
    getCategoriesByTypeCours
} from '../controllers/categorieController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { categorieValidation } from '../validations/categorieValidation.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/categories - Récupérer toutes les catégories
router.get('/', getAllCategories);

// GET /api/categories/:id - Récupérer une catégorie par ID
router.get('/:id', getCategorieById);

// GET /api/categories/type-cours/:typeCoursId - Récupérer les catégories par type de cours
router.get('/type-cours/:typeCoursId', getCategoriesByTypeCours);

// POST /api/categories - Créer une nouvelle catégorie
router.post('/', categorieValidation.create, createCategorie);

// PUT /api/categories/:id - Mettre à jour une catégorie
router.put('/:id', categorieValidation.update, updateCategorie);

// DELETE /api/categories/:id - Supprimer une catégorie
router.delete('/:id', deleteCategorie);

export default router;
