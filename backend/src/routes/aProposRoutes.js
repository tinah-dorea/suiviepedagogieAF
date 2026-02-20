import express from 'express';
import { 
    getAPropos, 
    updateAPropos
} from '../controllers/aProposController.js';

const router = express.Router();

// Pour la table a_propos, il n'y a normalement qu'un seul enregistrement avec id=1
router.get('/', getAPropos);
router.put('/', updateAPropos);

export default router;