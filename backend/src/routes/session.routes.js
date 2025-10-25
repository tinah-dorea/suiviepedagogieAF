// src/routes/session.routes.js
import { Router } from 'express';
import {
  getSessions,
  getSession,
  createSessionCtrl,
  updateSessionCtrl,
  deleteSessionCtrl
} from '../controllers/session.controller.js';

const router = Router();

router.get('/', getSessions);
router.get('/:id', getSession);
router.post('/', createSessionCtrl);
router.put('/:id', updateSessionCtrl);
router.delete('/:id', deleteSessionCtrl);

export default router;