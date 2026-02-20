import React, { useState, useEffect } from 'react';
import professeurService from '../../services/professeurService';
import Modal from '../ui/Modal';
import { PencilIcon, TrashIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const PROFESSOR_SERVICE = 'Professeurs';

const buildEmptyForm = () => ({
  nom: '',
  prenom: '',
  age: '',
  adresse: '',
  tel: '',
  email: '',
  mot_passe: '',
  role: 'Professeurs',
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
  nom: normalizeText(data.nom) || '',
  prenom: normalizeText(data.prenom) || '',
  age: toNullableInt(data.age),
  adresse: normalizeText(data.adresse),
  tel: normalizeText(data.tel),
  email: normalizeText(data.email) || '',
  mot_passe: normalizeText(data.mot_passe),
  role: 'Professeurs',
});

const Professeur = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProfesseur, setCurrentProfesseur] = useState(null);
  const [formData, setFormData] = useState(buildEmptyForm());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // État pour suivre si les données ont été chargées
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const loadInitialData = async () => {
      if (hasLoaded) return; // Empêche le chargement multiple
      
      setLoading(true);
      try {
        await Promise.all([refreshProfesseurs()]);
        if (!cancelled) {
          setHasLoaded(true);
        }
      } catch (err) {
        console.error('Erreur chargement données:', err);
        if (!cancelled) {
          setError("Erreur lors du chargement des données.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [hasLoaded]); // Ajout de hasLoaded comme dépendance

  const refreshProfesseurs = async () => {
    const response = await professeurService.getProfesseurs();
    if (response && response.data) {
      setProfesseurs(response.data);
    }
  };

  const handleEdit = (professeur) => {
    openModal('edit', professeur);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await professeurService.deleteEmploye(id);
      await refreshProfesseurs();
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, professeur = null) => {
    setModalMode(mode);
    setError('');

    if (mode === 'edit' && professeur) {
      setCurrentProfesseur(professeur);
      setFormData({
        nom: professeur.nom,
        prenom: professeur.prenom,
        age: professeur.age || '',
        adresse: professeur.adresse || '',
        tel: professeur.tel || '',
        email: professeur.email,
        mot_passe: '',
        role: 'Professeurs',
      });
    } else {
      setCurrentProfesseur(null);
      setFormData(buildEmptyForm());
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentProfesseur(null);
    setFormData(buildEmptyForm());
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
  
  const filteredProfesseurs = professeurs;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-center sm:text-left">Gestion des Professeurs</h1>
        <button
          onClick={() => openModal('add')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          + Ajouter Professeur
        </button>
      </div>

      {loading && <p className="text-center">Chargement...</p>}
      {error && !modalOpen && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500">N°</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 hidden md:table-cell">Nom</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 sm:hidden">Nom</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 hidden md:table-cell">Email</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 sm:hidden">Email</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 hidden md:table-cell">Téléphone</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 sm:hidden">Tél</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 hidden md:table-cell">Statut</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500 sm:hidden">Statut</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfesseurs.map((prof, index) => (
              <tr key={prof.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prof.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prof.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prof.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prof.tel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === prof.id ? null : prof.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                    
                    {openMenuId === prof.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            handleEdit(prof);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Éditer
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(prof.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
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