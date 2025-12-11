import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import {
  getEmployes,
  getRoles,
  createEmploye,
  updateEmploye,
  toggleEmployeStatus,
  deleteEmploye,
  getProfesseurs
} from '../controllers/employeController.js';

const router = express.Router();

// Routes protégées (nécessitent un token)
router.use(authenticateToken);

// Routes employés
router.get('/roles', getRoles);
router.get('/professeurs', getProfesseurs);
router.get('/', getEmployes);
router.post('/', createEmploye);
router.put('/:id', updateEmploye);
router.patch('/:id/status', toggleEmployeStatus);
router.delete('/:id', deleteEmploye);

export default router;