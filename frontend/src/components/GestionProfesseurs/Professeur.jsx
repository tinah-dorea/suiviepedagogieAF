import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import professeurService from '../../services/professeurService';
import { PencilIcon, TrashIcon, EllipsisHorizontalIcon, AcademicCapIcon, UserCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
};

const PROFESSOR_SERVICE = 'Professeurs';

const buildEmptyForm = () => ({
  nom: '',
  prenom: '',
  age: '',
  adresse: '',
  tel: '',
  email: '',
  mot_passe: '',
  role: 'Professeurs',
});

const normalizeText = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = value.toString().trim();
  return trimmed === '' ? null : trimmed;
};

const toNullableInt = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const sanitizePayload = (data) => ({
  nom: normalizeText(data.nom) || '',
  prenom: normalizeText(data.prenom) || '',
  age: toNullableInt(data.age),
  adresse: normalizeText(data.adresse),
  tel: normalizeText(data.tel),
  email: normalizeText(data.email) || '',
  mot_passe: normalizeText(data.mot_passe),
  role: 'Professeurs',
});

const Professeur = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProfesseur, setCurrentProfesseur] = useState(null);
  const [formData, setFormData] = useState(buildEmptyForm());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // État pour suivre si les données ont été chargées
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const loadInitialData = async () => {
      if (hasLoaded) return; // Empêche le chargement multiple
      
      setLoading(true);
      try {
        await Promise.all([refreshProfesseurs()]);
        if (!cancelled) {
          setHasLoaded(true);
        }
      } catch (err) {
        console.error('Erreur chargement données:', err);
        if (!cancelled) {
          setError("Erreur lors du chargement des données.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [hasLoaded]); // Ajout de hasLoaded comme dépendance

  const refreshProfesseurs = async () => {
    try {
      const response = await professeurService.getProfesseurs();
      console.log('Professeurs response:', response);
      
      let dataArray = [];
      if (response && response.data) {
        dataArray = response.data;
      } else if (Array.isArray(response)) {
        dataArray = response;
      }
      
      // Map the data to handle null/undefined values
      const mappedData = dataArray.map(prof => ({
        ...prof,
        nom: prof.nom_employe || prof.nom || '',
        prenom: prof.prenom_employe || prof.prenom || '',
        tel: prof.tel_employe || prof.tel || '',
        email: prof.email_employe || prof.email || ''
      }));
      
      console.log('Mapped professeurs:', mappedData);
      setProfesseurs(mappedData);
    } catch (error) {
      console.error('Error fetching professeurs:', error);
      setError(error.response?.data?.message || 'Erreur lors du chargement des professeurs');
    }
  };

  const handleEdit = (professeur) => {
    openModal('edit', professeur);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await professeurService.deleteEmploye(id);
      toast.success('Professeur supprimé avec succès');
      await refreshProfesseurs();
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError("Erreur lors de la suppression.");
      toast.error(err.response?.data?.message || "Une erreur est survenue lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, professeur = null) => {
    setModalMode(mode);
    setError('');

    if (mode === 'edit' && professeur) {
      setCurrentProfesseur(professeur);
      setFormData({
        nom: professeur.nom,
        prenom: professeur.prenom,
        age: professeur.age || '',
        adresse: professeur.adresse || '',
        tel: professeur.tel || '',
        email: professeur.email,
        mot_passe: '',
        role: 'Professeurs',
      });
    } else {
      setCurrentProfesseur(null);
      setFormData(buildEmptyForm());
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentProfesseur(null);
    setFormData(buildEmptyForm());
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = sanitizePayload(formData);
      console.log('[Professeur] Payload envoyé:', payload);

      if (modalMode === 'edit') {
        if (!payload.mot_passe) {
          delete payload.mot_passe;
        }
        console.log('[Professeur] Modification du professeur ID:', currentProfesseur.id);
        const response = await professeurService.updateEmploye(currentProfesseur.id, payload);
        console.log('[Professeur] Réponse modification:', response);
        toast.success('Professeur modifié avec succès');
      } else {
        if (!payload.mot_passe) {
          throw new Error("Un mot de passe est requis pour créer un professeur.");
        }
        console.log('[Professeur] Création du professeur');
        const response = await professeurService.createEmploye(payload);
        console.log('[Professeur] Réponse création:', response);
        toast.success('Professeur créé avec succès');
      }

      console.log('[Professeur] Rafraîchissement de la liste...');
      await refreshProfesseurs();
      console.log('[Professeur] Fermeture du modal...');
      closeModal();
    } catch (err) {
      console.error('[Professeur] Erreur lors de la soumission:', err);
      console.error('[Professeur] Détails erreur:', err.response?.data);
      setError(err.response?.data?.message || err.message || "Une erreur est survenue.");
      toast.error(err.response?.data?.message || err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredProfesseurs = professeurs;

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Professeurs</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Gérez votre équipe enseignante</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => openModal('add')}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
          style={{ background: COLORS.gradient }}
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Ajouter Professeur
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
              <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
            </div>
            <p className="mt-4 text-lg font-medium" style={{ color: COLORS.text }}>Chargement...</p>
          </div>
        </div>
      )}

      {error && !modalOpen && (
        <div className="p-4 rounded-2xl flex items-start gap-3 mb-6" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong className="font-semibold">Erreur! </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-opacity-50 overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: COLORS.accent }}>
              <tr>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: COLORS.text }}>N°</th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Nom</th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Prénom</th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Email</th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Téléphone</th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfesseurs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <AcademicCapIcon className="mx-auto h-16 w-16 opacity-30 mb-4" style={{ color: COLORS.primary }} />
                    <p className="text-lg font-medium" style={{ color: COLORS.text }}>Aucun professeur trouvé</p>
                    <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Commencez par ajouter un professeur</p>
                  </td>
                </tr>
              ) : (
                filteredProfesseurs.map((prof, index) => (
                  <tr key={prof.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center" style={{ color: COLORS.textLight }}>{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: COLORS.text }}>{prof.nom || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{prof.prenom || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{prof.email || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{prof.tel || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === prof.id ? null : prof.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: COLORS.textLight }}
                        >
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>

                        {openMenuId === prof.id && (
                          <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg border z-20 overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                            <button
                              onClick={() => {
                                handleEdit(prof);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                              style={{ color: COLORS.text }}
                            >
                              <PencilIcon className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                              Éditer
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(prof.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
                              style={{ color: '#DC2626' }}
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-auto my-8 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.accent }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
                  <AcademicCapIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>
                  {modalMode === 'add' ? 'Ajouter un Professeur' : 'Modifier le Professeur'}
                </h3>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                {error && (
                  <div className="p-4 rounded-2xl flex items-start gap-3" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Nom *</label>
                    <input
                      name="nom"
                      placeholder="Nom *"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Prénom *</label>
                    <input
                      name="prenom"
                      placeholder="Prénom *"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Email *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Téléphone</label>
                  <input
                    name="tel"
                    placeholder="Téléphone"
                    value={formData.tel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Adresse</label>
                  <input
                    name="adresse"
                    placeholder="Adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Âge</label>
                  <input
                    name="age"
                    type="number"
                    placeholder="Âge"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    {modalMode === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe (optionnel)'}
                  </label>
                  <input
                    name="mot_passe"
                    type="password"
                    placeholder={modalMode === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe (optionnel)'}
                    value={formData.mot_passe}
                    onChange={handleInputChange}
                    required={modalMode === 'add'}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  style={{ background: COLORS.gradient }}
                >
                  {isSubmitting ? 'Enregistrement...' : modalMode === 'add' ? 'Ajouter' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Professeur;