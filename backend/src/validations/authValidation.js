import { body, validationResult } from 'express-validator';

// Import express types properly since express is a CommonJS module
import express from 'express';
const { Request, Response, NextFunction } = express;

// Custom middleware to validate that either email or telephone is provided
const validateEmailOrPhone = (req, res, next) => {
  // Check if neither email nor telephone is provided
  const hasEmail = req.body.email && req.body.email.trim() !== '';
  const hasPhone = (req.body.telephone && req.body.telephone.trim() !== '') || (req.body.tel && req.body.tel.trim() !== '');
  
  if (!hasEmail && !hasPhone) {
    return res.status(400).json({ 
      message: "Email ou téléphone doit être fourni" 
    });
  }
  
  if (!req.body.mot_passe) {
    return res.status(400).json({
      message: "Le mot de passe est requis"
    });
  }
  
  // Now check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg
    });
  }
  
  next();
};

// Define separate validation arrays for email and phone
const emailValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email ne doit pas dépasser 100 caractères'),
];

const telephoneValidation = [
  body('telephone')
    .optional()
    .trim(),
  body('tel')
    .optional()
    .trim()
    .isLength({ min: 8, max: 15 })
    .withMessage('Le numéro de téléphone doit contenir entre 8 et 15 chiffres')
    .matches(/^\+?[0-9]\d{1,14}$/)
    .withMessage('Numéro de téléphone invalide'),
];

const passwordValidation = [
  body('mot_passe')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];

export const loginValidation = [...emailValidation, ...telephoneValidation, ...passwordValidation, validateEmailOrPhone];

// Validation for student login (may have different requirements)
const studentEmailValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email ne doit pas dépasser 100 caractères'),
];

const studentTelephoneValidation = [
  body('telephone')
    .optional()
    .trim()
    .isLength({ min: 8, max: 15 })
    .withMessage('Le numéro de téléphone doit contenir entre 8 et 15 chiffres')
    .matches(/^\+?[0-9]\d{1,14}$/)
    .withMessage('Numéro de téléphone invalide'),
];

const studentPasswordValidation = [
  body('mot_passe')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];

// Custom middleware for student login validation
const validateStudentEmailOrPhone = (req, res, next) => {
  // Check if neither email nor telephone is provided
  const hasEmail = req.body.email && req.body.email.trim() !== '';
  const hasPhone = (req.body.telephone && req.body.telephone.trim() !== '') || (req.body.tel && req.body.tel.trim() !== '');
  
  if (!hasEmail && !hasPhone) {
    return res.status(400).json({ 
      message: "Email ou téléphone doit être fourni" 
    });
  }
  
  if (!req.body.mot_passe) {
    return res.status(400).json({
      message: "Le mot de passe est requis"
    });
  }
  
  // Now check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg
    });
  }
  
  next();
};

export const loginStudentValidation = [...studentEmailValidation, ...studentTelephoneValidation, ...studentPasswordValidation, validateStudentEmailOrPhone];