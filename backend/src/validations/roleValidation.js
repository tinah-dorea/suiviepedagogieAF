import { body, param } from 'express-validator';

const create = [
    body('nom_role')
        .trim()
        .notEmpty()
        .withMessage('Le nom du rôle est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom du rôle doit contenir entre 2 et 50 caractères')
];

const update = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID du rôle invalide'),
    body('nom_role')
        .trim()
        .notEmpty()
        .withMessage('Le nom du rôle est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom du rôle doit contenir entre 2 et 50 caractères')
];

export const roleValidation = {
    create,
    update
};
