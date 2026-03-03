import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const typeServiceValidation = {
    create: [
        body('nom_service')
            .trim()
            .notEmpty().withMessage('Le nom du service est requis')
            .isLength({ min: 2, max: 50 }).withMessage('Le nom du service doit contenir entre 2 et 50 caractères'),
        body('libelle')
            .optional({ nullable: true })
            .trim()
            .isLength({ max: 200 }).withMessage('La description ne doit pas dépasser 200 caractères'),
        validateRequest
    ],

    update: [
        body('nom_service')
            .trim()
            .notEmpty().withMessage('Le nom du service est requis')
            .isLength({ min: 2, max: 50 }).withMessage('Le nom du service doit contenir entre 2 et 50 caractères'),
        body('libelle')
            .optional({ nullable: true })
            .trim()
            .isLength({ max: 200 }).withMessage('La description ne doit pas dépasser 200 caractères'),
        validateRequest
    ]
};

export { typeServiceValidation };
