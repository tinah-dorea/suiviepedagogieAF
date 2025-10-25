// src/routes/inscription.routes.js
import { Router } from 'express';
import {
  getInscriptions,
  getInscription,
  createInscriptionCtrl,
  updateInscriptionCtrl,
  deleteInscriptionCtrl
} from '../controllers/inscription.controller.js';

const router = Router();

router.get('/', getInscriptions);
router.get('/:id', getInscription);
router.post('/', createInscriptionCtrl);
router.put('/:id', updateInscriptionCtrl);
router.delete('/:id', deleteInscriptionCtrl);

export default router;