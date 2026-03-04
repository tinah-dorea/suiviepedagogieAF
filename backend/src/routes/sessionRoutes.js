import express from 'express';
import {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    getSessionsByTypeCours,
    getSessionsActives,
    getSessionsByProfesseur
} from '../controllers/sessionController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { sessionValidation } from '../validations/sessionValidation.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/sessions - Récupérer toutes les sessions
router.get('/', getAllSessions);

// GET /api/sessions/actives - Récupérer les sessions actives
router.get('/actives', getSessionsActives);

// GET /api/sessions/professeur - Récupérer les sessions d'un professeur (DOIT ÊTRE AVANT /:id)
router.get('/professeur', getSessionsByProfesseur);

// GET /api/sessions/type-cours/:typeCoursId - Récupérer les sessions par type de cours
router.get('/type-cours/:typeCoursId', getSessionsByTypeCours);

// GET /api/sessions/:id - Récupérer une session par ID
router.get('/:id', getSessionById);

// POST /api/sessions - Créer une nouvelle session (validation disabled for testing)
router.post('/', createSession);

// PUT /api/sessions/:id - Mettre à jour une session (validation disabled for testing)
router.put('/:id', updateSession);

// DELETE /api/sessions/:id - Supprimer une session
router.delete('/:id', deleteSession);

export default router;
