import express from 'express';
import { login } from '../controllers/authController.js';
import { loginValidation } from '../validations/authValidation.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/login', loginValidation, validateRequest, login);

export default router;