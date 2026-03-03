import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const horaireValidation = {
    create: [
        body('id_type_cours')
            .notEmpty().withMessage('L\'ID de type de cours est requis')
            .isInt().withMessage('L\'ID de type de cours doit être un nombre entier'),

        body('id_niveau')
            .optional({ nullable: true })
            .isArray().withMessage('Les niveaux doivent être un tableau')
            .custom((value) => {
                if (value && value.length > 0) {
                    return value.every(v => Number.isInteger(v));
                }
                return true;
            }).withMessage('Tous les IDs de niveau doivent être des nombres entiers'),

        body('id_categorie')
            .notEmpty().withMessage('L\'ID de catégorie est requis')
            .isInt().withMessage('L\'ID de catégorie doit être un nombre entier'),

        body('duree_heures')
            .optional({ nullable: true })
            .isInt({ min: 1 }).withMessage('La durée en heures doit être un nombre positif'),

        body('duree_semaines')
            .optional({ nullable: true })
            .isInt({ min: 1 }).withMessage('La durée en semaines doit être un nombre positif'),

        validateRequest
    ],

    update: [
        body('id_type_cours')
            .optional({ nullable: true })
            .isInt().withMessage('L\'ID de type de cours doit être un nombre entier'),

        body('id_niveau')
            .optional({ nullable: true })
            .isArray().withMessage('Les niveaux doivent être un tableau')
            .custom((value) => {
                if (value && value.length > 0) {
                    return value.every(v => Number.isInteger(v));
                }
                return true;
            }).withMessage('Tous les IDs de niveau doivent être des nombres entiers'),

        body('id_categorie')
            .optional({ nullable: true })
            .isInt().withMessage('L\'ID de catégorie doit être un nombre entier'),

        body('duree_heures')
            .optional({ nullable: true })
            .isInt({ min: 1 }).withMessage('La durée en heures doit être un nombre positif'),

        body('duree_semaines')
            .optional({ nullable: true })
            .isInt({ min: 1 }).withMessage('La durée en semaines doit être un nombre positif'),

        validateRequest
    ]
};

export { horaireValidation };
