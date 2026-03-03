import express from 'express';
import {
    getAllProfesseurs,
    getProfesseurById,
    createProfesseur,
    updateProfesseur,
    deleteProfesseur
} from '../controllers/professeurController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/professeurs - Récupérer tous les professeurs
router.get('/', getAllProfesseurs);

// GET /api/professeurs/:id - Récupérer un professeur par ID
router.get('/:id', getProfesseurById);

// POST /api/professeurs - Créer un nouveau professeur
router.post('/', createProfesseur);

// PUT /api/professeurs/:id - Mettre à jour un professeur
router.put('/:id', updateProfesseur);

// DELETE /api/professeurs/:id - Supprimer un professeur
router.delete('/:id', deleteProfesseur);

export default router;