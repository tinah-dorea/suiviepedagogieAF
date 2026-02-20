import express from 'express';
import { 
    getAllHorairesCours, 
    getHoraireCoursById, 
    createHoraireCours, 
    updateHoraireCours, 
    deleteHoraireCours,
    getHorairesCoursBySession
} from '../controllers/horaireController.js';

const router = express.Router();

router.get('/', getAllHorairesCours);
router.get('/session/:id_session', getHorairesCoursBySession); // Nouvelle route
router.get('/:id', getHoraireCoursById);
router.post('/', createHoraireCours);
router.put('/:id', updateHoraireCours);
router.delete('/:id', deleteHoraireCours);

export default router;
