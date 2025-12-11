import express from 'express';
import {
    getAllExamens,
    getExamenById,
    createExamen,
    updateExamen,
    deleteExamen,
    getExamensByInscription,
    getExamensBySession
} from '../controllers/examenController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/examens - Récupérer tous les examens
router.get('/', getAllExamens);

// GET /api/examens/:id - Récupérer un examen par ID
router.get('/:id', getExamenById);

// GET /api/examens/inscription/:inscriptionId - Récupérer les examens par inscription
router.get('/inscription/:inscriptionId', getExamensByInscription);

// GET /api/examens/session/:sessionId - Récupérer les examens par session
router.get('/session/:sessionId', getExamensBySession);

// POST /api/examens - Créer un nouvel examen
router.post('/', createExamen);

// PUT /api/examens/:id - Mettre à jour un examen
router.put('/:id', updateExamen);

// DELETE /api/examens/:id - Supprimer un examen
router.delete('/:id', deleteExamen);

export default router;
