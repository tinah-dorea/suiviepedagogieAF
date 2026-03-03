import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import affectationSalleService from '../../services/affectationSalleService';
import groupeService from '../../services/groupeService';
import salleService from '../../services/salleService';
import { BuildingOfficeIcon, UserGroupIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const AttributionSalle = () => {
  const [affectations, setAffectations] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [salles, setSalles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAffectation, setCurrentAffectation] = useState(null);
  const [formData, setFormData] = useState({
    id_groupe: '',
    id_salle: ''
  });
  const [groupeSearch, setGroupeSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Charger les données
  const loadData = async () => {
    try {
      const [affectationsData, groupesData, sallesData] = await Promise.all([
        affectationSalleService.getAll(),
        groupeService.getAll(),
        salleService.getAll()
      ]);

      console.log('Affectations:', affectationsData);
      console.log('Groupes:', groupesData);
      console.log('Salles:', sallesData);

      setAffectations(Array.isArray(affectationsData) ? affectationsData : []);
      setGroupes(Array.isArray(groupesData) ? groupesData : []);
      setSalles(Array.isArray(sallesData) ? sallesData : []);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error('Error details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter groupes by search term
  const getFilteredGroupes = () => {
    if (!groupeSearch) return groupes;
    return groupes.filter(g =>
      g.nom_groupe?.toLowerCase().includes(groupeSearch.toLowerCase())
    );
  };

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
        id_groupe: parseInt(formData.id_groupe, 10),
        id_salle: parseInt(formData.id_salle, 10),
        date_cours: new Date().toISOString()
      };

      console.log('Submitting affectation data:', submitData);

      if (currentAffectation) {
        await affectationSalleService.update(currentAffectation.id, submitData);
        toast.success('Attribution modifiée avec succès');
      } else {
        await affectationSalleService.create(submitData);
        toast.success('Attribution créée avec succès');
      }
      setIsModalOpen(false);
      setGroupeSearch('');
      loadData();
    } catch (error) {
      console.error('Error creating/updating affectation:', error);
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (affectation) => {
    console.log('Editing affectation:', affectation);
    setCurrentAffectation(affectation);
    const groupe = groupes.find(g => g.id === affectation.id_groupe);
    setFormData({
      id_groupe: affectation.id_groupe?.toString() || '',
      id_salle: affectation.id_salle?.toString() || ''
    });
    setGroupeSearch(groupe?.nom_groupe || '');
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentAffectation(null);
    setFormData({
      id_groupe: '',
      id_salle: ''
    });
    setGroupeSearch('');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      await affectationSalleService.delete(deleteConfirmation);
      toast.success('Attribution supprimée avec succès');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600">
            <BuildingOfficeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Attribution des Salles</h1>
            <p className="text-sm text-gray-600">Assignez les salles aux groupes</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nouvelle attribution
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-teal-800 uppercase tracking-wider">N°</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-teal-800 uppercase tracking-wider">Groupe</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-teal-800 uppercase tracking-wider">Salle</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-teal-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {affectations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <BuildingOfficeIcon className="mx-auto h-16 w-16 opacity-30 mb-4 text-teal-600" />
                    <p className="text-lg font-medium text-gray-600">Aucune attribution trouvée</p>
                    <p className="text-sm text-gray-500 mt-1">Commencez par ajouter une attribution</p>
                  </td>
                </tr>
              ) : (
                affectations.map((affectation, index) => {
                  // Use nom_groupe from affectation (returned by backend JOIN)
                  const groupeName = affectation.nom_groupe || 'Groupe non défini';
                  const salleName = affectation.nom_salle || 'Salle non définie';

                  console.log(`Affectation ${affectation.id}:`, {
                    id_groupe: affectation.id_groupe,
                    id_salle: affectation.id_salle,
                    nom_groupe: affectation.nom_groupe,
                    nom_salle: affectation.nom_salle
                  });

                  return (
                    <tr key={affectation.id} className="hover:bg-teal-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-50 to-cyan-100 text-teal-700 font-semibold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                            <UserGroupIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {groupeName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="w-5 h-5 text-amber-600" />
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {salleName}
                            {affectation.capacite_max && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({affectation.capacite_max} places)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(affectation)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(affectation.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto my-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-xl sticky top-0">
              <h3 className="text-lg font-semibold">{currentAffectation ? "Modifier l'attribution" : "Nouvelle attribution"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                {/* Groupe - Autocomplete */}
                <div>
                  <label htmlFor="id_groupe" className="block text-sm font-medium text-gray-700 mb-2">
                    Groupe *
                  </label>
                  <input
                    type="text"
                    id="id_groupe"
                    value={groupeSearch}
                    onChange={(e) => {
                      setGroupeSearch(e.target.value);
                      setFormData(prev => ({ ...prev, id_groupe: '' }));
                    }}
                    placeholder="Rechercher un groupe..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  {groupeSearch && (
                    <div className="mt-1 max-h-32 overflow-y-auto border-2 border-gray-200 rounded-xl bg-white shadow-lg">
                      {getFilteredGroupes().length > 0 ? (
                        getFilteredGroupes().map(groupe => (
                          <button
                            key={groupe.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, id_groupe: groupe.id.toString() }));
                              setGroupeSearch(groupe.nom_groupe);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-teal-50 border-b last:border-0 transition-colors"
                          >
                            <div className="font-medium text-sm text-gray-900">{groupe.nom_groupe}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 text-center">Aucun groupe trouvé</div>
                      )}
                    </div>
                  )}
                  {formData.id_groupe && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600 font-medium">Groupe sélectionné</span>
                    </div>
                  )}
                </div>

                {/* Salle - Dropdown */}
                <div>
                  <label htmlFor="id_salle" className="block text-sm font-medium text-gray-700 mb-2">
                    Salle *
                  </label>
                  <select
                    id="id_salle"
                    name="id_salle"
                    value={formData.id_salle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value="">Sélectionner une salle</option>
                    {salles.map(salle => (
                      <option key={salle.id} value={salle.id}>
                        {salle.nom_salle} {salle.capacite_max && `(${salle.capacite_max} places)`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all font-semibold shadow-md"
                >
                  {currentAffectation ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto my-8">
            <div className="p-6">
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-50 to-red-100">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2 text-gray-800">Confirmer la suppression</h3>
              <p className="text-gray-600 text-center mb-6">Êtes-vous sûr de vouloir supprimer cette attribution ?</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setDeleteConfirmation(null)} 
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-md"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributionSalle;
