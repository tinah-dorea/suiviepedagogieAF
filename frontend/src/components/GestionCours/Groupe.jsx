import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import groupeService from '../../services/groupeService';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const Groupe = () => {
  const [groupes, setGroupes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroupe, setCurrentGroupe] = useState(null);
  const [formData, setFormData] = useState({
    libelle_groupe: '',
    id_niveau: ''
  });
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Charger les données
  const loadData = async () => {
    try {
      const data = await groupeService.getAll();
      setGroupes(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des groupes');
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
      if (currentGroupe) {
        await groupeService.update(currentGroupe.id, formData);
        toast.success('Groupe modifié avec succès');
      } else {
        await groupeService.create(formData);
        toast.success('Groupe créé avec succès');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (groupe) => {
    setCurrentGroupe(groupe);
    setFormData({
      libelle_groupe: groupe.libelle_groupe,
      id_niveau: groupe.id_niveau
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentGroupe(null);
    setFormData({
      libelle_groupe: '',
      id_niveau: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer un groupe
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      try {
        await groupeService.delete(id);
        toast.success('Groupe supprimé avec succès');
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
        <h2 className="text-xl font-semibold">Groupes</h2>
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
              <th className="p-3 text-left">Libellé</th>
              <th className="p-3 text-left">Niveau</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupes.map((groupe, index) => (
              <tr key={groupe.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{groupe.libelle_groupe}</td>
                <td className="p-3">{groupe.id_niveau}</td>
                <td className="p-3">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === groupe.id ? null : groupe.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                    
                    {openMenuId === groupe.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            handleEdit(groupe);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(groupe.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                        >
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
        title={currentGroupe ? "Modifier le groupe" : "Ajouter un groupe"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="libelle_groupe" className="block text-sm font-medium text-gray-700">
              Libellé du groupe
            </label>
            <input
              type="text"
              id="libelle_groupe"
              name="libelle_groupe"
              value={formData.libelle_groupe}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="id_niveau" className="block text-sm font-medium text-gray-700">
              ID Niveau
            </label>
            <input
              type="number"
              id="id_niveau"
              name="id_niveau"
              value={formData.id_niveau}
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
              {currentGroupe ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Groupe;