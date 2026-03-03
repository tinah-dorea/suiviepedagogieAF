import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import typeCoursService from '../../services/typeCoursService';
import typeServiceService from '../../services/typeServiceService';
import { PencilIcon, TrashIcon, EllipsisHorizontalIcon, AcademicCapIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Modern Pastel Palette
const COLORS = {
  bg: '#F8F9FA',
  card: '#FFFFFF',
  primary: '#6B9080',
  secondary: '#A4C3B2',
  accent: '#EAF4F4',
  highlight: '#F6FFF8',
  text: '#2D3436',
  textLight: '#636E72',
  border: '#E8E8E8',
  gradient: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)',
  statBlue: '#C7CEEA',
  statBlueText: '#5A5F8C',
  statGreen: '#B5EAD7',
  statGreenText: '#2D7A5F',
  statPurple: '#E5C6FF',
  statPurpleText: '#6B4C7A',
};

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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

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
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vous devez être connecté pour effectuer cette action.');
      return;
    }
    
    try {
      const submitData = {
        nom_type_cours: formData.nom_type_cours.trim(),
        id_type_service: formData.id_type_service ? parseInt(formData.id_type_service, 10) : null
      };
      
      console.log('Submitting TypeCours data:', submitData);
      
      if (currentTypeCours) {
        console.log('Updating type cours:', currentTypeCours.id);
        const response = await typeCoursService.update(currentTypeCours.id, submitData);
        console.log('Update response:', response);
        toast.success('Type de cours modifié avec succès');
      } else {
        console.log('Creating type cours');
        const response = await typeCoursService.create(submitData);
        console.log('Create response:', response);
        toast.success('Type de cours créé avec succès');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error submitting type cours:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Une erreur est survenue';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(e => e.message).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (typeCours) => {
    setCurrentTypeCours(typeCours);
    setFormData({
      nom_type_cours: typeCours.nom_type_cours || '',
      id_type_service: typeCours.id_type_service?.toString() || ''
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

  const handleDeleteClick = (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      await typeCoursService.delete(deleteConfirmation);
      toast.success('Type de cours supprimé avec succès');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  // Obtenir le nom du service pour un ID donné
  const getServiceName = (serviceId) => {
    const service = typeServices.find(s => s.id === serviceId);
    return service ? service.nom_service : 'Non défini';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Types de Cours</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Définissez les types de cours disponibles</p>
          </div>
        </div>
      </div>

      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
            <AcademicCapIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Liste des Types de Cours</h2>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
          style={{ background: COLORS.gradient }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      {/* Table moderne */}
      <div className="rounded-3xl shadow-sm border overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: COLORS.accent }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>N°</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Nom du Type de Cours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Service</th>
                <th className="px-6 py-4 text-right text-xs font-semibold" style={{ color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {typeCours.map((type, index) => (
                <tr key={type.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold" style={{ backgroundColor: COLORS.statPurple, color: COLORS.statPurpleText }}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.statBlue }}>
                        <AcademicCapIcon className="w-5 h-5" style={{ color: COLORS.statBlueText }} />
                      </div>
                      <span className="ml-3 text-sm font-medium" style={{ color: COLORS.text }}>{type.nom_type_cours}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: COLORS.statGreen, color: COLORS.statGreenText }}>
                      {getServiceName(type.id_type_service)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === type.id ? null : type.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: COLORS.textLight }}
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>

                      {openMenuId === type.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-20 overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                          <button
                            onClick={() => {
                              handleEdit(type);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                            style={{ color: COLORS.text }}
                          >
                            <PencilIcon className="h-4 w-4 mr-3" style={{ color: COLORS.primary }} />
                            Modifier
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteClick(type.id);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
                            style={{ color: '#DC2626' }}
                          >
                            <TrashIcon className="h-4 w-4 mr-3" />
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-auto my-8 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.accent }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
                  <AcademicCapIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>{currentTypeCours ? "Modifier le type de cours" : "Ajouter un type de cours"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label htmlFor="id_type_service" className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    Service
                  </label>
                  <select
                    id="id_type_service"
                    name="id_type_service"
                    value={formData.id_type_service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
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
                  <label htmlFor="nom_type_cours" className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    Nom du Type de Cours
                  </label>
                  <input
                    type="text"
                    id="nom_type_cours"
                    name="nom_type_cours"
                    value={formData.nom_type_cours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>{currentTypeCours ? "Modifier" : "Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{ backgroundColor: '#FEF2F2' }}>
                <XMarkIcon className="w-8 h-8" style={{ color: '#DC2626' }} />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2" style={{ color: COLORS.text }}>Confirmer la suppression</h3>
              <p className="text-center mb-6" style={{ color: COLORS.textLight }}>Êtes-vous sûr de vouloir supprimer ce type de cours ?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmation(null)} className="flex-1 px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button onClick={confirmDelete} className="flex-1 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: '#DC2626' }}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeCours;