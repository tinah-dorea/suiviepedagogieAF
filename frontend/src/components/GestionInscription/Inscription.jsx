import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import inscriptionService from '../../services/inscriptionService';
import apprenantService from '../../services/apprenantService';
import niveauService from '../../services/niveauService';
import categorieService from '../../services/categorieService';
import groupeService from '../../services/groupeService';
import creneauService from '../../services/creneauService';
import sessionService from '../../services/sessionService';
import motivationService from '../../services/motivationService';
import { PencilIcon, TrashIcon, UserGroupIcon, XMarkIcon, AcademicCapIcon, CalendarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../context/NotificationContext';

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
  statOrange: '#FFD6B5',
  statOrangeText: '#A85A2A',
};

const Inscription = () => {
  const notification = useNotification();
  const [inscriptions, setInscriptions] = useState([]);
  const [apprenants, setApprenants] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [motivations, setMotivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInscription, setCurrentInscription] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [inscriptionToDelete, setInscriptionToDelete] = useState(null);
  const [filtreNom, setFiltreNom] = useState('');
  const [apprenantSuggestions, setApprenantSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtreSession, setFiltreSession] = useState('');
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionSuggestions, setSessionSuggestions] = useState([]);
  const [showSessionSuggestions, setShowSessionSuggestions] = useState(false);
  const [filtreGroupe, setFiltreGroupe] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loadError, setLoadError] = useState('');
  const [formData, setFormData] = useState({
    id_apprenant: '',
    id_employe: null,
    id_session: '',
    id_motivation: null,
    num_carte: '',
    ticket: '',
    etat_inscription: 'inscription',
    id_niveau: '',
    id_categorie: '',
    id_creneau: '',
    id_groupe: '',
    validation_examen: false,
    note: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoadError('');
      const [inscData, appData, nivData, catData, grpData, crData, sesData, motivData] = await Promise.all([
        inscriptionService.getAll(),
        apprenantService.getAll(),
        niveauService.getAll(),
        categorieService.getAll(),
        groupeService.getAll(),
        creneauService.getAll(),
        sessionService.getAll(),
        motivationService.getAll()
      ]);
      setInscriptions(inscData);
      setApprenants(appData);
      setNiveaux(nivData);
      setCategories(catData);
      setGroupes(grpData);
      setCreneaux(crData);
      setSessions(sesData);
      setMotivations(motivData);
      setLoading(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des données. Veuillez vérifier votre connexion.';
      setLoadError('✗ ' + errorMsg);
      notification.error(errorMsg);
      console.error(error);
      setLoading(false);
    }
  };

  // Autocomplete pour apprenant
  const handleFiltreNomChange = (e) => {
    const value = e.target.value;
    setFiltreNom(value);

    if (value.trim()) {
      const filtered = apprenants.filter(app =>
        `${app.nom} ${app.prenom}`.toLowerCase().includes(value.toLowerCase()) ||
        app.email?.toLowerCase().includes(value.toLowerCase())
      );
      setApprenantSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setApprenantSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectApprenant = (apprenant) => {
    setFormData(prev => ({
      ...prev,
      id_apprenant: apprenant.id
    }));
    setFiltreNom(`${apprenant.nom} ${apprenant.prenom}`);
    setShowSuggestions(false);
  };

  // Session search for filter
  const handleSessionSearchChange = (e) => {
    const value = e.target.value;
    setSessionSearch(value);

    if (value.trim()) {
      const filtered = sessions.filter(session =>
        session.nom_session?.toLowerCase().includes(value.toLowerCase()) ||
        session.mois?.toLowerCase().includes(value.toLowerCase()) ||
        session.annee?.toString().includes(value)
      );
      setSessionSuggestions(filtered);
      setShowSessionSuggestions(true);
    } else {
      setSessionSuggestions([]);
      setShowSessionSuggestions(false);
    }
  };

  const selectFiltreSession = (session) => {
    setFiltreSession(session.id.toString());
    setSessionSearch('');
    setShowSessionSuggestions(false);
    setFiltreGroupe(''); // Reset group filter when session changes
  };

  // Filter groups based on selected session
  // Groups are linked to session through: session → horaire_cours → creneau → groupe
  const getFilteredGroupsForSession = () => {
    if (!filtreSession) return groupes;
    
    const session = sessions.find(s => s.id === parseInt(filtreSession));
    if (!session || !session.id_type_cours) return [];
    
    // Get creneaux for this session's type_cours
    const sessionCreneaux = creneaux.filter(c => c.id_type_cours === session.id_type_cours);
    const creneauIds = sessionCreneaux.map(c => c.id);
    
    // Filter groups that have creneaux matching the session
    return groupes.filter(g => creneauIds.includes(g.id_creneau));
  };

  // Autocomplete pour session
  const handleFiltreSessionChange = (e) => {
    const value = e.target.value;
    setFiltreSession(value);

    if (value.trim()) {
      const filtered = sessions.filter(session => {
        const sessionName = session.nom_session || `${session.mois} ${session.annee}`;
        return sessionName.toLowerCase().includes(value.toLowerCase());
      });
      setSessionSuggestions(filtered);
      setShowSessionSuggestions(true);
    } else {
      setSessionSuggestions([]);
      setShowSessionSuggestions(false);
    }
  };

  const selectSession = (session) => {
    setFormData(prev => ({
      ...prev,
      id_session: session.id.toString()
    }));
    setFiltreSession(session.nom_session || `${session.mois} ${session.annee}`);
    setShowSessionSuggestions(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Reset creneau when session or niveau changes
    if (name === 'id_session' || name === 'id_niveau') {
      setFormData(prev => ({
        ...prev,
        id_creneau: '',
        [name]: value
      }));
    }
  };

  const handleAdd = () => {
    setCurrentInscription(null);
    setFormData({
      id_apprenant: '',
      id_employe: null,
      id_session: '',
      id_motivation: null,
      num_carte: '',
      ticket: '',
      etat_inscription: 'inscription',
      id_niveau: '',
      id_categorie: '',
      id_creneau: '',
      id_groupe: '',
      validation_examen: false,
      note: ''
    });
    setFiltreNom('');
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleEdit = (inscription) => {
    setCurrentInscription(inscription);
    const apprenant = apprenants.find(a => a.id === inscription.id_apprenant);
    setFiltreNom(apprenant ? `${apprenant.nom} ${apprenant.prenom}` : '');
    setFormData({
      id_apprenant: inscription.id_apprenant || '',
      id_employe: inscription.id_employe || null,
      id_session: inscription.id_session || '',
      id_motivation: inscription.id_motivation || null,
      num_carte: inscription.num_carte || '',
      ticket: inscription.ticket || '',
      etat_inscription: inscription.etat_inscription || 'inscription',
      id_niveau: inscription.id_niveau || '',
      id_categorie: inscription.id_categorie || '',
      id_creneau: inscription.id_creneau || '',
      id_groupe: inscription.id_groupe || '',
      validation_examen: inscription.validation_examen || false,
      note: inscription.note || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    if (!formData.id_apprenant) {
      const msg = 'Veuillez sélectionner un apprenant';
      setFormError('✗ ' + msg);
      notification.error(msg);
      return;
    }

    if (!formData.id_session) {
      const msg = 'Veuillez sélectionner une session';
      setFormError('✗ ' + msg);
      notification.error(msg);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        id_apprenant: parseInt(formData.id_apprenant),
        id_employe: formData.id_employe ? parseInt(formData.id_employe) : null,
        id_session: formData.id_session ? parseInt(formData.id_session) : null,
        id_motivation: formData.id_motivation ? parseInt(formData.id_motivation) : null,
        id_niveau: formData.id_niveau ? parseInt(formData.id_niveau) : null,
        id_categorie: formData.id_categorie ? parseInt(formData.id_categorie) : null,
        id_creneau: formData.id_creneau ? parseInt(formData.id_creneau) : null,
        id_groupe: formData.id_groupe ? parseInt(formData.id_groupe) : null,
        note: formData.note ? parseFloat(formData.note) : null
      };

      if (currentInscription) {
        await inscriptionService.update(currentInscription.id, dataToSend);
        setFormSuccess('✓ Inscription modifiée avec succès');
        notification.success('Inscription modifiée avec succès');
      } else {
        await inscriptionService.create(dataToSend);
        setFormSuccess('✓ Inscription créée avec succès');
        notification.success('Inscription créée avec succès');
      }
      setIsModalOpen(false);
      setCurrentInscription(null);
      loadAllData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Une erreur est survenue lors de l'enregistrement";
      setFormError('✗ ' + errorMsg);
      notification.error(errorMsg);
      console.error(error);
    }
  };

  const prepareDelete = (inscription) => {
    setInscriptionToDelete(inscription);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      setFormError('');
      await inscriptionService.remove(inscriptionToDelete.id);
      setFormSuccess('✓ Inscription supprimée avec succès');
      notification.success('Inscription supprimée avec succès');
      loadAllData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Une erreur est survenue lors de la suppression";
      setFormError('✗ ' + errorMsg);
      notification.error(errorMsg);
      console.error(error);
    } finally {
      setShowConfirmation(false);
      setInscriptionToDelete(null);
    }
  };

  const filteredInscriptions = inscriptions.filter(insc => {
    const apprenant = apprenants.find(a => a.id === insc.id_apprenant);
    const fullName = `${apprenant?.nom || ''} ${apprenant?.prenom || ''}`.toLowerCase();
    
    // Filter by search term (apprenant name)
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    
    // Filter by session
    const matchesSession = !filtreSession || insc.id_session === parseInt(filtreSession);
    
    // Filter by group (including option for no group)
    let matchesGroupe = true;
    if (filtreGroupe === 'null') {
      matchesGroupe = !insc.id_groupe;
    } else if (filtreGroupe) {
      matchesGroupe = insc.id_groupe === parseInt(filtreGroupe);
    }
    
    return matchesSearch && matchesSession && matchesGroupe;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <UserGroupIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
        </div>
      </div>
    );
  }

  const getApprenantName = (id_apprenant) => {
    const apprenant = apprenants.find(a => a.id === id_apprenant);
    return apprenant ? `${apprenant.nom} ${apprenant.prenom}` : '—';
  };

  const getEtatColors = (etat) => {
    const colors = {
      'inscription': { bg: COLORS.statBlue, text: COLORS.statBlueText },
      'réinscription': { bg: COLORS.statPurple, text: COLORS.statPurpleText },
      'actif': { bg: COLORS.statGreen, text: COLORS.statGreenText },
      'report': { bg: COLORS.statOrange, text: COLORS.statOrangeText }
    };
    return colors[etat] || { bg: '#E2E2E2', text: '#6B6B6B' };
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Inscriptions</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Gérez les inscriptions des apprenants</p>
          </div>
        </div>
      </div>

      {/* Search Bar and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par apprenant..."
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.card, color: COLORS.text }}
          />
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-5 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
          style={{ background: COLORS.gradient }}
        >
          <UserGroupIcon className="-ml-1 mr-2 h-5 w-5" />
          Ajouter une inscription
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Session Filter with Search */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
            Filtrer par session
          </label>
          <div className="relative">
            <input
              type="text"
              value={sessionSearch}
              onChange={handleSessionSearchChange}
              placeholder="Rechercher une session..."
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.card, color: COLORS.text }}
            />
            
            {/* Session suggestions dropdown */}
            {showSessionSuggestions && sessionSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 rounded-xl shadow-lg max-h-48 overflow-y-auto z-30" style={{ borderColor: COLORS.border }}>
                {sessionSuggestions.map(session => {
                  const sessionName = session.nom_session || `${session.mois} ${session.annee}`;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => selectFiltreSession(session)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b transition-colors last:border-0 ${
                        filtreSession === session.id.toString() ? 'bg-green-50' : ''
                      }`}
                      style={{ borderColor: COLORS.border }}
                    >
                      <div className="font-semibold" style={{ color: COLORS.text }}>{sessionName}</div>
                      <div className="text-sm" style={{ color: COLORS.textLight }}>
                        {session.nom_type_cours || 'Type non spécifié'} • {session.nb_inscrits || 0} inscrits
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            {filtreSession && !sessionSearch && (
              <div className="mt-2 flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: COLORS.highlight, color: COLORS.statGreenText }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">
                  {sessions.find(s => s.id === parseInt(filtreSession))?.nom_session || 'Session sélectionnée'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Group Filter - Filtered by Session */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
            Filtrer par groupe
          </label>
          <select
            value={filtreGroupe}
            onChange={(e) => setFiltreGroupe(e.target.value)}
            disabled={!filtreSession}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all disabled:bg-gray-100"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.card, color: COLORS.text }}
          >
            <option value="">Tous les groupes</option>
            <option value="null">Pas de groupe</option>
            {getFilteredGroupsForSession().map(groupe => (
              <option key={groupe.id} value={groupe.id}>
                {groupe.nom_groupe}
              </option>
            ))}
          </select>
          {!filtreSession && (
            <p className="mt-1 text-xs" style={{ color: COLORS.textLight }}>Sélectionnez d'abord une session</p>
          )}
        </div>
      </div>

      {/* Clear Filters Button */}
      {(filtreSession || filtreGroupe) && (
        <div className="mb-6">
          <button
            onClick={() => {
              setFiltreSession('');
              setFiltreGroupe('');
              setSessionSearch('');
              setSessionSuggestions([]);
              setShowSessionSuggestions(false);
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:shadow-md"
            style={{ backgroundColor: COLORS.border, color: COLORS.textLight }}
          >
            Effacer les filtres
          </button>
        </div>
      )}

      {/* Tableau des inscriptions avec scroll horizontal */}
      <div className="rounded-3xl shadow-sm border overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: COLORS.accent }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>N°</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Apprenant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>État</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Session</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Niveau</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Créneau</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Groupe</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Note</th>
                <th className="px-6 py-4 text-right text-xs font-semibold" style={{ color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInscriptions.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <UserGroupIcon className="mx-auto h-16 w-16 opacity-30 mb-4" style={{ color: COLORS.primary }} />
                    <p className="text-lg font-medium" style={{ color: COLORS.text }}>Aucune inscription trouvée</p>
                    <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Commencez par ajouter une inscription</p>
                  </td>
                </tr>
              ) : (
                filteredInscriptions.map((inscription, index) => {
                  const etatColors = getEtatColors(inscription.etat_inscription);
                  const sessionName = sessions.find(s => s.id === inscription.id_session)?.nom_session || 'Non défini';
                  const niveauCode = niveaux.find(n => n.id === inscription.id_niveau)?.code || '—';
                  const categorieName = categories.find(c => c.id === inscription.id_categorie)?.nom_categorie || '—';
                  const creneau = creneaux.find(cr => cr.id === inscription.id_creneau);
                  const creneauDisplay = creneau ? `${creneau.jour_semaine?.join(', ') || ''}` : '—';
                  const groupeName = groupes.find(g => g.id === inscription.id_groupe)?.nom_groupe || '—';

                  return (
                    <tr key={inscription.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center" style={{ color: COLORS.textLight }}>{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: COLORS.text }}>{getApprenantName(inscription.id_apprenant)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: etatColors.bg, color: etatColors.text }}>
                          {inscription.etat_inscription}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{sessionName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{niveauCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{categorieName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{creneauDisplay}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{groupeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>{inscription.note ? `${inscription.note}/20` : '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(inscription)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ color: COLORS.primary }}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => prepareDelete(inscription)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            style={{ color: '#DC2626' }}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{ backgroundColor: '#FEF2F2' }}>
                <XMarkIcon className="w-8 h-8" style={{ color: '#DC2626' }} />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2" style={{ color: COLORS.text }}>Confirmer la suppression</h3>
              <p className="text-center mb-6" style={{ color: COLORS.textLight }}>
                Êtes-vous sûr de vouloir supprimer cette inscription ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#DC2626' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto my-8 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.accent }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
                  <UserGroupIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>{currentInscription ? "Modifier l'inscription" : "Ajouter une inscription"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: COLORS.textLight }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                {formError && (
                  <div className="p-4 rounded-2xl flex items-start gap-3" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-4 rounded-2xl flex items-start gap-3" style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{formSuccess}</span>
                  </div>
                )}

                {/* Sélection Apprenant avec Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Apprenant *</label>
                  <input
                    type="text"
                    value={filtreNom}
                    onChange={handleFiltreNomChange}
                    placeholder="Tapez le nom ou prénom de l'apprenant..."
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />

                  {/* Liste des suggestions */}
                  {showSuggestions && apprenantSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20" style={{ borderColor: COLORS.border }}>
                      {apprenantSuggestions.map((apprenant) => (
                        <button
                          key={apprenant.id}
                          type="button"
                          onClick={() => selectApprenant(apprenant)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b transition-colors last:border-0"
                          style={{ borderColor: COLORS.border }}
                        >
                          <div className="font-semibold" style={{ color: COLORS.text }}>{apprenant.nom} {apprenant.prenom}</div>
                          <div className="text-sm" style={{ color: COLORS.textLight }}>{apprenant.email || apprenant.tel || ''}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Session</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filtreSession}
                      onChange={handleFiltreSessionChange}
                      placeholder="Tapez le nom de la session..."
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    />

                    {/* Liste des suggestions */}
                    {showSessionSuggestions && sessionSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20" style={{ borderColor: COLORS.border }}>
                        {sessionSuggestions.map((session) => {
                          const sessionName = session.nom_session || `${session.mois} ${session.annee}`;
                          return (
                            <button
                              key={session.id}
                              type="button"
                              onClick={() => selectSession(session)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b transition-colors last:border-0"
                              style={{ borderColor: COLORS.border }}
                            >
                              <div className="font-semibold" style={{ color: COLORS.text }}>{sessionName}</div>
                              <div className="text-sm" style={{ color: COLORS.textLight }}>
                                {session.nom_type_cours || 'Type non spécifié'} • {session.nb_inscrits || 0} inscrits
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {!formData.id_session && (
                    <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>Commencez à taper pour rechercher une session</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Motivation</label>
                  <select
                    name="id_motivation"
                    value={formData.id_motivation || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  >
                    <option value="">Sélectionnez une motivation</option>
                    {motivations.map(motiv => (
                      <option key={motiv.id} value={motiv.id}>
                        {motiv.nom_motivation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>État *</label>
                  <select
                    name="etat_inscription"
                    value={formData.etat_inscription}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  >
                    <option value="">Sélectionnez un état</option>
                    <option value="inscription">Inscription</option>
                    <option value="réinscription">Réinscription</option>
                    <option value="actif">Actif</option>
                    <option value="report">Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Niveau</label>
                  <select
                    name="id_niveau"
                    value={formData.id_niveau}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  >
                    <option value="">Sélectionnez un niveau</option>
                    {niveaux.map(niveau => (
                      <option key={niveau.id} value={niveau.id}>
                        {niveau.code}
                      </option>
                    ))}
                  </select>
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
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom_categorie}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Créneau</label>
                  <select
                    name="id_creneau"
                    value={formData.id_creneau}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    disabled={!formData.id_session || !formData.id_niveau}
                  >
                    <option value="">Sélectionnez un créneau</option>
                    {creneaux
                      .filter(cren => {
                        // Must have both session and niveau selected
                        if (!formData.id_session || !formData.id_niveau) return false;
                        
                        const session = sessions.find(s => s.id === parseInt(formData.id_session));
                        if (!session) return false;
                        
                        // Filter by type_cours from session
                        if (cren.id_type_cours !== session.id_type_cours) return false;
                        
                        // Filter by niveau - id_niveau comes from horaire_cours and is an array
                        if (formData.id_niveau && cren.id_niveau) {
                          const horaireNiveauArray = Array.isArray(cren.id_niveau) 
                            ? cren.id_niveau 
                            : [cren.id_niveau];
                          
                          // Check if selected niveau is in the horaire's niveau array
                          if (!horaireNiveauArray.includes(parseInt(formData.id_niveau))) return false;
                        }
                        
                        return true;
                      })
                      .map(cren => (
                        <option key={cren.id} value={cren.id}>
                          {cren.jour_semaine?.join(', ')} {cren.heure_debut?.substring(0,5)}-{cren.heure_fin?.substring(0,5)}
                        </option>
                      ))
                    }
                  </select>
                  {!formData.id_session && !formData.id_niveau && (
                    <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>Sélectionnez d'abord une session et un niveau</p>
                  )}
                  {formData.id_session && !formData.id_niveau && (
                    <p className="text-xs mt-1" style={{ color: '#F59E0B' }}>Sélectionnez un niveau pour voir les créneaux disponibles</p>
                  )}
                  {!formData.id_session && formData.id_niveau && (
                    <p className="text-xs mt-1" style={{ color: '#F59E0B' }}>Sélectionnez une session pour voir les créneaux disponibles</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Groupe</label>
                  <select
                    name="id_groupe"
                    value={formData.id_groupe}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    disabled={!formData.id_creneau}
                  >
                    <option value="">Aucun groupe</option>
                    {groupes
                      .filter(groupe => {
                        // Filter groups by creneau
                        if (!formData.id_creneau) return false;
                        
                        // Get the creneau to check its type_cours
                        const selectedCreneau = creneaux.find(c => c.id === parseInt(formData.id_creneau));
                        if (!selectedCreneau) return false;
                        
                        // Get the session to check its type_cours
                        const selectedSession = sessions.find(s => s.id === parseInt(formData.id_session));
                        if (!selectedSession) return false;
                        
                        // Group's creneau must match session's type_cours
                        return groupe.id_creneau === parseInt(formData.id_creneau) &&
                               selectedCreneau.id_type_cours === selectedSession.id_type_cours;
                      })
                      .map(groupe => (
                        <option key={groupe.id} value={groupe.id}>
                          {groupe.nom_groupe}
                        </option>
                      ))
                    }
                  </select>
                  {!formData.id_creneau && (
                    <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>Sélectionnez d'abord un créneau</p>
                  )}
                  {formData.id_creneau && groupes.filter(g => g.id_creneau === parseInt(formData.id_creneau)).length === 0 && (
                    <p className="text-xs mt-1" style={{ color: '#F59E0B' }}>Aucun groupe disponible pour ce créneau</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Num. Carte</label>
                  <input
                    type="text"
                    name="num_carte"
                    value={formData.num_carte}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>Note</label>
                  <input
                    type="number"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    step="0.5"
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.highlight }}>
                <input
                  type="checkbox"
                  name="validation_examen"
                  checked={formData.validation_examen}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm font-semibold" style={{ color: COLORS.text }}>Validation examen</span>
              </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  style={{ background: COLORS.gradient }}
                >
                  {currentInscription ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscription;
