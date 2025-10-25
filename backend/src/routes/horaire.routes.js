// src/routes/horaire.routes.js
import { Router } from 'express';
import {
  getHoraires,
  getHoraire,
  createHoraireCtrl,
  updateHoraireCtrl,
  deleteHoraireCtrl
} from '../controllers/horaire.controller.js';

const router = Router();

router.get('/', getHoraires);
router.get('/:id', getHoraire);
router.post('/', createHoraireCtrl);
router.put('/:id', updateHoraireCtrl);
router.delete('/:id', deleteHoraireCtrl);

export default router;