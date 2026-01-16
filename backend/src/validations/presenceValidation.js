import Joi from 'joi';

const presenceSchema = Joi.object({
  id_inscription: Joi.number().integer().required(),
  id_groupe: Joi.number().integer().required(),
  date_cours: Joi.date().iso().required(),
  est_present: Joi.boolean().default(true),
  heure_arrivee: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).allow(null),
  remarque: Joi.string().max(500).allow(null),
  id_employe_saisie: Joi.number().integer().allow(null)
});

const createPresenceValidation = (req, res, next) => {
  const { error, value } = presenceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

const updatePresenceValidation = (req, res, next) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
  }
  
  const { error, value } = presenceSchema.fork(['id_inscription', 'id_groupe', 'date_cours'], schema => schema.optional()).validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Erreur de validation', 
      details: error.details.map(detail => detail.message) 
    });
  }
  req.validatedData = value;
  next();
};

export { createPresenceValidation, updatePresenceValidation };