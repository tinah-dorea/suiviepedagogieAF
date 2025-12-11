import express from 'express';
import {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    getSessionsByTypeCours,
    getSessionsActives
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

// GET /api/sessions/:id - Récupérer une session par ID
router.get('/:id', getSessionById);

// GET /api/sessions/type-cours/:typeCoursId - Récupérer les sessions par type de cours
router.get('/type-cours/:typeCoursId', getSessionsByTypeCours);

// POST /api/sessions - Créer une nouvelle session
router.post('/', sessionValidation.create, createSession);

// PUT /api/sessions/:id - Mettre à jour une session
router.put('/:id', sessionValidation.update, updateSession);

// DELETE /api/sessions/:id - Supprimer une session
router.delete('/:id', deleteSession);

export default router;
