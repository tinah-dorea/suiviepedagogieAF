// src/routes/niveau.routes.js
import { Router } from 'express';
import {
  getNiveaux,
  getNiveau,
  createNiveauCtrl,
  updateNiveauCtrl,
  deleteNiveauCtrl
} from '../controllers/niveau.controller.js';

const router = Router();

router.get('/', getNiveaux);
router.get('/:id', getNiveau);
router.post('/', createNiveauCtrl);
router.put('/:id', updateNiveauCtrl);
router.delete('/:id', deleteNiveauCtrl);

export default router;