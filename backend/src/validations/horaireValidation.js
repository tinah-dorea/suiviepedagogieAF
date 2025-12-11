import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const horaireValidation = {
    create: [
        body('id_type_cours')
            .notEmpty().withMessage('Le type de cours est requis')
            .isInt().withMessage('Le type de cours doit être un nombre entier'),

        body('id_niveau')
            .notEmpty().withMessage('Le niveau est requis')
            .isInt().withMessage('Le niveau doit être un nombre entier'),

        body('id_categorie')
            .notEmpty().withMessage('La catégorie est requise')
            .isInt().withMessage('La catégorie doit être un nombre entier'),

        body('jours_des_cours')
            .trim()
            .notEmpty().withMessage('Les jours des cours sont requis')
            .custom((value) => {
                if (typeof value !== 'string') {
                    throw new Error('Les jours des cours doivent être une chaîne de caractères.');
                }
                const joursValides = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
                const jours = value.split(',').map(jour => jour.trim().toLowerCase());
                if (!jours.every(jour => joursValides.includes(jour))) {
                    throw new Error('Les jours doivent être valides (lundi à dimanche).');
                }
                return true;
            }),

        body('heure_debut')
            .notEmpty().withMessage('L\'heure de début est requise')
            .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
            .withMessage('L\'heure de début doit être au format HH:MM'),

        body('heure_fin')
            .notEmpty().withMessage('L\'heure de fin est requise')
            .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
            .withMessage('L\'heure de fin doit être au format HH:MM')
            .custom((value, { req }) => {
                if (value <= req.body.heure_debut) {
                    throw new Error('L\'heure de fin doit être postérieure à l\'heure de début');
                }
                return true;
            }),

        validateRequest
    ],

    update: [
        body('id_type_cours')
            .notEmpty().withMessage('Le type de cours est requis')
            .isInt().withMessage('Le type de cours doit être un nombre entier'),

        body('id_niveau')
            .notEmpty().withMessage('Le niveau est requis')
            .isInt().withMessage('Le niveau doit être un nombre entier'),

        body('id_categorie')
            .notEmpty().withMessage('La catégorie est requise')
            .isInt().withMessage('La catégorie doit être un nombre entier'),

        body('jours_des_cours')
            .trim()
            .notEmpty().withMessage('Les jours des cours sont requis')
            .custom((value) => {
                if (typeof value !== 'string') {
                    throw new Error('Les jours des cours doivent être une chaîne de caractères.');
                }
                const joursValides = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
                const jours = value.split(',').map(jour => jour.trim().toLowerCase());
                if (!jours.every(jour => joursValides.includes(jour))) {
                    throw new Error('Les jours doivent être valides (lundi à dimanche).');
                }
                return true;
            }),

        body('heure_debut')
            .notEmpty().withMessage('L\'heure de début est requise')
            .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
            .withMessage('L\'heure de début doit être au format HH:MM'),

        body('heure_fin')
            .notEmpty().withMessage('L\'heure de fin est requise')
            .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
            .withMessage('L\'heure de fin doit être au format HH:MM')
            .custom((value, { req }) => {
                if (value <= req.body.heure_debut) {
                    throw new Error('L\'heure de fin doit être postérieure à l\'heure de début');
                }
                return true;
            }),

        validateRequest
    ]
};

export { horaireValidation };
