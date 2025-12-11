import express from 'express';
import {
    getAllTypeServices,
    getTypeServiceById,
    createTypeService,
    updateTypeService,
    deleteTypeService
} from '../controllers/typeServiceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { typeServiceValidation } from '../validations/typeServiceValidation.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/type-services - Récupérer tous les types de service
router.get('/', getAllTypeServices);

// GET /api/type-services/:id - Récupérer un type de service par ID
router.get('/:id', getTypeServiceById);

// POST /api/type-services - Créer un nouveau type de service
router.post('/', typeServiceValidation.create, createTypeService);

// PUT /api/type-services/:id - Mettre à jour un type de service
router.put('/:id', typeServiceValidation.update, updateTypeService);

// DELETE /api/type-services/:id - Supprimer un type de service
router.delete('/:id', deleteTypeService);

export default router;
