import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const niveauValidation = {
    create: [
        body('nom_niveau')
            .trim()
            .notEmpty().withMessage('Le nom du niveau est requis')
            .isLength({ min: 1, max: 5 }).withMessage('Le nom du niveau doit contenir entre 1 et 5 caractères'),

        body('sous_niveau')
            .optional()
            .isInt({ min: 1, max: 10 }).withMessage('Le sous-niveau doit être un nombre entre 1 et 10'),

        validateRequest
    ],

    update: [
        body('nom_niveau')
            .trim()
            .notEmpty().withMessage('Le nom du niveau est requis')
            .isLength({ min: 1, max: 5 }).withMessage('Le nom du niveau doit contenir entre 1 et 5 caractères'),

        body('sous_niveau')
            .optional()
            .isInt({ min: 1, max: 10 }).withMessage('Le sous-niveau doit être un nombre entre 1 et 10'),

        validateRequest
    ]
};

export { niveauValidation };
