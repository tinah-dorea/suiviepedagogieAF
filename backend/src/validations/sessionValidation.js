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

        body('date_fin_inscription')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date de fin d\'inscription doit être une date valide')
            .custom((value, { req }) => {
                if (value && req.body.date_debut && new Date(value) >= new Date(req.body.date_debut)) {
                    throw new Error('La date de fin d\'inscription doit être antérieure à la date de début');
                }
                return true;
            }),

        body('date_debut')
            .notEmpty().withMessage('La date de début est requise')
            .isISO8601().withMessage('La date de début doit être une date valide')
            .custom((value, { req }) => {
                if (req.body.date_fin_inscription && new Date(value) <= new Date(req.body.date_fin_inscription)) {
                    throw new Error('La date de début doit être postérieure à la date de fin d\'inscription');
                }
                return true;
            }),

        body('date_fin')
            .notEmpty().withMessage('La date de fin est requise')
            .isISO8601().withMessage('La date de fin doit être une date valide')
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.date_debut)) {
                    throw new Error('La date de fin doit être postérieure à la date de début');
                }
                return true;
            }),

        body('date_exam')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date d\'examen doit être une date valide')
            .custom((value, { req }) => {
                if (value && req.body.date_fin && new Date(value) < new Date(req.body.date_fin)) {
                    throw new Error('La date d\'examen doit être égale ou postérieure à la date de fin');
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

        body('date_fin_inscription')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date de fin d\'inscription doit être une date valide')
            .custom((value, { req }) => {
                if (value && req.body.date_debut && new Date(value) >= new Date(req.body.date_debut)) {
                    throw new Error('La date de fin d\'inscription doit être antérieure à la date de début');
                }
                return true;
            }),

        body('date_debut')
            .notEmpty().withMessage('La date de début est requise')
            .isISO8601().withMessage('La date de début doit être une date valide')
            .custom((value, { req }) => {
                if (req.body.date_fin_inscription && new Date(value) <= new Date(req.body.date_fin_inscription)) {
                    throw new Error('La date de début doit être postérieure à la date de fin d\'inscription');
                }
                return true;
            }),

        body('date_fin')
            .notEmpty().withMessage('La date de fin est requise')
            .isISO8601().withMessage('La date de fin doit être une date valide')
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.date_debut)) {
                    throw new Error('La date de fin doit être postérieure à la date de début');
                }
                return true;
            }),

        body('date_exam')
            .optional({ nullable: true })
            .isISO8601().withMessage('La date d\'examen doit être une date valide')
            .custom((value, { req }) => {
                if (value && req.body.date_fin && new Date(value) < new Date(req.body.date_fin)) {
                    throw new Error('La date d\'examen doit être égale ou postérieure à la date de fin');
                }
                return true;
            }),

        validateRequest
    ]
};

export { sessionValidation };