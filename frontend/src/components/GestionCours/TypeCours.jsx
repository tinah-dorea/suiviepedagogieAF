import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import typeCoursService from '../../services/typeCoursService';
import typeServiceService from '../../services/typeServiceService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TypeCours = () => {
  const [typeCours, setTypeCours] = useState([]);
  const [typeServices, setTypeServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTypeCours, setCurrentTypeCours] = useState(null);
  const [formData, setFormData] = useState({
    nom_type_cours: '',
    id_type_service: ''
  });
  const [loading, setLoading] = useState(true);

  // Charger les données
  const loadData = async () => {
    try {
      const [coursData, serviceData] = await Promise.all([
        typeCoursService.getAll(),
        typeServiceService.getAll()
      ]);
      setTypeCours(coursData);
      setTypeServices(serviceData);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
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
      if (currentTypeCours) {
        await typeCoursService.update(currentTypeCours.id, formData);
        toast.success('Type de cours modifié avec succès');
      } else {
        await typeCoursService.create(formData);
        toast.success('Type de cours créé avec succès');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (typeCours) => {
    setCurrentTypeCours(typeCours);
    setFormData({
      nom_type_cours: typeCours.nom_type_cours,
      id_type_service: typeCours.id_type_service
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentTypeCours(null);
    setFormData({
      nom_type_cours: '',
      id_type_service: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer un type de cours
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de cours ?')) {
      try {
        await typeCoursService.delete(id);
        toast.success('Type de cours supprimé avec succès');
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  };

  // Obtenir le nom du service pour un ID donné
  const getServiceName = (serviceId) => {
    const service = typeServices.find(s => s.id === serviceId);
    return service ? service.nom_service : 'Non défini';
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
        <h2 className="text-xl font-semibold">Types de Cours</h2>
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
                Nom du Type de Cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {typeCours.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {type.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {type.nom_type_cours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getServiceName(type.id_type_service)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(type)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
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
        title={currentTypeCours ? "Modifier le type de cours" : "Ajouter un type de cours"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="id_type_service" className="block text-sm font-medium text-gray-700">
              Service
            </label>
            <select
              id="id_type_service"
              name="id_type_service"
              value={formData.id_type_service}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un service</option>
              {typeServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.nom_service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nom_type_cours" className="block text-sm font-medium text-gray-700">
              Nom du Type de Cours
            </label>
            <input
              type="text"
              id="nom_type_cours"
              name="nom_type_cours"
              value={formData.nom_type_cours}
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
              {currentTypeCours ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TypeCours;