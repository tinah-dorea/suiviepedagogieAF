import express from 'express';
import {
    getAllInscriptions,
    getInscriptionById,
    createInscription,
    updateInscription,
    deleteInscription,
    getInscriptionsByTypeCours,
    getInscriptionsBySession
} from '../controllers/inscriptionController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/inscriptions - Récupérer toutes les inscriptions
router.get('/', getAllInscriptions);

// GET /api/inscriptions/:id - Récupérer une inscription par ID
router.get('/:id', getInscriptionById);

// GET /api/inscriptions/type-cours/:typeCoursId - Récupérer les inscriptions par type de cours
router.get('/type-cours/:typeCoursId', getInscriptionsByTypeCours);

// GET /api/inscriptions/session/:sessionId - Récupérer les inscriptions par session
router.get('/session/:sessionId', getInscriptionsBySession);

// POST /api/inscriptions - Créer une nouvelle inscription
router.post('/', createInscription);

// PUT /api/inscriptions/:id - Mettre à jour une inscription
router.put('/:id', updateInscription);

// DELETE /api/inscriptions/:id - Supprimer une inscription
router.delete('/:id', deleteInscription);

export default router;
