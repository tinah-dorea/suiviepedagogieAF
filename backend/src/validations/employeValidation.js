import { body } from 'express-validator';

export const createEmployeValidation = [

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
    .optional({ nullable: true })
    .isInt({ min: 16, max: 100 })
    .withMessage('L\'âge doit être un entier entre 16 et 100'),

  body('adresse')
    .optional({ nullable: true })
    .isString()
    .withMessage('L\'adresse doit être une chaîne de caractères')
    .trim(),

  body('tel')
    .optional({ nullable: true })
    .isString()
    .withMessage('Le téléphone doit être une chaîne de caractères')
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

  body('role')
    .notEmpty()
    .withMessage('Le rôle est requis')
    .isString()
    .withMessage('Le rôle doit être une chaîne de caractères')
];

export const updateEmployeValidation = [

  body('nom')
    .optional({ nullable: true })
    .isString()
    .withMessage('Le nom doit être une chaîne de caractères')
    .trim(),

  body('prenom')
    .optional({ nullable: true })
    .isString()
    .withMessage('Le prénom doit être une chaîne de caractères')
    .trim(),

  body('age')
    .optional({ nullable: true })
    .isInt({ min: 16, max: 100 })
    .withMessage('L\'âge doit être un entier entre 16 et 100'),

  body('adresse')
    .optional({ nullable: true })
    .isString()
    .withMessage('L\'adresse doit être une chaîne de caractères')
    .trim(),

  body('tel')
    .optional({ nullable: true })
    .isString()
    .withMessage('Le téléphone doit être une chaîne de caractères')
    .trim(),

  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email ne doit pas dépasser 100 caractères'),

  body('role')
    .optional({ nullable: true })
    .isString()
    .withMessage('Le rôle doit être une chaîne de caractères')
];