import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sessionService from '../../services/sessionService';
import typeCoursService from '../../services/typeCoursService';
import { PencilIcon, TrashIcon, EllipsisHorizontalIcon, CalendarIcon, ClockIcon, AcademicCapIcon, PlusIcon } from '@heroicons/react/24/outline';

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
  statusEnCours: '#B5EAD7',
  statusEnCoursText: '#2D7A5F',
  statusAVenir: '#C7CEEA',
  statusAVenirText: '#5A5F8C',
  statusTermine: '#E2E2E2',
  statusTermineText: '#6B6B6B',
  gradient: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)',
};

const Session = () => {
  const [sessions, setSessions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formData, setFormData] = useState({
    mois: '',
    annee: new Date().getFullYear(),
    id_type_cours: '',
    date_fin_inscription: '',
    date_debut: '',
    date_fin: '',
    date_exam: '',
    nom_session: '',
    duree_cours: 0
  });
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [error, setError] = useState('');

  // Charger les données
  const loadSessions = async () => {
    try {
      const data = await sessionService.getAll();
      setSessions(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des sessions');
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

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadSessions(), loadTypeCours()]);
      setLoading(false);
    };
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
      if (currentSession) {
        await sessionService.update(currentSession.id, formData);
        toast.success('Session modifiée avec succès');
      } else {
        await sessionService.create(formData);
        toast.success('Session créée avec succès');
      }
      setIsModalOpen(false);
      setCurrentSession(null);
      setFormData({ nom_session: '', date_debut: '', date_fin: '' });
      setError('');
      loadSessions();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (session) => {
    setCurrentSession(session);
    setFormData({
      mois: session.mois || '',
      annee: session.annee || new Date().getFullYear(),
      id_type_cours: session.id_type_cours || '',
      date_fin_inscription: session.date_fin_inscription ? session.date_fin_inscription.split('T')[0] : '',
      date_debut: session.date_debut ? session.date_debut.split('T')[0] : '',
      date_fin: session.date_fin ? session.date_fin.split('T')[0] : '',
      date_exam: session.date_exam ? session.date_exam.split('T')[0] : '',
      nom_session: session.nom_session || '',
      duree_cours: session.duree_cours || 0
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentSession(null);
    setFormData({
      mois: '',
      annee: new Date().getFullYear(),
      id_type_cours: '',
      date_fin_inscription: '',
      date_debut: '',
      date_fin: '',
      date_exam: '',
      nom_session: '',
      duree_cours: 0
    });
    setError('');
    setIsModalOpen(true);
  };

  // Supprimer une session - préparer la confirmation
  const prepareDelete = (session) => {
    setSessionToDelete(session);
    setShowConfirmation(true);
    setOpenMenuId(null);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    try {
      await sessionService.remove(sessionToDelete.id);
      toast.success('Session supprimée avec succès');
      loadSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setShowConfirmation(false);
      setSessionToDelete(null);
    }
  };

  const getStatusInfo = (session) => {
    const today = new Date();
    const debut = new Date(session.date_debut);
    const fin = new Date(session.date_fin);
    
    if (fin < today) {
      return { label: 'Terminée', bg: COLORS.statusTermine, text: COLORS.statusTermineText };
    } else if (debut > today) {
      return { label: 'À venir', bg: COLORS.statusAVenir, text: COLORS.statusAVenirText };
    } else {
      return { label: 'En cours', bg: COLORS.statusEnCours, text: COLORS.statusEnCoursText };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
            <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
          </div>
          <p className="mt-4 text-lg font-medium" style={{ color: COLORS.text }}>Chargement des sessions...</p>
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
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Sessions</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Gérez vos sessions de formation</p>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
            <CalendarIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Liste des Sessions</h2>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
          style={{ background: COLORS.gradient }}
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Ajouter une session
        </button>
      </div>

      {/* Cartes Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => {
          const status = getStatusInfo(session);

          return (
            <div
              key={session.id}
              className="rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-opacity-50"
              style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
            >
              {/* Status Bar */}
              <div className="h-2" style={{ backgroundColor: status.text }}></div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: COLORS.text }}>
                      {session.nom_session || `${session.mois} ${session.annee}`}
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.textLight }}>{session.nom_type_cours || '—'}</p>
                  </div>
                  <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: status.bg, color: status.text }}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2 text-sm p-2.5 rounded-xl" style={{ backgroundColor: COLORS.highlight }}>
                    <CalendarIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                    <span style={{ color: COLORS.text }}>Début: {new Date(session.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2.5 rounded-xl" style={{ backgroundColor: COLORS.highlight }}>
                    <CalendarIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                    <span style={{ color: COLORS.text }}>Fin: {new Date(session.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {session.date_exam && (
                    <div className="flex items-center gap-2 text-sm p-2.5 rounded-xl" style={{ backgroundColor: COLORS.accent }}>
                      <AcademicCapIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                      <span style={{ color: COLORS.text }}>Examen: {new Date(session.date_exam).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                  {session.duree_cours > 0 && (
                    <div className="flex items-center gap-2 text-sm p-2.5 rounded-xl" style={{ backgroundColor: COLORS.accent }}>
                      <ClockIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                      <span style={{ color: COLORS.text }}>Durée: {session.duree_cours}h</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(session)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => prepareDelete(session)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirmer la suppression</h3>
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer la session "{sessionToDelete?.nom_session}" ?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md my-8 mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {currentSession ? "Modifier la session" : "Ajouter une session"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de la session</label>
                <input
                  type="text"
                  name="nom_session"
                  value={formData.nom_session}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Ex: Session février intensif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mois</label>
                  <input
                    type="text"
                    name="mois"
                    value={formData.mois}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                    placeholder="Ex: Février"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Année</label>
                  <input
                    type="number"
                    name="annee"
                    value={formData.annee}
                    onChange={handleInputChange}
                    required
                    min="2020"
                    max="2100"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type de cours</label>
                <select
                  name="id_type_cours"
                  value={formData.id_type_cours}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
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
                <label className="block text-sm font-medium text-gray-700">Date fin inscription</label>
                <input
                  type="date"
                  name="date_fin_inscription"
                  value={formData.date_fin_inscription}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date d'examen</label>
                <input
                  type="date"
                  name="date_exam"
                  value={formData.date_exam}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Durée du cours (heures)</label>
                <input
                  type="number"
                  name="duree_cours"
                  value={formData.duree_cours}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              {error && (
                <div className="text-red-500 bg-red-100 p-2 rounded text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentSession(null);
                    setFormData({
                      mois: '',
                      annee: new Date().getFullYear(),
                      id_type_cours: '',
                      date_fin_inscription: '',
                      date_debut: '',
                      date_fin: '',
                      date_exam: '',
                      nom_session: '',
                      duree_cours: 0
                    });
                    setError('');
                  }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  {currentSession ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;