import express from 'express';
import {
    getAllTypeCours,
    getTypeCoursById,
    createTypeCours,
    updateTypeCours,
    deleteTypeCours,
    getTypeCoursByService
} from '../controllers/typeCoursController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { typeCoursValidation } from '../validations/typeCoursValidation.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/type-cours - Récupérer tous les types de cours
router.get('/', getAllTypeCours);

// GET /api/type-cours/:id - Récupérer un type de cours par ID
router.get('/:id', getTypeCoursById);

// GET /api/type-cours/service/:serviceId - Récupérer les types de cours par service
router.get('/service/:serviceId', getTypeCoursByService);

// POST /api/type-cours - Créer un nouveau type de cours
router.post('/', typeCoursValidation.create, createTypeCours);

// PUT /api/type-cours/:id - Mettre à jour un type de cours
router.put('/:id', typeCoursValidation.update, updateTypeCours);

// DELETE /api/type-cours/:id - Supprimer un type de cours
router.delete('/:id', deleteTypeCours);

export default router;
