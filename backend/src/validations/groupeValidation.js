import Joi from 'joi';

const groupeSchema = Joi.object({
  id_creneau: Joi.number().integer().required(),
  numero_groupe: Joi.number().integer().min(1).required(),
  id_employe_prof: Joi.number().integer().allow(null)
});

const createGroupeValidation = (req, res, next) => {
  const { error, value } = groupeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

const updateGroupeValidation = (req, res, next) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
  }
  
  const { error, value } = groupeSchema.fork(['id_creneau', 'numero_groupe'], schema => schema.optional()).validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

export { createGroupeValidation, updateGroupeValidation };