import express from 'express';
import {
    getAllSalles,
    getSalleById,
    createSalle,
    updateSalle,
    deleteSalle,
    getSallesDisponibles,
    getSallesStats
} from '../controllers/salleController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/salles - Récupérer toutes les salles
router.get('/', getAllSalles);

// GET /api/salles/:id - Récupérer une salle par ID
router.get('/:id', getSalleById);

// GET /api/salles/disponibles - Récupérer les salles disponibles
router.get('/disponibles', getSallesDisponibles);

// GET /api/salles/stats - Récupérer les statistiques des salles
router.get('/stats', getSallesStats);

// POST /api/salles - Créer une nouvelle salle
router.post('/', createSalle);

// PUT /api/salles/:id - Mettre à jour une salle
router.put('/:id', updateSalle);

// DELETE /api/salles/:id - Supprimer une salle
router.delete('/:id', deleteSalle);

export default router;
