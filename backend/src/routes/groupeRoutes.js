import express from 'express';
import {
    getAllGroupes,
    getGroupeById,
    createGroupe,
    updateGroupe,
    deleteGroupe,
    getGroupesByProfesseur
} from '../controllers/groupeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { createGroupeValidation, updateGroupeValidation } from '../validations/groupeValidation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllGroupes);
router.get('/professeur', getGroupesByProfesseur);
router.get('/:id', getGroupeById);
router.post('/', createGroupeValidation, createGroupe);
router.put('/:id', updateGroupeValidation, updateGroupe);
router.delete('/:id', deleteGroupe);

export default router;