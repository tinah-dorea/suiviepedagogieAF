import express from 'express';
import {
    getAllHorairesCours,
    getHoraireCoursById,
    createHoraireCours,
    updateHoraireCours,
    deleteHoraireCours,
    getHorairesCoursByTypeCours
} from '../controllers/horaireController.js';

const router = express.Router();

router.get('/', getAllHorairesCours);
router.get('/type-cours/:typeCoursId', getHorairesCoursByTypeCours);
router.get('/:id', getHoraireCoursById);
router.post('/', createHoraireCours);
router.put('/:id', updateHoraireCours);
router.delete('/:id', deleteHoraireCours);

export default router;
