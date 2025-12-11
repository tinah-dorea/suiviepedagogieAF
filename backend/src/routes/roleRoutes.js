import express from 'express';
import {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} from '../controllers/roleController.js';
import { roleValidation } from '../validations/roleValidation.js';

const router = express.Router();

router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.post('/', roleValidation.create, createRole);
router.put('/:id', roleValidation.update, updateRole);
router.delete('/:id', deleteRole);

export default router;
