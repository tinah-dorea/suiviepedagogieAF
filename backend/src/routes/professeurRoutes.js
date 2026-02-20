import express from 'express';
import { 
    getAllProfesseurs, 
    getProfesseurById, 
    createProfesseur, 
    updateProfesseur, 
    deleteProfesseur
} from '../controllers/professeurController.js';

const router = express.Router();

router.get('/', getAllProfesseurs);
router.get('/:id', getProfesseurById);
router.post('/', createProfesseur);
router.put('/:id', updateProfesseur);
router.delete('/:id', deleteProfesseur);

export default router;