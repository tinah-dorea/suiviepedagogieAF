import { celebrate, Joi, Segments } from 'celebrate';

// Validation pour la création d'une catégorie
export const createCategorieValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    nom_categorie: Joi.string().max(50).required(),
    min_age: Joi.number().integer().min(0).required(),
    max_age: Joi.number().integer().min(0).required()
  })
});

// Validation pour la mise à jour d'une catégorie
export const updateCategorieValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    nom_categorie: Joi.string().max(50).optional(),
    min_age: Joi.number().integer().min(0).optional(),
    max_age: Joi.number().integer().min(0).optional()
  })
});