import { body } from 'express-validator';

const createApprenantValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères'),
  
  body('prenom')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ max: 255 }).withMessage('Le prénom ne doit pas dépasser 255 caractères'),
  
  body('date_n')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date doit être au format ISO 8601'),
  
  body('sexe')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 10 }).withMessage('Le sexe ne doit pas dépasser 10 caractères'),
  
  body('adresse')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('L\'adresse ne doit pas dépasser 500 caractères'),
  
  body('tel')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 15 }).withMessage('Le téléphone ne doit pas dépasser 15 caractères'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('L\'email doit être valide')
    .isLength({ max: 100 }).withMessage('L\'email ne doit pas dépasser 100 caractères'),
  
  body('nationalite')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('La nationalité ne doit pas dépasser 50 caractères'),
  
  body('lieu_n')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Le lieu de naissance ne doit pas dépasser 100 caractères'),
  
  body('etablissement')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('L\'établissement ne doit pas dépasser 500 caractères'),
  
  body('niveau_scolaire')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Le niveau scolaire ne doit pas dépasser 50 caractères'),
  
  body('statut')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(['actif', 'abandon']).withMessage('Le statut doit être "actif" ou "abandon"')
];

const updateApprenantValidation = [
  body('nom')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères'),
  
  body('prenom')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Le prénom ne doit pas dépasser 255 caractères'),
  
  body('date_n')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date doit être au format ISO 8601'),
  
  body('sexe')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 10 }).withMessage('Le sexe ne doit pas dépasser 10 caractères'),
  
  body('adresse')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('L\'adresse ne doit pas dépasser 500 caractères'),
  
  body('tel')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 15 }).withMessage('Le téléphone ne doit pas dépasser 15 caractères'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('L\'email doit être valide')
    .isLength({ max: 100 }).withMessage('L\'email ne doit pas dépasser 100 caractères'),
  
  body('nationalite')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('La nationalité ne doit pas dépasser 50 caractères'),
  
  body('lieu_n')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Le lieu de naissance ne doit pas dépasser 100 caractères'),
  
  body('etablissement')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('L\'établissement ne doit pas dépasser 500 caractères'),
  
  body('niveau_scolaire')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Le niveau scolaire ne doit pas dépasser 50 caractères'),
  
  body('statut')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(['actif', 'abandon']).withMessage('Le statut doit être "actif" ou "abandon"')
];

export {
  createApprenantValidation,
  updateApprenantValidation
};

export default {
  createApprenantValidation,
  updateApprenantValidation
};
