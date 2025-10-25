import { Router } from 'express';
import {
  getTypeServices,
  getTypeService,
  createTypeServiceCtrl,
  updateTypeServiceCtrl,
  deleteTypeServiceCtrl
} from '../controllers/typeService.controller.js';

const router = Router();

router.get('/', getTypeServices);
router.get('/:id', getTypeService);
router.post('/', createTypeServiceCtrl);
router.put('/:id', updateTypeServiceCtrl);
router.delete('/:id', deleteTypeServiceCtrl);

export default router;