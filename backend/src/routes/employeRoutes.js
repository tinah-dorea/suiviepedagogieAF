import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  getEmployes,
  getRoles,
  createEmploye,
  updateEmploye,
  toggleEmployeStatus,
  deleteEmploye,
  getProfesseurs
} from '../controllers/employeController.js';
import { createEmployeValidation, updateEmployeValidation } from '../validations/employeValidation.js';

const router = express.Router();

// Routes protégées (nécessitent un token)
router.use(authenticateToken);

// Routes employés
router.get('/roles', getRoles);
router.get('/professeurs', getProfesseurs);
router.get('/', getEmployes);
router.post('/', createEmployeValidation, validateRequest, createEmploye);
router.put('/:id', updateEmployeValidation, validateRequest, updateEmploye);
router.patch('/:id/status', toggleEmployeStatus);
router.delete('/:id', deleteEmploye);

export default router;