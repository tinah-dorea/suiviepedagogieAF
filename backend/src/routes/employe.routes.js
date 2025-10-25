// src/routes/employe.routes.js
import { Router } from 'express';
import {
  getEmployes,
  getEmploye,
  createEmployeCtrl,
  updateEmployeCtrl,
  deleteEmployeCtrl
} from '../controllers/employe.controller.js';

const router = Router();

router.get('/', getEmployes);
router.get('/:id', getEmploye);
router.post('/', createEmployeCtrl);
router.put('/:id', updateEmployeCtrl);
router.delete('/:id', deleteEmployeCtrl);

export default router;