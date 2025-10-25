// src/routes/typeCours.routes.js
import { Router } from 'express';
import {
  getTypeCoursList,
  getTypeCours,
  createTypeCoursCtrl,
  updateTypeCoursCtrl,
  deleteTypeCoursCtrl
} from '../controllers/typeCours.controller.js';

const router = Router();

router.get('/', getTypeCoursList);
router.get('/:id', getTypeCours);
router.post('/', createTypeCoursCtrl);
router.put('/:id', updateTypeCoursCtrl);
router.delete('/:id', deleteTypeCoursCtrl);

export default router;