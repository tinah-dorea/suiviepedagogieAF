import express from 'express';
import {
    getAllHoraires,
    getHoraireById,
    createHoraire,
    updateHoraire,
    deleteHoraire,
    getHorairesByTypeCours
} from '../controllers/horaireController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { createCreneauValidation, updateCreneauValidation } from '../validations/creneauValidation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllHoraires);
router.get('/:id', getHoraireById);
router.get('/by-type-cours/:typeCoursId', getHorairesByTypeCours);
router.post('/', createCreneauValidation, createHoraire);
router.put('/:id', updateCreneauValidation, updateHoraire);
router.delete('/:id', deleteHoraire);

export default router;
