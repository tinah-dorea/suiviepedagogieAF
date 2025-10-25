// src/routes/activite.routes.js
import { Router } from 'express';
import {
  getActivites,
  getActivite,
  createActiviteCtrl,
  updateActiviteCtrl,
  deleteActiviteCtrl
} from '../controllers/activite.controller.js';

const router = Router();

router.get('/', getActivites);
router.get('/:id', getActivite);
router.post('/', createActiviteCtrl);
router.put('/:id', updateActiviteCtrl);
router.delete('/:id', deleteActiviteCtrl);

export default router;