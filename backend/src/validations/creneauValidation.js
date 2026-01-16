import Joi from 'joi';

const creneauSchema = Joi.object({
  id_session_cours: Joi.number().integer().required(),
  jour_semaine: Joi.string().valid('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche').required(),
  heure_debut: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required(),
  heure_fin: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required()
}).custom((value, helpers) => {
  // Vérifier que heure_fin est après heure_debut
  if (value.heure_fin <= value.heure_debut) {
    return helpers.error('any.invalid', { message: 'L\'heure de fin doit être postérieure à l\'heure de début' });
  }
  return value;
});

const createCreneauValidation = (req, res, next) => {
  const { error, value } = creneauSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

const updateCreneauValidation = (req, res, next) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
  }
  
  const { error, value } = creneauSchema.fork(['id_session_cours', 'jour_semaine', 'heure_debut', 'heure_fin'], schema => schema.optional()).validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

export { createCreneauValidation, updateCreneauValidation };