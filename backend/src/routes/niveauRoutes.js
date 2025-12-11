import express from 'express';
import {
    getAllNiveaux,
    getNiveauById,
    createNiveau,
    updateNiveau,
    deleteNiveau
} from '../controllers/niveauController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { niveauValidation } from '../validations/niveauValidation.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/niveaux - Récupérer tous les niveaux
router.get('/', getAllNiveaux);

// GET /api/niveaux/:id - Récupérer un niveau par ID
router.get('/:id', getNiveauById);

// POST /api/niveaux - Créer un nouveau niveau
router.post('/', niveauValidation.create, createNiveau);

// PUT /api/niveaux/:id - Mettre à jour un niveau
router.put('/:id', niveauValidation.update, updateNiveau);

// DELETE /api/niveaux/:id - Supprimer un niveau
router.delete('/:id', deleteNiveau);

export default router;
