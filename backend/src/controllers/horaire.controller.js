// src/controllers/horaire.controller.js
import {
  getAllHoraires,
  getHoraireById,
  createHoraire,
  updateHoraire,
  deleteHoraire,
  doesTypeCoursExist,
  doesNiveauExist,
  doesCategorieExist
} from '../models/horaire.model.js';

// GET /api/horaires
export const getHoraires = async (req, res) => {
  try {
    const horaires = await getAllHoraires();
    res.status(200).json(horaires);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des horaires' });
  }
};

// GET /api/horaires/:id
export const getHoraire = async (req, res) => {
  try {
    const { id } = req.params;
    const horaire = await getHoraireById(id);
    if (!horaire) {
      return res.status(404).json({ message: 'Horaire non trouvé' });
    }
    res.status(200).json(horaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l’horaire' });
  }
};

// POST /api/horaires
export const createHoraireCtrl = async (req, res) => {
  try {
    const { id_type_cours, id_niveau, id_categorie, jours_des_cours, heure_debut, heure_fin } = req.body;

    // Validation des IDs obligatoires
    const ids = { id_type_cours, id_niveau, id_categorie };
    for (const [key, value] of Object.entries(ids)) {
      if (!value || !Number.isInteger(Number(value))) {
        return res.status(400).json({ message: `${key} doit être un entier valide` });
      }
    }

    // Validation des heures (format HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (heure_debut && !timeRegex.test(heure_debut)) {
      return res.status(400).json({ message: 'heure_debut doit être au format HH:MM (ex: "09:00")' });
    }
    if (heure_fin && !timeRegex.test(heure_fin)) {
      return res.status(400).json({ message: 'heure_fin doit être au format HH:MM (ex: "11:00")' });
    }

    // Vérification des références
    const checks = await Promise.all([
      doesTypeCoursExist(id_type_cours),
      doesNiveauExist(id_niveau),
      doesCategorieExist(id_categorie)
    ]);

    if (!checks[0]) return res.status(400).json({ message: 'type_cours introuvable' });
    if (!checks[1]) return res.status(400).json({ message: 'niveau introuvable' });
    if (!checks[2]) return res.status(400).json({ message: 'categorie introuvable' });

    const newHoraire = await createHoraire(
      id_type_cours,
      id_niveau,
      id_categorie,
      jours_des_cours || null,
      heure_debut || null,
      heure_fin || null
    );

    res.status(201).json(newHoraire);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Cet horaire existe déjà' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Violation de clé étrangère' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l’horaire' });
  }
};

// PUT /api/horaires/:id
export const updateHoraireCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_type_cours, id_niveau, id_categorie, jours_des_cours, heure_debut, heure_fin } = req.body;

    const existing = await getHoraireById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Horaire non trouvé' });
    }

    const ids = { id_type_cours, id_niveau, id_categorie };
    for (const [key, value] of Object.entries(ids)) {
      if (!value || !Number.isInteger(Number(value))) {
        return res.status(400).json({ message: `${key} doit être un entier valide` });
      }
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (heure_debut && !timeRegex.test(heure_debut)) {
      return res.status(400).json({ message: 'heure_debut doit être au format HH:MM' });
    }
    if (heure_fin && !timeRegex.test(heure_fin)) {
      return res.status(400).json({ message: 'heure_fin doit être au format HH:MM' });
    }

    const checks = await Promise.all([
      doesTypeCoursExist(id_type_cours),
      doesNiveauExist(id_niveau),
      doesCategorieExist(id_categorie)
    ]);

    if (!checks[0]) return res.status(400).json({ message: 'type_cours introuvable' });
    if (!checks[1]) return res.status(400).json({ message: 'niveau introuvable' });
    if (!checks[2]) return res.status(400).json({ message: 'categorie introuvable' });

    const updated = await updateHoraire(
      id,
      id_type_cours,
      id_niveau,
      id_categorie,
      jours_des_cours || null,
      heure_debut || null,
      heure_fin || null
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’horaire' });
  }
};

// DELETE /api/horaires/:id
export const deleteHoraireCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getHoraireById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Horaire non trouvé' });
    }

    await deleteHoraire(id);
    res.status(200).json({ message: 'Horaire supprimé avec succès' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Impossible de supprimer : cet horaire est utilisé par des inscriptions'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};