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

// GET /api/type-services - Récupérer tous les types de service (PUBLIC - sans authentification)
router.get('/', getAllTypeServices);

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/type-services/:id - Récupérer un type de service par ID
router.get('/:id', getTypeServiceById);

// POST /api/type-services - Créer un nouveau type de service (validation disabled for testing)
router.post('/', createTypeService);

// PUT /api/type-services/:id - Mettre à jour un type de service (validation disabled for testing)
router.put('/:id', updateTypeService);

// DELETE /api/type-services/:id - Supprimer un type de service
router.delete('/:id', deleteTypeService);

export default router;
