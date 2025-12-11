import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import niveauService from '../../services/niveauService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Niveau = () => {
  const [niveaux, setNiveaux] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNiveau, setCurrentNiveau] = useState(null);
  const [formData, setFormData] = useState({
    nom_niveau: '',
    sous_niveau: ''
  });
  const [loading, setLoading] = useState(true);

  // Charger les données
  const loadNiveaux = async () => {
    try {
      const data = await niveauService.getAll();
      setNiveaux(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des niveaux');
      console.error(error);
    }
  };

  useEffect(() => {
    loadNiveaux();
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
      const submitData = {
        ...formData,
        sous_niveau: formData.sous_niveau ? parseInt(formData.sous_niveau) : null
      };

      if (currentNiveau) {
        await niveauService.update(currentNiveau.id, submitData);
        toast.success('Niveau modifié avec succès');
      } else {
        await niveauService.create(submitData);
        toast.success('Niveau créé avec succès');
      }
      setIsModalOpen(false);
      loadNiveaux();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (niveau) => {
    setCurrentNiveau(niveau);
    setFormData({
      nom_niveau: niveau.nom_niveau,
      sous_niveau: niveau.sous_niveau?.toString() || ''
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentNiveau(null);
    setFormData({
      nom_niveau: '',
      sous_niveau: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer un niveau
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce niveau ?')) {
      try {
        await niveauService.delete(id);
        toast.success('Niveau supprimé avec succès');
        loadNiveaux();
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Niveaux</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sous-niveau
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {niveaux.map((niveau) => (
              <tr key={niveau.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {niveau.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {niveau.nom_niveau}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {niveau.sous_niveau || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(niveau)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(niveau.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
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
        title={currentNiveau ? "Modifier le niveau" : "Ajouter un niveau"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom_niveau" className="block text-sm font-medium text-gray-700">
              Niveau
            </label>
            <input
              type="text"
              id="nom_niveau"
              name="nom_niveau"
              value={formData.nom_niveau}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              maxLength={5}
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum 5 caractères (ex: A1, B2, etc.)
            </p>
          </div>

          <div>
            <label htmlFor="sous_niveau" className="block text-sm font-medium text-gray-700">
              Sous-niveau
            </label>
            <input
              type="number"
              id="sous_niveau"
              name="sous_niveau"
              value={formData.sous_niveau}
              onChange={handleInputChange}
              min="1"
              max="10"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Optionnel - Entre 1 et 10
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {currentNiveau ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Niveau;