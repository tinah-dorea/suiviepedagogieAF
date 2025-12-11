import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const typeCoursValidation = {
    create: [
        body('id_type_service')
            .notEmpty().withMessage('Le type de service est requis')
            .isInt().withMessage('Le type de service doit être un nombre entier'),

        body('nom_type_cours')
            .trim()
            .notEmpty().withMessage('Le nom du type de cours est requis')
            .isLength({ min: 2, max: 50 }).withMessage('Le nom du type de cours doit contenir entre 2 et 50 caractères'),

        validateRequest
    ],

    update: [
        body('id_type_service')
            .notEmpty().withMessage('Le type de service est requis')
            .isInt().withMessage('Le type de service doit être un nombre entier'),

        body('nom_type_cours')
            .trim()
            .notEmpty().withMessage('Le nom du type de cours est requis')
            .isLength({ min: 2, max: 50 }).withMessage('Le nom du type de cours doit contenir entre 2 et 50 caractères'),

        validateRequest
    ]
};

export { typeCoursValidation };
