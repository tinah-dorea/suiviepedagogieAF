import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import typeServiceService from '../../services/typeServiceService';

const TypeService = () => {
  const [typeServices, setTypeServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTypeService, setCurrentTypeService] = useState(null);
  const [formData, setFormData] = useState({
    nom_service: ''
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Charger les données
  const loadTypeServices = async () => {
    try {
      const data = await typeServiceService.getAll();
      setTypeServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des types de service:', error);
    }
  };

  useEffect(() => {
    loadTypeServices();
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
      if (currentTypeService) {
        await typeServiceService.update(currentTypeService.id, formData);
        setNotification({ type: 'success', message: 'Type de service modifié avec succès' });
      } else {
        await typeServiceService.create(formData);
        setNotification({ type: 'success', message: 'Type de service créé avec succès' });
      }
      setIsModalOpen(false);
      loadTypeServices();
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({ type: 'error', message: error.response?.data?.message || 'Une erreur est survenue' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (typeService) => {
    setCurrentTypeService(typeService);
    setFormData({
      nom_service: typeService.nom_service
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentTypeService(null);
    setFormData({
      nom_service: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer un type de service
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de service ?')) {
      try {
        await typeServiceService.delete(id);
        setNotification({ type: 'success', message: 'Type de service supprimé avec succès' });
        loadTypeServices();
        setTimeout(() => setNotification(null), 5000);
      } catch (error) {
        setNotification({ type: 'error', message: error.response?.data?.message || 'Une erreur est survenue' });
        setTimeout(() => setNotification(null), 5000);
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
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Types de Service</h2>
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
                Nom du Service
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {typeServices.map((typeService) => (
              <tr key={typeService.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeService.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {typeService.nom_service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(typeService)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(typeService.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    🗑️
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
        title={currentTypeService ? "Modifier le type de service" : "Ajouter un type de service"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom_service" className="block text-sm font-medium text-gray-700">
              Nom du Service
            </label>
            <input
              type="text"
              id="nom_service"
              name="nom_service"
              value={formData.nom_service}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
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
              {currentTypeService ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TypeService;