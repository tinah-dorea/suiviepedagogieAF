import express from 'express';
import { getAllTests, getTestById, createTest, updateTest, deleteTest } from '../controllers/testNiveauController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllTests);
router.get('/:id', getTestById);
router.post('/', createTest);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

export default router;
