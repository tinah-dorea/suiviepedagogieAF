import express from 'express';
import {
    getAllSessionCours,
    getSessionCoursById,
    createSessionCours,
    updateSessionCours,
    deleteSessionCours
} from '../controllers/sessionCoursController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllSessionCours);
router.get('/:id', getSessionCoursById);
router.post('/', createSessionCours);
router.put('/:id', updateSessionCours);
router.delete('/:id', deleteSessionCours);

export default router;
