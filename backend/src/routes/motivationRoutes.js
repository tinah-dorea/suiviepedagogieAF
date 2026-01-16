import express from 'express';
import { getAllMotivations, getMotivationById, createMotivation, updateMotivation, deleteMotivation } from '../controllers/motivationController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllMotivations);
router.get('/:id', getMotivationById);
router.post('/', createMotivation);
router.put('/:id', updateMotivation);
router.delete('/:id', deleteMotivation);

export default router;
