import Joi from 'joi';

const examenSchema = Joi.object({
  id_inscription: Joi.number().integer().required(),
  etat_inscription: Joi.boolean(),
  auto_inscription: Joi.boolean(),
  verification: Joi.boolean()
});

const createExamenValidation = (req, res, next) => {
  const { error, value } = examenSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

const updateExamenValidation = (req, res, next) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
  }
  
  const { error, value } = examenSchema.fork(['id_inscription'], schema => schema.optional()).validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

export { createExamenValidation, updateExamenValidation };