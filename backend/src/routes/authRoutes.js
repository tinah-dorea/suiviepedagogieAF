import express from 'express';
import { login, loginStudent } from '../controllers/authController.js';
import { loginValidation } from '../validations/authValidation.js'; // Using the main validation
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/login', loginValidation, validateRequest, login);
router.post('/login-student', loginValidation, validateRequest, loginStudent); // Keep for compatibility

export default router;