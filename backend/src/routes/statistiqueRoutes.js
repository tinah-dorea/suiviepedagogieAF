import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getStatistiquesAdmin, getStatistiquesPedagogiques, getStatistiquesProfesseur } from '../controllers/statistiqueController.js';

const router = express.Router();

// Routes protégées (nécessitent un token)
router.use(authenticateToken);

// Route pour récupérer les statistiques pédagogiques
router.get('/pedagogiques', getStatistiquesPedagogiques);

// Route pour récupérer les statistiques professeur
router.get('/professeur', getStatistiquesProfesseur);

// Route pour récupérer les statistiques admin
router.get('/admin', getStatistiquesAdmin);

export default router;