import express from 'express';
import apprenantController from '../controllers/apprenantController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import apprenantValidation from '../validations/apprenantValidation.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes GET - accessibles en mode public (pour les formulaires autocomplete)
router.get('/', apprenantController.getAllApprenants);

router.get('/search', apprenantController.searchApprenants);

router.get('/:id', apprenantController.getApprenantById);

// Route pour créer un apprenant
router.post(
  '/',
  authenticateToken,
  validateRequest(apprenantValidation.createApprenantValidation),
  apprenantController.createApprenant
);

// Route pour mettre à jour un apprenant
router.put(
  '/:id',
  authenticateToken,
  validateRequest(apprenantValidation.updateApprenantValidation),
  apprenantController.updateApprenant
);

// Route pour supprimer un apprenant
router.delete('/:id', authenticateToken, apprenantController.deleteApprenant);

export default router;
