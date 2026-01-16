import { body } from 'express-validator';

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email ne doit pas dépasser 100 caractères'),

  body('mot_passe')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];