import express from 'express';
import { 
    getAllJoursFeries, 
    getJourFerieById, 
    createJourFerie, 
    updateJourFerie, 
    deleteJourFerie,
    getJoursFeriesByAnnee
} from '../controllers/joursFeriesController.js';

const router = express.Router();

router.get('/', getAllJoursFeries);
router.get('/annee/:annee', getJoursFeriesByAnnee); // Route pour obtenir les jours fériés par année
router.get('/:id', getJourFerieById);
router.post('/', createJourFerie);
router.put('/:id', updateJourFerie);
router.delete('/:id', deleteJourFerie);

export default router;