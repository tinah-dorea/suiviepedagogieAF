import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const categorieValidation = {
    create: [
        body('nom_categorie')
            .trim()
            .notEmpty().withMessage('Le nom de la catégorie est requis')
            .isLength({ min: 2, max: 10 }).withMessage('Le nom de la catégorie doit contenir entre 2 et 10 caractères'),

        body('id_type_cours')
            .notEmpty().withMessage('Le type de cours est requis')
            .isInt().withMessage('Le type de cours doit être un nombre entier'),

        body('min_age')
            .optional()
            .isInt({ min: 3, max: 99 }).withMessage('L\'âge minimum doit être entre 3 et 99 ans'),

        body('max_age')
            .optional()
            .isInt({ min: 3, max: 99 }).withMessage('L\'âge maximum doit être entre 3 et 99 ans')
            .custom((value, { req }) => {
                if (req.body.min_age && value <= req.body.min_age) {
                    throw new Error('L\'âge maximum doit être supérieur à l\'âge minimum');
                }
                return true;
            }),

        validateRequest
    ],

    update: [
        body('nom_categorie')
            .trim()
            .notEmpty().withMessage('Le nom de la catégorie est requis')
            .isLength({ min: 2, max: 10 }).withMessage('Le nom de la catégorie doit contenir entre 2 et 10 caractères'),

        body('id_type_cours')
            .notEmpty().withMessage('Le type de cours est requis')
            .isInt().withMessage('Le type de cours doit être un nombre entier'),

        body('min_age')
            .optional()
            .isInt({ min: 3, max: 99 }).withMessage('L\'âge minimum doit être entre 3 et 99 ans'),

        body('max_age')
            .optional()
            .isInt({ min: 3, max: 99 }).withMessage('L\'âge maximum doit être entre 3 et 99 ans')
            .custom((value, { req }) => {
                if (req.body.min_age && value <= req.body.min_age) {
                    throw new Error('L\'âge maximum doit être supérieur à l\'âge minimum');
                }
                return true;
            }),

        validateRequest
    ]
};

export { categorieValidation };
