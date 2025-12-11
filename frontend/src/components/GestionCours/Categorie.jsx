import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import categorieService from '../../services/categorieService';
import typeCoursService from '../../services/typeCoursService';

const Categorie = () => {
  const [categories, setCategories] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategorie, setCurrentCategorie] = useState(null);
  const [formData, setFormData] = useState({
    nom_categorie: '',
    id_type_cours: '',
    min_age: '',
    max_age: ''
  });
  const [loading, setLoading] = useState(true);


  // Charger les données
  const loadCategories = async () => {
    try {
      const data = await categorieService.getAll();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadTypeCours = async () => {
    try {
      const data = await typeCoursService.getAll();
      setTypeCours(data);
    } catch (error) {
      console.error('Erreur lors du chargement des types de cours:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadTypeCours();
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
      if (currentCategorie) {
        await categorieService.update(currentCategorie.id, formData);
        toast.success('Catégorie modifiée avec succès');
      } else {
        await categorieService.create(formData);
        toast.success('Catégorie créée avec succès');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (categorie) => {
    setCurrentCategorie(categorie);
    setFormData({
      nom_categorie: categorie.nom_categorie,
      id_type_cours: categorie.id_type_cours || '',
      min_age: categorie.min_age || '',
      max_age: categorie.max_age || ''
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentCategorie(null);
    setFormData({
      nom_categorie: '',
      id_type_cours: '',
      min_age: '',
      max_age: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer une catégorie
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await categorieService.delete(id);
        toast.success('Catégorie supprimée avec succès');
        loadCategories();
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
        <h2 className="text-xl font-semibold">Catégories</h2>
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
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de Cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Âge Min
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Âge Max
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((categorie) => (
              <tr key={categorie.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {categorie.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {categorie.nom_categorie}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {typeCours.find(tc => tc.id === categorie.id_type_cours)?.nom_type_cours || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {categorie.min_age || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {categorie.max_age || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(categorie)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(categorie.id)}
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
        title={currentCategorie ? "Modifier la catégorie" : "Ajouter une catégorie"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom_categorie" className="block text-sm font-medium text-gray-700">
              Nom de la catégorie
            </label>
            <input
              type="text"
              id="nom_categorie"
              name="nom_categorie"
              value={formData.nom_categorie}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="id_type_cours" className="block text-sm font-medium text-gray-700">
              Type de Cours
            </label>
            <select
              id="id_type_cours"
              name="id_type_cours"
              value={formData.id_type_cours}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un type de cours</option>
              {typeCours.map((tc) => (
                <option key={tc.id} value={tc.id}>
                  {tc.nom_type_cours}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="min_age" className="block text-sm font-medium text-gray-700">
              Âge Minimum
            </label>
            <input
              type="number"
              id="min_age"
              name="min_age"
              value={formData.min_age}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="max_age" className="block text-sm font-medium text-gray-700">
              Âge Maximum
            </label>
            <input
              type="number"
              id="max_age"
              name="max_age"
              value={formData.max_age}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              {currentCategorie ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categorie;