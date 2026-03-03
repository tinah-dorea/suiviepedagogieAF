import express from 'express';
import { login, loginStudent } from '../controllers/authController.js';
import { loginValidation, loginStudentValidation } from '../validations/authValidation.js';

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/login-student', loginStudentValidation, loginStudent);

export default router;