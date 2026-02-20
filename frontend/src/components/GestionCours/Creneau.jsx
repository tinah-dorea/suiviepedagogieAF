import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import creneauService from '../../services/creneauService';
import { PencilIcon, TrashIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const Creneau = () => {
  const [creneaux, setCreneaux] = useState([]);
  // Suppression de la variable setLoading non utilisée
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCreneau, setCurrentCreneau] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formData, setFormData] = useState({
    heure_debut: '',
    heure_fin: ''
  });
  const [loading, setLoading] = useState(true);

  // Charger les données
  const loadData = async () => {
    try {
      const data = await creneauService.getAll();
      setCreneaux(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des créneaux');
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Gestionnaires de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCreneau) {
        await creneauService.update(currentCreneau.id, formData);
        toast.success('Créneau modifié avec succès');
      } else {
        await creneauService.create(formData);
        toast.success('Créneau créé avec succès');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (creneau) => {
    setCurrentCreneau(creneau);
    setFormData({
      heure_debut: creneau.heure_debut,
      heure_fin: creneau.heure_fin
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentCreneau(null);
    setFormData({
      heure_debut: '',
      heure_fin: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer un créneau
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      try {
        await creneauService.delete(id);
        toast.success('Créneau supprimé avec succès');
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="p-4">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Créneaux Horaires</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </div>

      {loading && <p>Chargement...</p>}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">N°</th>
              <th className="p-3 text-left">Heure de début</th>
              <th className="p-3 text-left">Heure de fin</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creneaux.map((creneau, index) => (
              <tr key={creneau.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{creneau.heure_debut}</td>
                <td className="p-3">{creneau.heure_fin}</td>
                <td className="p-3">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === creneau.id ? null : creneau.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                    
                    {openMenuId === creneau.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            handleEdit(creneau);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Éditer
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(creneau.id);
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCreneau ? "Modifier le créneau" : "Ajouter un créneau"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="heure_debut" className="block text-sm font-medium text-gray-700">
              Heure de début
            </label>
            <input
              type="time"
              id="heure_debut"
              name="heure_debut"
              value={formData.heure_debut}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="heure_fin" className="block text-sm font-medium text-gray-700">
              Heure de fin
            </label>
            <input
              type="time"
              id="heure_fin"
              name="heure_fin"
              value={formData.heure_fin}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {currentCreneau ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Creneau;