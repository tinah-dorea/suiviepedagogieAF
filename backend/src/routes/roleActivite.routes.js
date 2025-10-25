// src/routes/roleActivite.routes.js
import { Router } from 'express';
import {
  getRoleActivites,
  getRoleActivite,
  createRoleActiviteCtrl,
  updateRoleActiviteCtrl,
  deleteRoleActiviteCtrl
} from '../controllers/roleActivite.controller.js';

const router = Router();

router.get('/', getRoleActivites);
router.get('/:id', getRoleActivite);
router.post('/', createRoleActiviteCtrl);
router.put('/:id', updateRoleActiviteCtrl);
router.delete('/:id', deleteRoleActiviteCtrl);

export default router;