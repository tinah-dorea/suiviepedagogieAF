import express from 'express';
import {
    getAllHoraires,
    getHoraireById,
    createHoraire,
    updateHoraire,
    deleteHoraire,
    getHorairesByTypeCours
} from '../controllers/horaireController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { horaireValidation } from '../validations/horaireValidation.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// GET /api/horaires - Récupérer tous les horaires
router.get('/', getAllHoraires);

// GET /api/horaires/:id - Récupérer un horaire par ID
router.get('/:id', getHoraireById);

// GET /api/horaires/type-cours/:typeCoursId - Récupérer les horaires par type de cours
router.get('/type-cours/:typeCoursId', getHorairesByTypeCours);

// POST /api/horaires - Créer un nouvel horaire
router.post('/', horaireValidation.create, createHoraire);

// PUT /api/horaires/:id - Mettre à jour un horaire
router.put('/:id', horaireValidation.update, updateHoraire);

// DELETE /api/horaires/:id - Supprimer un horaire
router.delete('/:id', deleteHoraire);

export default router;
