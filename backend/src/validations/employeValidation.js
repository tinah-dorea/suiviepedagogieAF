import { body } from 'express-validator';

export const createEmployeValidation = [
  body('service')
    .optional()
    .isString()
    .withMessage('Le service doit être une chaîne de caractères'),
  
  body('nom')
    .notEmpty()
    .withMessage('Le nom est requis')
    .isString()
    .withMessage('Le nom doit être une chaîne de caractères')
    .trim(),
  
  body('prenom')
    .notEmpty()
    .withMessage('Le prénom est requis')
    .isString()
    .withMessage('Le prénom doit être une chaîne de caractères')
    .trim(),
  
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('L\'âge doit être un entier entre 16 et 100'),
  
  body('adresse')
    .optional()
    .isString()
    .withMessage('L\'adresse doit être une chaîne de caractères')
    .trim(),
  
  body('tel')
    .optional()
    .matches(/^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
    .withMessage('Le numéro de téléphone doit être au format valide (ex: +33 6 12 34 56 78)')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email ne doit pas dépasser 100 caractères'),
  
  body('mot_passe')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  
  body('id_role')
    .isInt({ min: 1 })
    .withMessage('L\'ID du rôle doit être un entier positif')
];

export const updateEmployeValidation = [
  body('service')
    .optional()
    .isString()
    .withMessage('Le service doit être une chaîne de caractères'),
  
  body('nom')
    .optional()
    .isString()
    .withMessage('Le nom doit être une chaîne de caractères')
    .trim(),
  
  body('prenom')
    .optional()
    .isString()
    .withMessage('Le prénom doit être une chaîne de caractères')
    .trim(),
  
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('L\'âge doit être un entier entre 16 et 100'),
  
  body('adresse')
    .optional()
    .isString()
    .withMessage('L\'adresse doit être une chaîne de caractères')
    .trim(),
  
  body('tel')
    .optional()
    .matches(/^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
    .withMessage('Le numéro de téléphone doit être au format valide (ex: +33 6 12 34 56 78)')
    .trim(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email ne doit pas dépasser 100 caractères'),
  
  body('id_role')
    .optional()
    .isInt({ min: 1 })
    .withMessage('L\'ID du rôle doit être un entier positif')
];