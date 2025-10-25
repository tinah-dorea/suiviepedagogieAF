// src/routes/categorie.routes.js
import { Router } from 'express';
import {
  getCategories,
  getCategorie,
  createCategorieCtrl,
  updateCategorieCtrl,
  deleteCategorieCtrl
} from '../controllers/categorie.controller.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategorie);
router.post('/', createCategorieCtrl);
router.put('/:id', updateCategorieCtrl);
router.delete('/:id', deleteCategorieCtrl);

export default router;