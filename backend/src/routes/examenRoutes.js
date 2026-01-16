import express from 'express';
import {
    getAllExamens,
    getExamenById,
    createExamen,
    updateExamen,
    deleteExamen
} from '../controllers/examenController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { createExamenValidation, updateExamenValidation } from '../validations/examenValidation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllExamens);
router.get('/:id', getExamenById);
router.post('/', createExamenValidation, createExamen);
router.put('/:id', updateExamenValidation, updateExamen);
router.delete('/:id', deleteExamen);

export default router;
