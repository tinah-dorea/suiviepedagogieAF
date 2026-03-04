import express from 'express';
import {
    getAllPresences,
    getPresenceById,
    createPresence,
    updatePresence,
    deletePresence,
    getPresencesByGroupe,
    getPresencesByApprenant,
    getPresencesByProfesseur,
    createPresenceBatch
} from '../controllers/presenceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { createPresenceValidation, updatePresenceValidation } from '../validations/presenceValidation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllPresences);
router.get('/:id', getPresenceById);
router.post('/', createPresenceValidation, createPresence);
router.post('/batch', createPresenceBatch);
router.put('/:id', updatePresenceValidation, updatePresence);
router.delete('/:id', deletePresence);
router.get('/groupe/:groupeId', getPresencesByGroupe);
router.get('/apprenant/:apprenantId', getPresencesByApprenant);
router.get('/professeur/:employeId', getPresencesByProfesseur);

export default router;