import express from 'express';
import {
    getAllCreneaux,
    getCreneauById,
    createCreneau,
    updateCreneau,
    deleteCreneau,
    getCreneauxByHoraireCours
} from '../controllers/creneauController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllCreneaux);
router.get('/horaire/:id_horaire_cours', getCreneauxByHoraireCours);
router.get('/:id', getCreneauById);
router.post('/', createCreneau);
router.put('/:id', updateCreneau);
router.delete('/:id', deleteCreneau);

export default router;