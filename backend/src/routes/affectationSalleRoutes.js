import express from 'express';
import {
    getAllAffectations,
    getAffectationById,
    createAffectation,
    updateAffectation,
    deleteAffectation
} from '../controllers/affectationSalleController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { createAffectationSalleValidation, updateAffectationSalleValidation } from '../validations/affectationSalleValidation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllAffectations);
router.get('/:id', getAffectationById);
router.post('/', createAffectationSalleValidation, createAffectation);
router.put('/:id', updateAffectationSalleValidation, updateAffectation);
router.delete('/:id', deleteAffectation);

export default router;