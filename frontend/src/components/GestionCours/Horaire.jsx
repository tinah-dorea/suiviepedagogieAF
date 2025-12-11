import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import horaireService from '../../services/horaireService';
import typeCoursService from '../../services/typeCoursService';
import niveauService from '../../services/niveauService';
import categorieService from '../../services/categorieService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Horaire = () => {
  const [horaires, setHoraires] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHoraire, setCurrentHoraire] = useState(null);
  const [formData, setFormData] = useState({
    id_type_cours: '',
    id_niveau: '',
    id_categorie: '',
    jours_des_cours: [],
    heure_debut: '',
    heure_fin: ''
  });
  const [loading, setLoading] = useState(true);


  // Charger les données
  const loadHoraires = async () => {
    try {
      const data = await horaireService.getAll();
      setHoraires(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des horaires');
      console.error(error);
    }
  };

  const loadTypeCours = async () => {
    try {
      const data = await typeCoursService.getAll();
      setTypeCours(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des types de cours');
      console.error(error);
    }
  };

  const loadNiveaux = async () => {
    try {
      const data = await niveauService.getAll();
      setNiveaux(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des niveaux');
      console.error(error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categorieService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadHoraires(), loadTypeCours(), loadNiveaux(), loadCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Gestionnaires de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (['id_type_cours', 'id_niveau', 'id_categorie'].includes(name)) {
      processedValue = parseInt(value, 10) || '';
    }
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        jours_des_cours: formData.jours_des_cours.join(',')
      };

      if (currentHoraire) {
        await horaireService.update(currentHoraire.id, submitData);
        toast.success('Horaire modifié avec succès');
      } else {
        await horaireService.create(submitData);
        toast.success('Horaire créé avec succès');
      }
      setIsModalOpen(false);
      loadHoraires();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (horaire) => {
    setCurrentHoraire(horaire);
    setFormData({
      id_type_cours: horaire.id_type_cours || '',
      id_niveau: horaire.id_niveau || '',
      id_categorie: horaire.id_categorie || '',
      jours_des_cours: horaire.jours_des_cours ? horaire.jours_des_cours.split(',') : [],
      heure_debut: horaire.heure_debut ? horaire.heure_debut.slice(0, 5) : '',
      heure_fin: horaire.heure_fin ? horaire.heure_fin.slice(0, 5) : ''
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentHoraire(null);
    setFormData({
      id_type_cours: '',
      id_niveau: '',
      id_categorie: '',
      jours_des_cours: [],
      heure_debut: '',
      heure_fin: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer un horaire
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
      try {
        await horaireService.delete(id);
        toast.success('Horaire supprimé avec succès');
        loadHoraires();
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
        <h2 className="text-xl font-semibold">Horaires</h2>
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
                Type de Cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jours des Cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heure de début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heure de fin
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {horaires.map((horaire) => (
              <tr key={horaire.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {horaire.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {typeCours.find(tc => tc.id === horaire.id_type_cours)?.nom_type_cours || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {niveaux.find(n => n.id === horaire.id_niveau)?.nom_niveau || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {categories.find(c => c.id === horaire.id_categorie)?.nom_categorie || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {horaire.jours_des_cours || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {horaire.heure_debut ? horaire.heure_debut.slice(0, 5) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {horaire.heure_fin ? horaire.heure_fin.slice(0, 5) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(horaire)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(horaire.id)}
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
        title={currentHoraire ? "Modifier l'horaire" : "Ajouter un horaire"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="id_niveau" className="block text-sm font-medium text-gray-700">
              Niveau
            </label>
            <select
              id="id_niveau"
              name="id_niveau"
              value={formData.id_niveau}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un niveau</option>
              {niveaux.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nom_niveau}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="id_categorie" className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              id="id_categorie"
              name="id_categorie"
              value={formData.id_categorie}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom_categorie}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="jours_des_cours" className="block text-sm font-medium text-gray-700">
              Jours des Cours
            </label>
            <select
              id="jours_des_cours"
              name="jours_des_cours"
              multiple
              value={formData.jours_des_cours}
              onChange={(e) => {
                const options = Array.from(e.target.options);
                const value = options.filter(option => option.selected).map(option => option.value);
                setFormData(prev => ({
                  ...prev,
                  jours_des_cours: value
                }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="lundi">Lundi</option>
              <option value="mardi">Mardi</option>
              <option value="mercredi">Mercredi</option>
              <option value="jeudi">Jeudi</option>
              <option value="vendredi">Vendredi</option>
              <option value="samedi">Samedi</option>
              <option value="dimanche">Dimanche</option>
            </select>
          </div>

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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
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
              {currentHoraire ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Horaire;
