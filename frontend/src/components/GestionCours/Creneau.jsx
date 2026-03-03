import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import creneauService from '../../services/creneauService';
import horaireService from '../../services/horaireService';
import typeCoursService from '../../services/typeCoursService';
import categorieService from '../../services/categorieService';
import niveauService from '../../services/niveauService';
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
  statOrange: '#FFD6B5',
  statOrangeText: '#A85A2A',
};

const JOURS_SEMAINE = [
  { value: 'lundi', label: 'Lundi' },
  { value: 'mardi', label: 'Mardi' },
  { value: 'mercredi', label: 'Mercredi' },
  { value: 'jeudi', label: 'Jeudi' },
  { value: 'vendredi', label: 'Vendredi' },
  { value: 'samedi', label: 'Samedi' }
];

const Creneau = () => {
  const [creneaux, setCreneaux] = useState([]);
  const [horaires, setHoraires] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCreneau, setCurrentCreneau] = useState(null);
  const [formData, setFormData] = useState({
    id_horaire_cours: '',
    jour_semaine: [],
    heure_debut: '',
    heure_fin: ''
  });
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const loadData = async () => {
    try {
      const [creneauxData, horairesData, typeCoursData, categoriesData, niveauxData] = await Promise.all([
        creneauService.getAll(),
        horaireService.getAll(),
        typeCoursService.getAll(),
        categorieService.getAll(),
        niveauService.getAll()
      ]);
      setCreneaux(creneauxData);
      setHoraires(horairesData);
      setTypeCours(typeCoursData);
      setCategories(categoriesData);
      setNiveaux(niveauxData);
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
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        id_horaire_cours: formData.id_horaire_cours ? parseInt(formData.id_horaire_cours) : null,
        jour_semaine: formData.jour_semaine,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin
      };
      if (currentCreneau) {
        await creneauService.update(currentCreneau.id, submitData);
        toast.success('Créneau modifié avec succès');
      } else {
        await creneauService.create(submitData);
        toast.success('Créneau créé avec succès');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (creneau) => {
    setCurrentCreneau(creneau);
    setFormData({
      id_horaire_cours: creneau.id_horaire_cours?.toString() || '',
      jour_semaine: Array.isArray(creneau.jour_semaine) ? creneau.jour_semaine : [],
      heure_debut: creneau.heure_debut?.substring(0, 5) || '',
      heure_fin: creneau.heure_fin?.substring(0, 5) || ''
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentCreneau(null);
    setFormData({ id_horaire_cours: '', jour_semaine: [], heure_debut: '', heure_fin: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      await creneauService.delete(deleteConfirmation);
      toast.success('Créneau supprimé avec succès');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const getHoraireName = (id) => {
    const hor = horaires.find(h => h.id === id);
    return hor ? `Horaire #${hor.id}` : 'Non défini';
  };

  const formatJours = (jours) => {
    if (!jours || !Array.isArray(jours)) return '-';
    return jours.map(j => JOURS_SEMAINE.find(d => d.value === j)?.label || j).join(', ');
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
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Créneaux</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Définissez les créneaux horaires</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
            <ClockIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Liste des Créneaux</h2>
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
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Jours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Heure Début</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Heure Fin</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Type Cours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Niveaux</th>
                <th className="px-6 py-4 text-right text-xs font-semibold" style={{ color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {creneaux.map((creneau, index) => {
                // Find the associated horaire to get type_cours, categorie, and niveaux
                const horaire = horaires.find(h => h.id === creneau.id_horaire_cours);
                const typeName = horaire?.id_type_cours ? typeCours.find(tc => tc.id === horaire.id_type_cours)?.nom_type_cours || '-' : '-';
                const catName = horaire?.id_categorie ? categories.find(cat => cat.id === horaire.id_categorie)?.nom_categorie || '-' : '-';
                const niveauCodes = Array.isArray(horaire?.id_niveau)
                  ? horaire.id_niveau.map(nid => niveaux.find(n => n.id === nid)?.code || '').filter(Boolean).join(', ') || '-'
                  : '-';
                
                return (
                  <tr key={creneau.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold" style={{ backgroundColor: COLORS.statOrange, color: COLORS.statOrangeText }}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{formatJours(creneau.jour_semaine)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: COLORS.statGreen, color: COLORS.statGreenText }}>
                        {creneau.heure_debut?.substring(0, 5) || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: COLORS.statBlue, color: COLORS.statBlueText }}>
                        {creneau.heure_fin?.substring(0, 5) || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{typeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{catName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{niveauCodes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === creneau.id ? null : creneau.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: COLORS.textLight }}
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      {openMenuId === creneau.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-20 overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                          <button
                            onClick={() => { handleEdit(creneau); setOpenMenuId(null); }}
                            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                            style={{ color: COLORS.text }}
                          >
                            <PencilIcon className="h-4 w-4 mr-3" style={{ color: COLORS.primary }} />
                            Modifier
                          </button>
                          <button
                            onClick={() => { handleDeleteClick(creneau.id); setOpenMenuId(null); }}
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
                );
              })}
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
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>{currentCreneau ? "Modifier le créneau" : "Ajouter un créneau"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Horaire</label>
                  <select
                    name="id_horaire_cours"
                    value={formData.id_horaire_cours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    required
                  >
                    <option value="">Sélectionner un horaire</option>
                    {horaires.map(hor => {
                      // Get type_cours name
                      const typeName = typeCours.find(tc => tc.id === hor.id_type_cours)?.nom_type_cours || 'Non défini';
                      // Get categorie name
                      const catName = categories.find(cat => cat.id === hor.id_categorie)?.nom_categorie || 'Non défini';
                      // Get niveau codes
                      const niveauCodes = Array.isArray(hor.id_niveau)
                        ? hor.id_niveau.map(nid => niveaux.find(n => n.id === nid)?.code || '').filter(Boolean).join(', ')
                        : 'Non défini';
                      
                      return (
                        <option key={hor.id} value={hor.id}>
                          {typeName} | {catName} | {niveauCodes}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                    L'horaire inclut le type de cours, la catégorie et les niveaux
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Jours de la semaine</label>
                  <div className="grid grid-cols-2 gap-3">
                    {JOURS_SEMAINE.map(jour => (
                      <label key={jour.value} className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-gray-50" style={{ backgroundColor: formData.jour_semaine.includes(jour.value) ? COLORS.accent : COLORS.bg }}>
                        <input
                          type="checkbox"
                          name="jour_semaine"
                          value={jour.value}
                          checked={formData.jour_semaine.includes(jour.value)}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm font-medium" style={{ color: COLORS.text }}>{jour.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Heure de début</label>
                    <input
                      type="time"
                      name="heure_debut"
                      value={formData.heure_debut}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Heure de fin</label>
                    <input
                      type="time"
                      name="heure_fin"
                      value={formData.heure_fin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>{currentCreneau ? "Modifier" : "Ajouter"}</button>
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
              <p className="text-center mb-6" style={{ color: COLORS.textLight }}>Êtes-vous sûr de vouloir supprimer ce créneau ?</p>
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

export default Creneau;
