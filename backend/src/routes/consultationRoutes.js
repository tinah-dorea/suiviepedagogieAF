import express from 'express';
import { getSessionsPublic, getSessionDetailPublic, getTypeCoursPublic } from '../controllers/consultationController.js';

const router = express.Router();

// Routes publiques - pas d'authentification requise
router.get('/type-cours', getTypeCoursPublic);
router.get('/sessions', getSessionsPublic);
router.get('/sessions/:id', getSessionDetailPublic);

export default router;
