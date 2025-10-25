// src/routes/role.routes.js
import { Router } from 'express';
import {
  getRoles,
  getRole,
  createRoleCtrl,
  updateRoleCtrl,
  deleteRoleCtrl
} from '../controllers/role.controller.js';

const router = Router();

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', createRoleCtrl);
router.put('/:id', updateRoleCtrl);
router.delete('/:id', deleteRoleCtrl);

export default router;