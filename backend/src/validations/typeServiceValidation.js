import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const typeServiceValidation = {
    create: [
        body('nom_service')
            .trim()
            .notEmpty().withMessage('Le nom du service est requis')
            .isLength({ min: 2, max: 20 }).withMessage('Le nom du service doit contenir entre 2 et 20 caractères'),
        validateRequest
    ],

    update: [
        body('nom_service')
            .trim()
            .notEmpty().withMessage('Le nom du service est requis')
            .isLength({ min: 2, max: 20 }).withMessage('Le nom du service doit contenir entre 2 et 20 caractères'),
        validateRequest
    ]
};

export { typeServiceValidation };
