import express from 'express';
import {
    getAllInscriptions,
    getInscriptionById,
    createInscription,
    updateInscription,
    deleteInscription,
    getInscriptionsByTypeCours,
    getInscriptionsBySession,
    getInscriptionsByEmail,
    getInscriptionsByGroupe,
    getInscriptionsBySessionAndGroupe
} from '../controllers/inscriptionController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/inscriptions - Récupérer toutes les inscriptions
router.get('/', getAllInscriptions);

// GET /api/inscriptions/:id - Récupérer une inscription par ID
router.get('/:id', getInscriptionById);

// GET /api/inscriptions/email/:email - Récupérer les inscriptions par email
router.get('/email/:email', getInscriptionsByEmail);

// GET /api/inscriptions/type-cours/:typeCoursId - Récupérer les inscriptions par type de cours
router.get('/type-cours/:typeCoursId', getInscriptionsByTypeCours);

// GET /api/inscriptions/session/:sessionId - Récupérer les inscriptions par session
router.get('/session/:sessionId', getInscriptionsBySession);

// GET /api/inscriptions/groupe/:groupeId - Récupérer les apprenants par groupe
router.get('/groupe/:groupeId', getInscriptionsByGroupe);

// GET /api/inscriptions/session/:sessionId/groupe/:groupeId - Récupérer les inscriptions par session et groupe
router.get('/session/:sessionId/groupe/:groupeId', getInscriptionsBySessionAndGroupe);

// POST /api/inscriptions - Créer une nouvelle inscription
router.post('/', createInscription);

// PUT /api/inscriptions/:id - Mettre à jour une inscription
router.put('/:id', updateInscription);

// DELETE /api/inscriptions/:id - Supprimer une inscription
router.delete('/:id', deleteInscription);

export default router;
