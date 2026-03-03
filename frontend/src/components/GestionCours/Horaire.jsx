import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import horaireService from '../../services/horaireService';
import niveauService from '../../services/niveauService';
import categorieService from '../../services/categorieService';
import typeCoursService from '../../services/typeCoursService';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

const Horaire = () => {
  const [horaires, setHoraires] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHoraire, setCurrentHoraire] = useState(null);
  const [formData, setFormData] = useState({
    id_niveau: [],
    id_categorie: '',
    id_type_cours: '',
    duree_heures: '',
    duree_semaines: ''
  });
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const loadData = async () => {
    try {
      const [horairesData, niveauxData, categoriesData, typeCoursData] = await Promise.all([
        horaireService.getAll(),
        niveauService.getAll(),
        categorieService.getAll(),
        typeCoursService.getAll()
      ]);
      setHoraires(horairesData);
      setNiveaux(niveauxData);
      setCategories(categoriesData);
      setTypeCours(typeCoursData);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'id_niveau' && type === 'checkbox') {
      const niveauId = parseInt(value, 10);
      setFormData(prev => ({
        ...prev,
        id_niveau: checked
          ? [...prev.id_niveau, niveauId]
          : prev.id_niveau.filter(id => id !== niveauId)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        id_niveau: formData.id_niveau.length > 0 ? formData.id_niveau : null,
        id_categorie: formData.id_categorie ? parseInt(formData.id_categorie) : null,
        id_type_cours: formData.id_type_cours ? parseInt(formData.id_type_cours) : null,
        duree_heures: formData.duree_heures ? parseInt(formData.duree_heures) : null,
        duree_semaines: formData.duree_semaines ? parseInt(formData.duree_semaines) : null
      };
      if (currentHoraire) {
        await horaireService.update(currentHoraire.id, submitData);
        toast.success('Horaire modifié avec succès');
      } else {
        await horaireService.create(submitData);
        toast.success('Horaire créé avec succès');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (horaire) => {
    setCurrentHoraire(horaire);
    setFormData({
      id_niveau: Array.isArray(horaire.id_niveau) ? horaire.id_niveau : [],
      id_categorie: horaire.id_categorie?.toString() || '',
      id_type_cours: horaire.id_type_cours?.toString() || '',
      duree_heures: horaire.duree_heures?.toString() || '',
      duree_semaines: horaire.duree_semaines?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentHoraire(null);
    setFormData({ id_niveau: [], id_categorie: '', id_type_cours: '', duree_heures: '', duree_semaines: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      await horaireService.delete(deleteConfirmation);
      toast.success('Horaire supprimé avec succès');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const getNiveauName = (id) => {
    if (!id || (Array.isArray(id) && id.length === 0)) return 'Non défini';
    const niveauIds = Array.isArray(id) ? id : [id];
    return niveauIds
      .map(nid => {
        const niv = niveaux.find(n => n.id === nid);
        return niv ? niv.code : null;
      })
      .filter(Boolean)
      .join(', ') || 'Non défini';
  };

  const getCategorieName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.nom_categorie : 'Non défini';
  };

  const getTypeCoursName = (id) => {
    const tc = typeCours.find(t => t.id === id);
    return tc ? tc.nom_type_cours : 'Non défini';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <ClockIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
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
            <ClockIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Horaires</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Définissez les horaires de cours</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
            <ClockIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Liste des Horaires</h2>
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
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Niveau</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Type de cours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Durée (heures)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Durée (semaines)</th>
                <th className="px-6 py-4 text-right text-xs font-semibold" style={{ color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {horaires.map((horaire, index) => (
                <tr key={horaire.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold" style={{ backgroundColor: COLORS.statPurple, color: COLORS.statPurpleText }}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{getNiveauName(horaire.id_niveau)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{getCategorieName(horaire.id_categorie)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{getTypeCoursName(horaire.id_type_cours)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: COLORS.statGreen, color: COLORS.statGreenText }}>
                      {horaire.duree_heures || '-'}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: COLORS.statBlue, color: COLORS.statBlueText }}>
                      {horaire.duree_semaines || '-'}s
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === horaire.id ? null : horaire.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: COLORS.textLight }}
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      {openMenuId === horaire.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-20 overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                          <button
                            onClick={() => { handleEdit(horaire); setOpenMenuId(null); }}
                            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                            style={{ color: COLORS.text }}
                          >
                            <PencilIcon className="h-4 w-4 mr-3" style={{ color: COLORS.primary }} />
                            Modifier
                          </button>
                          <button
                            onClick={() => { handleDeleteClick(horaire.id); setOpenMenuId(null); }}
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
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>{currentHoraire ? "Modifier l'horaire" : "Ajouter un horaire"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Niveaux</label>
                  <div className="border-2 rounded-xl p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {niveaux.map(niv => (
                        <label key={niv.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            name="id_niveau"
                            value={niv.id.toString()}
                            checked={formData.id_niveau.includes(niv.id)}
                            onChange={handleInputChange}
                            className="w-4 h-4 rounded border-2 focus:ring-2 focus:ring-opacity-50 transition-all"
                            style={{
                              borderColor: COLORS.border,
                              accentColor: COLORS.primary
                            }}
                          />
                          <span className="text-sm font-medium" style={{ color: COLORS.text }}>{niv.code}</span>
                        </label>
                      ))}
                    </div>
                    {formData.id_niveau.length === 0 && (
                      <p className="text-xs mt-2" style={{ color: COLORS.textLight }}>Sélectionnez un ou plusieurs niveaux</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Catégorie</label>
                  <select
                    name="id_categorie"
                    value={formData.id_categorie}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom_categorie}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Type de cours</label>
                  <select
                    name="id_type_cours"
                    value={formData.id_type_cours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  >
                    <option value="">Sélectionner un type de cours</option>
                    {typeCours.map(tc => (
                      <option key={tc.id} value={tc.id}>{tc.nom_type_cours}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Durée (heures)</label>
                    <input
                      type="number"
                      name="duree_heures"
                      value={formData.duree_heures}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Durée (semaines)</label>
                    <input
                      type="number"
                      name="duree_semaines"
                      value={formData.duree_semaines}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>{currentHoraire ? "Modifier" : "Ajouter"}</button>
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
              <p className="text-center mb-6" style={{ color: COLORS.textLight }}>Êtes-vous sûr de vouloir supprimer cet horaire ?</p>
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

export default Horaire;
