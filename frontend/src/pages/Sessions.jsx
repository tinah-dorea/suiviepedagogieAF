import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, CalendarIcon, ClockIcon, UserGroupIcon, AcademicCapIcon, XMarkIcon } from '@heroicons/react/24/outline';
import sessionService from '../services/sessionService';
import typeCoursService from '../services/typeCoursService';

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
  statGreen: '#DCFCE7',
  statBlue: '#E0F2FE',
  statPurple: '#F3E8FF',
};

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [formData, setFormData] = useState({
    nom_session: '',
    mois: '',
    annee: '',
    id_type_cours: '',
    date_fin_inscription: '',
    date_debut: '',
    date_fin: '',
    date_exam: '',
    duree_cours: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTeacher = user.service === 'professeurs';

  useEffect(() => {
    const fetchData = async () => {
      try {
        let sessionData;
        if (isTeacher) {
          sessionData = await sessionService.getSessionsByProfesseur();
        } else {
          sessionData = await sessionService.getSessions();
        }

        const typeCoursData = await typeCoursService.getAll();

        setSessions(sessionData);
        setTypeCours(typeCoursData);
      } catch (err) {
        toast.error('Erreur lors du chargement des sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isTeacher]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusInfo = (session) => {
    const today = new Date();
    const endDate = new Date(session.date_fin);
    const startDate = new Date(session.date_debut);

    if (endDate < today) {
      return { label: 'Terminée', bg: COLORS.statusTermine, text: COLORS.statusTermineText };
    } else if (startDate > today) {
      return { label: 'À venir', bg: COLORS.statusAVenir, text: COLORS.statusAVenirText };
    } else {
      return { label: 'En cours', bg: COLORS.statusEnCours, text: COLORS.statusEnCoursText };
    }
  };

  const handleDelete = async (id) => {
    try {
      await sessionService.deleteSession(id);
      toast.success('Session supprimée avec succès');
      setSessions(sessions.filter(session => session.id !== id));
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const confirmDelete = (session) => {
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vous devez être connecté pour effectuer cette action.');
      return;
    }

    try {
      const updatedFormData = {
        ...formData,
        id_type_cours: formData.id_type_cours ? parseInt(formData.id_type_cours, 10) : null,
        annee: formData.annee ? parseInt(formData.annee, 10) : null,
        duree_cours: formData.duree_cours ? parseInt(formData.duree_cours, 10) : null
      };

      if (currentSession) {
        await sessionService.update(currentSession.id, updatedFormData);
        toast.success('Session modifiée avec succès');
        setSessions(sessions.map(s => s.id === currentSession.id ? { ...s, ...updatedFormData } : s));
        setShowEditForm(false);
      } else {
        const newSession = await sessionService.create(updatedFormData);
        toast.success('Session créée avec succès');
        setSessions([...sessions, newSession]);
        setShowAddForm(false);
      }

      setFormData({
        nom_session: '',
        mois: '',
        annee: '',
        id_type_cours: '',
        date_fin_inscription: '',
        date_debut: '',
        date_fin: '',
        date_exam: '',
        duree_cours: ''
      });
      setCurrentSession(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setFormData({
      nom_session: '',
      mois: '',
      annee: '',
      id_type_cours: '',
      date_fin_inscription: '',
      date_debut: '',
      date_fin: '',
      date_exam: '',
      duree_cours: ''
    });
    setCurrentSession(null);
    setShowAddForm(true);
  };

  const openEditForm = (session) => {
    setFormData({
      nom_session: session.nom_session || '',
      mois: session.mois || '',
      annee: session.annee ? session.annee.toString() : '',
      id_type_cours: session.id_type_cours ? session.id_type_cours.toString() : '',
      date_fin_inscription: session.date_fin_inscription ? session.date_fin_inscription.split('T')[0] : '',
      date_debut: session.date_debut ? session.date_debut.split('T')[0] : '',
      date_fin: session.date_fin ? session.date_fin.split('T')[0] : '',
      date_exam: session.date_exam ? session.date_exam.split('T')[0] : '',
      duree_cours: session.duree_cours?.toString() || ''
    });
    setCurrentSession(session);
    setShowEditForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setFormData({
      nom_session: '',
      mois: '',
      annee: '',
      id_type_cours: '',
      date_fin_inscription: '',
      date_debut: '',
      date_fin: '',
      date_exam: '',
      duree_cours: ''
    });
    setCurrentSession(null);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setCurrentSession(null);
    setFormData({
      nom_session: '',
      mois: '',
      annee: '',
      id_type_cours: '',
      date_fin_inscription: '',
      date_debut: '',
      date_fin: '',
      date_exam: '',
      duree_cours: ''
    });
  };

  const toggleActions = (sessionId) => {
    setShowActions(prev => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  // Filter sessions by status and search
  const getFilteredSessions = () => {
    const today = new Date();
    
    const sessionsEnCours = sessions.filter(session => {
      const startDate = new Date(session.date_debut);
      const endDate = new Date(session.date_fin);
      return startDate <= today && endDate >= today;
    });

    const sessionsAVenir = sessions.filter(session => {
      const startDate = new Date(session.date_debut);
      return startDate > today;
    });

    const sessionsTerminees = sessions.filter(session => {
      const endDate = new Date(session.date_fin);
      return endDate < today;
    });

    // Apply search filter
    const filterBySearch = (sessionsList) => {
      if (!searchTerm) return sessionsList;
      return sessionsList.filter(session =>
        session.mois?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.annee?.toString().includes(searchTerm) ||
        session.nom_type_cours?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.nom_session && session.nom_session.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    };

    return {
      enCours: filterBySearch(sessionsEnCours),
      aVenir: filterBySearch(sessionsAVenir),
      terminees: filterBySearch(sessionsTerminees)
    };
  };

  const sessionsByStatus = getFilteredSessions();

  const renderSessionCard = (session) => {
    const status = getStatusInfo(session);
    const typeCoursName = typeCours.find(tc => tc.id === session.id_type_cours)?.nom_type_cours || 'Type non spécifié';

    return (
      <div key={session.id} className="group relative rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-opacity-50" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        <div className="h-2" style={{ backgroundColor: status.text }}></div>

        <div className="px-6 py-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.text }}>
                {session.nom_session || `${session.mois} ${session.annee}`}
              </h3>
              <p className="text-sm" style={{ color: COLORS.textLight }}>{typeCoursName}</p>
            </div>
            <div className="relative">
              <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: status.bg, color: status.text }}>
                {status.label}
              </span>
              <button
                onClick={() => toggleActions(session.id)}
                className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: COLORS.textLight }}
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {showActions[session.id] && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-20 overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                  <button
                    className="block px-4 py-2.5 text-sm w-full text-left transition-colors hover:bg-gray-50"
                    style={{ color: COLORS.text }}
                    onClick={() => {
                      openEditForm(session);
                      toggleActions(session.id);
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-2 inline" style={{ color: COLORS.primary }} />
                    Modifier
                  </button>
                  {!isTeacher && (
                    <button
                      className="block px-4 py-2.5 text-sm w-full text-left transition-colors hover:bg-red-50"
                      style={{ color: '#DC2626' }}
                      onClick={() => {
                        confirmDelete(session);
                        toggleActions(session.id);
                      }}
                    >
                      <TrashIcon className="h-4 w-4 mr-2 inline" />
                      Supprimer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: COLORS.highlight }}>
              <div className="flex-shrink-0">
                <CalendarIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium mb-1" style={{ color: COLORS.textLight }}>Période</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.text }}>{formatDate(session.date_debut)}</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.text }}>au {formatDate(session.date_fin)}</p>
              </div>
            </div>

            {session.date_fin_inscription && (
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: COLORS.accent }}>
                <div className="flex-shrink-0">
                  <ClockIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: COLORS.textLight }}>Inscriptions jusqu'au</p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.text }}>{formatDate(session.date_fin_inscription)}</p>
                </div>
              </div>
            )}

            {session.date_exam && (
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F6FFF8' }}>
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: COLORS.textLight }}>Examen</p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.text }}>{formatDate(session.date_exam)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t" style={{ borderColor: COLORS.border }}>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl" style={{ backgroundColor: COLORS.statBlue }}>
                <div className="text-2xl font-bold" style={{ color: '#0369A1' }}>{session.nb_inscrits || 0}</div>
                <div className="text-xs mt-1" style={{ color: COLORS.textLight }}>Inscrits</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ backgroundColor: COLORS.statGreen }}>
                <div className="text-2xl font-bold" style={{ color: '#16A34A' }}>{session.nb_groupes || 0}</div>
                <div className="text-xs mt-1" style={{ color: COLORS.textLight }}>Groupes</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ backgroundColor: COLORS.statPurple }}>
                <div className="text-2xl font-bold" style={{ color: '#9333EA' }}>{session.duree_cours || 0}h</div>
                <div className="text-xs mt-1" style={{ color: COLORS.textLight }}>Durée</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Sessions</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Organisez et suivez vos sessions de formation</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
              <CalendarIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Liste des Sessions</h2>
          </div>
          {!isTeacher && (
            <button
              onClick={openAddForm}
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
              style={{ background: COLORS.gradient }}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Ajouter une session
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5" style={{ color: COLORS.textLight }} />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.card, color: COLORS.text }}
              placeholder="Rechercher des sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-8">
          {sessionsByStatus.enCours.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: COLORS.statusEnCoursText }}></div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>Sessions en cours ({sessionsByStatus.enCours.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessionsByStatus.enCours.map((session) => renderSessionCard(session))}
              </div>
            </div>
          )}

          {sessionsByStatus.aVenir.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: COLORS.statusAVenirText }}></div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>Sessions à venir ({sessionsByStatus.aVenir.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessionsByStatus.aVenir.map((session) => renderSessionCard(session))}
              </div>
            </div>
          )}

          {sessionsByStatus.terminees.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: COLORS.statusTermineText }}></div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>Sessions terminées ({sessionsByStatus.terminees.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessionsByStatus.terminees.map((session) => renderSessionCard(session))}
              </div>
            </div>
          )}

          {sessionsByStatus.enCours.length === 0 && sessionsByStatus.aVenir.length === 0 && sessionsByStatus.terminees.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-16 w-16 opacity-30 mb-4" style={{ color: COLORS.textLight }} />
              <p className="text-lg font-medium" style={{ color: COLORS.text }}>Aucune session trouvée</p>
              <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Commencez par ajouter une session</p>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto my-8 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.accent }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>Ajouter une session</h3>
              </div>
              <button onClick={closeAddForm} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Nom de la session</label>
                  <input type="text" name="nom_session" value={formData.nom_session} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} placeholder="Ex: Session Février Intensif" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Mois</label>
                  <select name="mois" value={formData.mois} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <option value="">Sélectionnez un mois</option>
                    <option value="janvier">Janvier</option>
                    <option value="février">Février</option>
                    <option value="mars">Mars</option>
                    <option value="avril">Avril</option>
                    <option value="mai">Mai</option>
                    <option value="juin">Juin</option>
                    <option value="juillet">Juillet</option>
                    <option value="août">Août</option>
                    <option value="septembre">Septembre</option>
                    <option value="octobre">Octobre</option>
                    <option value="novembre">Novembre</option>
                    <option value="décembre">Décembre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Année</label>
                  <input type="number" name="annee" value={formData.annee} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} min="2020" max="2100" placeholder="2026" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Type de cours</label>
                  <select name="id_type_cours" value={formData.id_type_cours} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <option value="">Sélectionnez un type de cours</option>
                    {typeCours.map((tc) => (<option key={tc.id} value={tc.id}>{tc.nom_type_cours}</option>))}
                  </select>
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold mb-4 pb-2 border-b flex items-center" style={{ borderColor: COLORS.border, color: COLORS.text }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3" style={{ backgroundColor: COLORS.statGreen, color: '#16A34A' }}>2</span>
                    Dates importantes
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date de début *</label>
                  <input type="date" name="date_debut" value={formData.date_debut} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date de fin *</label>
                  <input type="date" name="date_fin" value={formData.date_fin} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date fin inscription</label>
                  <input type="date" name="date_fin_inscription" value={formData.date_fin_inscription} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date d'examen</label>
                  <input type="date" name="date_exam" value={formData.date_exam} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold mb-4 pb-2 border-b flex items-center" style={{ borderColor: COLORS.border, color: COLORS.text }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3" style={{ backgroundColor: COLORS.statPurple, color: '#9333EA' }}>3</span>
                    Détails
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Durée du cours (heures)</label>
                  <input type="number" name="duree_cours" value={formData.duree_cours} onChange={handleInputChange} min="0" className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} placeholder="Ex: 40" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button type="button" onClick={closeAddForm} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto my-8 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.accent }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
                  <PencilIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>Modifier la session</h3>
              </div>
              <button onClick={closeEditForm} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Nom de la session</label>
                  <input type="text" name="nom_session" value={formData.nom_session} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} placeholder="Ex: Session Février Intensif" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Mois</label>
                  <select name="mois" value={formData.mois} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <option value="">Sélectionnez un mois</option>
                    <option value="janvier">Janvier</option>
                    <option value="février">Février</option>
                    <option value="mars">Mars</option>
                    <option value="avril">Avril</option>
                    <option value="mai">Mai</option>
                    <option value="juin">Juin</option>
                    <option value="juillet">Juillet</option>
                    <option value="août">Août</option>
                    <option value="septembre">Septembre</option>
                    <option value="octobre">Octobre</option>
                    <option value="novembre">Novembre</option>
                    <option value="décembre">Décembre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Année</label>
                  <input type="number" name="annee" value={formData.annee} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} min="2020" max="2100" placeholder="2026" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Type de cours</label>
                  <select name="id_type_cours" value={formData.id_type_cours} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <option value="">Sélectionnez un type de cours</option>
                    {typeCours.map((tc) => (<option key={tc.id} value={tc.id}>{tc.nom_type_cours}</option>))}
                  </select>
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold mb-4 pb-2 border-b flex items-center" style={{ borderColor: COLORS.border, color: COLORS.text }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3" style={{ backgroundColor: COLORS.statGreen, color: '#16A34A' }}>2</span>
                    Dates importantes
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date de début *</label>
                  <input type="date" name="date_debut" value={formData.date_debut} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date de fin *</label>
                  <input type="date" name="date_fin" value={formData.date_fin} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date fin inscription</label>
                  <input type="date" name="date_fin_inscription" value={formData.date_fin_inscription} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Date d'examen</label>
                  <input type="date" name="date_exam" value={formData.date_exam} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold mb-4 pb-2 border-b flex items-center" style={{ borderColor: COLORS.border, color: COLORS.text }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3" style={{ backgroundColor: COLORS.statPurple, color: '#9333EA' }}>3</span>
                    Détails
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Durée du cours (heures)</label>
                  <input type="number" name="duree_cours" value={formData.duree_cours} onChange={handleInputChange} min="0" className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} placeholder="Ex: 40" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button type="button" onClick={closeEditForm} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>Modifier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{ backgroundColor: '#FEF2F2' }}>
                <svg className="w-8 h-8" style={{ color: '#DC2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2" style={{ color: COLORS.text }}>Confirmer la suppression</h3>
              <p className="text-center mb-6" style={{ color: COLORS.textLight }}>Êtes-vous sûr de vouloir supprimer la session "{sessionToDelete?.nom_session || `${sessionToDelete?.mois} ${sessionToDelete?.annee}`}" ?</p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setSessionToDelete(null); }} className="flex-1 px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button onClick={() => handleDelete(sessionToDelete.id)} className="flex-1 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: '#DC2626' }}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
