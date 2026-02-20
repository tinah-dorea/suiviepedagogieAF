import express from 'express';
import { 
    getAllCreneaux, 
    getCreneauById, 
    createCreneau, 
    updateCreneau, 
    deleteCreneau,
    getCreneauxByHoraireCours 
} from '../controllers/creneauController.js';
import { 
    createCreneauValidation, 
    updateCreneauValidation 
} from '../validations/creneauValidation.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllCreneaux);
router.get('/horaire/:id_horaire_cours', getCreneauxByHoraireCours); // Nouvelle route
router.get('/:id', getCreneauById);
router.post('/', createCreneauValidation, createCreneau);
router.put('/:id', updateCreneauValidation, updateCreneau);
router.delete('/:id', deleteCreneau);

export default router;