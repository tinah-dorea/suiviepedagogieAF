import React, { useState, useEffect, useMemo } from 'react';
import professeurService from '../../services/professeurService';
import Modal from '../ui/Modal';

const PROFESSOR_SERVICE = 'Professeurs';

const buildEmptyForm = (roleId = '') => ({
  service: PROFESSOR_SERVICE,
  nom: '',
  prenom: '',
  age: '',
  adresse: '',
  tel: '',
  email: '',
  mot_passe: '',
  id_role: roleId,
});

const normalizeText = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = value.toString().trim();
  return trimmed === '' ? null : trimmed;
};

const toNullableInt = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const sanitizePayload = (data) => ({
  service: PROFESSOR_SERVICE,
  nom: normalizeText(data.nom) || '',
  prenom: normalizeText(data.prenom) || '',
  age: toNullableInt(data.age),
  adresse: normalizeText(data.adresse),
  tel: normalizeText(data.tel),
  email: normalizeText(data.email) || '',
  mot_passe: normalizeText(data.mot_passe),
  id_role: toNullableInt(data.id_role),
});

const Professeur = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProfesseur, setCurrentProfesseur] = useState(null);
  const [formData, setFormData] = useState(buildEmptyForm());
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([refreshProfesseurs(), loadRoles()]);
    } catch (err) {
      console.error('Erreur chargement données:', err);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  const refreshProfesseurs = async () => {
    const response = await professeurService.getProfesseurs();
    setProfesseurs(response.data);
  };

  const loadRoles = async () => {
    const response = await professeurService.getRoles();
    setRoles(response.data);
  };

  const profRoleId = useMemo(() => {
    const profRole = roles.find((r) => r.nom_role === 'Professeur');
    return profRole ? profRole.id : '';
  }, [roles]);

  useEffect(() => {
    if (modalMode === 'add' && profRoleId) {
      setFormData((prev) => ({ ...prev, id_role: prev.id_role || profRoleId }));
    }
  }, [modalMode, profRoleId]);

  const openModal = (mode, professeur = null) => {
    setModalMode(mode);
    setError('');

    if (mode === 'edit' && professeur) {
      setCurrentProfesseur(professeur);
      setFormData({
        service: PROFESSOR_SERVICE,
        nom: professeur.nom,
        prenom: professeur.prenom,
        age: professeur.age || '',
        adresse: professeur.adresse || '',
        tel: professeur.tel || '',
        email: professeur.email,
        mot_passe: '',
        id_role: professeur.id_role || profRoleId || '',
      });
    } else {
      setCurrentProfesseur(null);
      setFormData(buildEmptyForm(profRoleId));
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentProfesseur(null);
    setFormData(buildEmptyForm(profRoleId));
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = sanitizePayload(formData);

      if (!payload.id_role) {
        throw new Error("Le rôle Professeur est requis.");
      }

      if (modalMode === 'edit') {
        if (!payload.mot_passe) {
          delete payload.mot_passe;
        }
        await professeurService.updateEmploye(currentProfesseur.id, payload);
      } else {
        if (!payload.mot_passe) {
          throw new Error("Un mot de passe est requis pour créer un professeur.");
        }
        await professeurService.createEmploye(payload);
      }

      await refreshProfesseurs();
      closeModal();
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.response?.data?.message || err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, is_active) => {
    try {
      setLoading(true);
      await professeurService.toggleStatus(id, !is_active);
      await refreshProfesseurs();
    } catch (err) {
      console.error('Erreur modification statut:', err);
      setError("Erreur lors du changement de statut.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfesseurs = useMemo(
    () =>
      professeurs.filter(
        (prof) =>
          prof.nom_role === 'Professeur' &&
          (prof.service || '').toLowerCase() === PROFESSOR_SERVICE.toLowerCase()
      ),
    [professeurs]
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Professeurs</h1>
        <button
          onClick={() => openModal('add')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Ajouter Professeur
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && !modalOpen && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfesseurs.map((prof) => (
              <tr key={prof.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {prof.prenom} {prof.nom}
                </td>
                <td className="p-3">{prof.email}</td>
                <td className="p-3">{prof.tel || '-'}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      prof.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {prof.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => openModal('edit', prof)}
                    className="text-blue-600 hover:underline"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleToggleStatus(prof.id, prof.is_active)}
                    className={
                      prof.is_active ? 'text-yellow-600 hover:underline' : 'text-green-600 hover:underline'
                    }
                  >
                    {prof.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalMode === 'add' ? 'Ajouter un Professeur' : 'Modifier le Professeur'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="nom"
              placeholder="Nom *"
              value={formData.nom}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="prenom"
              placeholder="Prénom *"
              value={formData.prenom}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="tel"
            placeholder="Téléphone"
            value={formData.tel}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="age"
            type="number"
            placeholder="Âge"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          {modalMode === 'add' ? (
            <input
              name="mot_passe"
              type="password"
              placeholder="Mot de passe *"
              value={formData.mot_passe}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          ) : (
            <input
              name="mot_passe"
              type="password"
              placeholder="Nouveau mot de passe (optionnel)"
              value={formData.mot_passe}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          )}

          <input type="hidden" name="id_role" value={formData.id_role || ''} />

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Enregistrement...' : modalMode === 'add' ? 'Ajouter' : 'Modifier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Professeur;

