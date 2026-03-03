import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import salleService from '../../services/salleService';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, BuildingLibraryIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
};

const Salle = () => {
  const [salles, setSalles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSalle, setCurrentSalle] = useState(null);
  const [formData, setFormData] = useState({ nom_salle: '', capacite: '' });
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const loadSalles = async () => {
    try {
      const data = await salleService.getAll();
      setSalles(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des salles');
      console.error(error);
    }
  };

  useEffect(() => {
    loadSalles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        nom_salle: formData.nom_salle.trim(),
        capacite: formData.capacite ? parseInt(formData.capacite, 10) : null
      };
      if (currentSalle) {
        await salleService.update(currentSalle.id, submitData);
        toast.success('Salle modifiée avec succès');
      } else {
        await salleService.create(submitData);
        toast.success('Salle créée avec succès');
      }
      setIsModalOpen(false);
      loadSalles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (salle) => {
    setCurrentSalle(salle);
    setFormData({
      nom_salle: salle.nom_salle,
      capacite: salle.capacite?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentSalle(null);
    setFormData({ nom_salle: '', capacite: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      await salleService.delete(deleteConfirmation);
      toast.success('Salle supprimée avec succès');
      loadSalles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <BuildingLibraryIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
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
            <BuildingLibraryIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Salles</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Gérez les salles de cours</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
            <BuildingLibraryIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Liste des Salles</h2>
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

      {/* Table */}
      <div className="rounded-3xl shadow-sm border overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: COLORS.accent }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>N°</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Nom de la Salle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Capacité</th>
                <th className="px-6 py-4 text-right text-xs font-semibold" style={{ color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salles.map((salle, index) => (
                <tr key={salle.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold" style={{ backgroundColor: COLORS.statBlue, color: COLORS.statBlueText }}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.statGreen }}>
                        <BuildingLibraryIcon className="w-5 h-5" style={{ color: COLORS.statGreenText }} />
                      </div>
                      <span className="ml-3 text-sm font-medium" style={{ color: COLORS.text }}>{salle.nom_salle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: COLORS.statGreen, color: COLORS.statGreenText }}>
                      {salle.capacite || '-'} pers.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === salle.id ? null : salle.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: COLORS.textLight }}
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      {openMenuId === salle.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-20 overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                          <button
                            onClick={() => { handleEdit(salle); setOpenMenuId(null); }}
                            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                            style={{ color: COLORS.text }}
                          >
                            <PencilIcon className="h-4 w-4 mr-3" style={{ color: COLORS.primary }} />
                            Modifier
                          </button>
                          <button
                            onClick={() => { handleDeleteClick(salle.id); setOpenMenuId(null); }}
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
                  <BuildingLibraryIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>{currentSalle ? "Modifier la salle" : "Ajouter une salle"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Nom de la Salle</label>
                  <input
                    type="text"
                    name="nom_salle"
                    value={formData.nom_salle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Capacité</label>
                  <input
                    type="number"
                    name="capacite"
                    value={formData.capacite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    placeholder="Nombre de places"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>{currentSalle ? "Modifier" : "Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{ backgroundColor: '#FEF2F2' }}>
                <XMarkIcon className="w-8 h-8" style={{ color: '#DC2626' }} />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2" style={{ color: COLORS.text }}>Confirmer la suppression</h3>
              <p className="text-center mb-6" style={{ color: COLORS.textLight }}>Êtes-vous sûr de vouloir supprimer cette salle ?</p>
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

export default Salle;
