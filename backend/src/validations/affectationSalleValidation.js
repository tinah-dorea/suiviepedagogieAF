import Joi from 'joi';

const affectationSalleSchema = Joi.object({
  id_groupe: Joi.number().integer().required(),
  date_cours: Joi.date().iso().required(),
  id_salle: Joi.number().integer().required()
});

const createAffectationSalleValidation = (req, res, next) => {
  const { error, value } = affectationSalleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

const updateAffectationSalleValidation = (req, res, next) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
  }
  
  const { error, value } = affectationSalleSchema.fork(['id_groupe', 'date_cours', 'id_salle'], schema => schema.optional()).validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

export { createAffectationSalleValidation, updateAffectationSalleValidation };