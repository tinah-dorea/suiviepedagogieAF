import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const sessionValidation = {
    create: [
        body('mois')
            .trim()
            .notEmpty().withMessage('Le mois est requis')
            .isLength({ min: 3, max: 10 }).withMessage('Le mois doit contenir entre 3 et 10 caractères')
            .matches(/^[A-Za-zÀ-ÿ]+$/).withMessage('Le mois ne doit contenir que des lettres'),

        body('annee')
            .notEmpty().withMessage('L\'année est requise')
            .isInt({ min: 2020, max: 2100 }).withMessage('L\'année doit être valide (entre 2020 et 2100)'),

        body('id_type_cours')
            .notEmpty().withMessage('Le type de cours est requis')
            .isInt().withMessage('Le type de cours doit être un nombre entier'),

        body('date_debut')
            .notEmpty().withMessage('La date de début est requise')
            .isISO8601().withMessage('La date de début doit être une date valide'),

        body('date_fin')
            .notEmpty().withMessage('La date de fin est requise')
            .isISO8601().withMessage('La date de fin doit être une date valide'),

        body('date_fin_inscription')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date de fin d\'inscription doit être une date valide'),

        body('date_exam')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date d\'examen doit être une date valide'),

        body('nom_session')
            .optional({ nullable: true })
            .trim()
            .isLength({ max: 100 }).withMessage('Le nom de la session ne doit pas dépasser 100 caractères'),

        body('duree_cours')
            .optional({ nullable: true })
            .custom((value) => {
                if (value === null || value === undefined || value === '') {
                    return true;
                }
                const num = parseInt(value, 10);
                if (isNaN(num) || num < 0) {
                    throw new Error('La durée doit être un nombre positif');
                }
                return true;
            }),

        validateRequest
    ],

    update: [
        body('mois')
            .trim()
            .notEmpty().withMessage('Le mois est requis')
            .isLength({ min: 3, max: 10 }).withMessage('Le mois doit contenir entre 3 et 10 caractères')
            .matches(/^[A-Za-zÀ-ÿ]+$/).withMessage('Le mois ne doit contenir que des lettres'),

        body('annee')
            .notEmpty().withMessage('L\'année est requise')
            .isInt({ min: 2020, max: 2100 }).withMessage('L\'année doit être valide (entre 2020 et 2100)'),

        body('id_type_cours')
            .notEmpty().withMessage('Le type de cours est requis')
            .isInt().withMessage('Le type de cours doit être un nombre entier'),

        body('date_debut')
            .notEmpty().withMessage('La date de début est requise')
            .isISO8601().withMessage('La date de début doit être une date valide'),

        body('date_fin')
            .notEmpty().withMessage('La date de fin est requise')
            .isISO8601().withMessage('La date de fin doit être une date valide'),

        body('date_fin_inscription')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date de fin d\'inscription doit être une date valide'),

        body('date_exam')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date d\'examen doit être une date valide'),

        body('nom_session')
            .optional({ nullable: true })
            .trim()
            .isLength({ max: 100 }).withMessage('Le nom de la session ne doit pas dépasser 100 caractères'),

        body('duree_cours')
            .optional({ nullable: true })
            .custom((value) => {
                if (value === null || value === undefined || value === '') {
                    return true;
                }
                const num = parseInt(value, 10);
                if (isNaN(num) || num < 0) {
                    throw new Error('La durée doit être un nombre positif');
                }
                return true;
            }),

        validateRequest
    ]
};

export { sessionValidation };