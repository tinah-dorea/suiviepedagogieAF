import Joi from 'joi';

const groupeSchema = Joi.object({
  nom_groupe: Joi.string().min(1).max(60).required(),
  id_creneau: Joi.number().integer().required(),
  id_professeur: Joi.number().integer().required()
});

const createGroupeValidation = (req, res, next) => {
  console.log('[Groupe Validation] Body reçu:', req.body);
  const { error, value } = groupeSchema.validate(req.body);
  if (error) {
    console.log('[Groupe Validation] Erreur:', error.details.map(d => d.message));
    return res.status(400).json({
      message: 'Erreur de validation',
      details: error.details.map(detail => detail.message)
    });
  }
  console.log('[Groupe Validation] OK, valeur:', value);
  req.validatedData = value;
  next();
};

const updateGroupeValidation = (req, res, next) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
  }

  const { error, value } = groupeSchema.fork(['nom_groupe', 'id_creneau', 'id_professeur'], schema => schema.optional()).validate(req.body);
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