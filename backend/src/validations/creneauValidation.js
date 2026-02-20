import { celebrate, Joi, Segments } from 'celebrate';

// Validation pour la création d'un créneau
export const createCreneauValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id_horaire_cours: Joi.number().integer().required(),
    jour_semaine: Joi.array().items(Joi.string().valid('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche')).required(),
    heure_debut: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(), // Format HH:MM:SS
    heure_fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required()    // Format HH:MM:SS
  })
});

// Validation pour la mise à jour d'un créneau
export const updateCreneauValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id_horaire_cours: Joi.number().integer().optional(),
    jour_semaine: Joi.array().items(Joi.string().valid('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche')).optional(),
    heure_debut: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).optional(), // Format HH:MM:SS
    heure_fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).optional()    // Format HH:MM:SS
  })
});