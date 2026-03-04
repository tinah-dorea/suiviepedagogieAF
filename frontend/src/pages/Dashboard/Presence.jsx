import React, { useState, useEffect, useRef } from 'react';
import { ClipboardDocumentCheckIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, CalendarIcon, UserGroupIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import sessionService from '../../services/sessionService';
import groupeService from '../../services/groupeService';
import inscriptionService from '../../services/inscriptionService';
import presenceService from '../../services/presenceService';

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
};

const Presence = () => {
  const [view, setView] = useState('form'); // 'form' ou 'list'
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [apprenants, setApprenants] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingApprenants, setLoadingApprenants] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [absences, setAbsences] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const searchRef = useRef(null);
  
  // Récupérer les infos du professeur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const professeurInfo = user.professeur || {};

  // Charger les sessions au montage
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('[Presence] Token présent:', !!token);
        console.log('[Presence] User:', user);
        
        const data = await sessionService.getSessionsByProfesseur();
        console.log('[Presence] Sessions reçues:', data);
        setSessions(data || []);
      } catch (err) {
        console.error('[Presence] Erreur complète:', err);
        const message = err.message || 'Impossible de charger les sessions';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Charger les groupes quand une session est sélectionnée
  useEffect(() => {
    if (selectedSession) {
      const fetchGroups = async () => {
        try {
          setLoadingGroups(true);
          const allGroups = await groupeService.getByProfesseur();
          // Filtrer les groupes par session
          const sessionGroups = allGroups.filter(g => {
            // On suppose que les groupes ont une relation avec la session via inscription
            return true; // On affichera tous les groupes du professeur
          });
          setGroups(sessionGroups || []);
          setSelectedGroup(null);
          setApprenants([]);
        } catch (err) {
          setError('Impossible de charger les groupes');
          console.error(err);
        } finally {
          setLoadingGroups(false);
        }
      };

      fetchGroups();
    } else {
      setGroups([]);
      setSelectedGroup(null);
      setApprenants([]);
    }
  }, [selectedSession]);

  // Charger les apprenants quand un groupe est sélectionné
  useEffect(() => {
    if (selectedGroup && selectedSession) {
      const fetchApprenants = async () => {
        try {
          setLoadingApprenants(true);
          // Charger les inscriptions pour cette session et ce groupe
          const data = await inscriptionService.getInscriptionsBySessionAndGroupe(selectedSession, selectedGroup);
          setApprenants(data || []);

          // Initialiser l'état de présence pour chaque apprenant (présent par défaut)
          const initialAttendance = {};
          data.forEach(inscription => {
            initialAttendance[inscription.id] = true; // Présent par défaut
          });
          setAttendance(initialAttendance);
        } catch (err) {
          setError('Impossible de charger les apprenants');
          console.error(err);
        } finally {
          setLoadingApprenants(false);
        }
      };

      fetchApprenants();
    }
  }, [selectedGroup, selectedSession]);

  // Charger les absences du professeur
  const fetchAbsences = async () => {
    try {
      setLoadingAbsences(true);
      const data = await presenceService.getAbsencesByProfesseur(user.id);
      setAbsences(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des absences:', err);
      setError('Impossible de charger les absences');
    } finally {
      setLoadingAbsences(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchAbsences();
    }
  }, [view]);

  // Filtrer les sessions pour les suggestions
  const filteredSessions = sessions.filter(session => {
    const term = searchTerm.toLowerCase();
    return (
      (session.nom_session || '').toLowerCase().includes(term) ||
      (session.mois || '').toLowerCase().includes(term) ||
      (session.annee || '').toString().includes(term) ||
      (session.nom_type_cours || '').toLowerCase().includes(term)
    );
  });

  const handleSelectSession = (session) => {
    setSelectedSession(session.id);
    setSearchTerm(`${session.nom_session || session.mois + ' ' + session.annee} (${session.nom_type_cours})`);
    setShowSuggestions(false);
    setGroups([]);
    setSelectedGroup(null);
    setApprenants([]);
  };

  const handleTogglePresence = (inscriptionId) => {
    setAttendance(prev => ({
      ...prev,
      [inscriptionId]: !prev[inscriptionId]
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const dateCours = new Date().toISOString().split('T')[0];

      // Préparer les données de présence avec id_employe_saisie
      const presenceData = apprenants
        .filter(inscription => !attendance[inscription.id]) // Seulement les absents
        .map(inscription => ({
          id_inscription: inscription.id,
          id_groupe: selectedGroup,
          date_cours: dateCours,
          est_present: false,
          remarque: 'Absent',
          id_employe_saisie: user.id // ID de l'employé qui saisit
        }));

      // Enregistrer les absences
      if (presenceData.length > 0) {
        await presenceService.recordPresence(presenceData);
      }

      const absentCount = presenceData.length;
      const presentCount = apprenants.length - absentCount;

      // Message de confirmation détaillé
      let message = `✓ Présence enregistrée avec succès!\n`;
      message += `📅 Date: ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n`;
      message += `👥 ${presentCount} présent${presentCount > 1 ? 's' : ''}, ${absentCount} absent${absentCount > 1 ? 's' : ''}`;
      
      if (absentCount > 0) {
        message += `\n📋 Les ${absentCount} absence${absentCount > 1 ? 's' : ''} ont été enregistrée${absentCount > 1 ? 's' : ''} dans le système.`;
      }

      setSuccessMessage(message);

      // Réinitialiser après 5 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de la présence');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const selectedGroupName = groups.find(g => g.id === selectedGroup)?.nom || 'Non défini';
  const selectedSessionInfo = sessions.find(s => s.id === selectedSession);
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = apprenants.length;

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header avec navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)' }}>
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion de Présence</h1>
              <p className="text-sm" style={{ color: COLORS.textLight }}>Enregistrez et consultez les absences</p>
            </div>
          </div>
          
          {/* Boutons de navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                view === 'form'
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-white'
              }`}
              style={{ 
                backgroundColor: view === 'form' ? COLORS.primary : 'transparent'
              }}
            >
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              Saisie
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                view === 'list'
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-white'
              }`}
              style={{ 
                backgroundColor: view === 'list' ? COLORS.primary : 'transparent'
              }}
            >
              <EyeIcon className="h-5 w-5" />
              Liste des absences
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl flex justify-between items-center gap-4 shadow-sm" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          <span className="font-medium">{error}</span>
          <button onClick={() => setError(null)} className="px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition-colors">Fermer</button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-sm" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
          <CheckIcon className="h-5 w-5" />
          <pre className="font-medium whitespace-pre-wrap">{successMessage}</pre>
        </div>
      )}

      {/* Vue Formulaire de saisie */}
      {view === 'form' && (
      <div className="space-y-6">
        {/* Recherche de session */}
        <div className="bg-white rounded-3xl shadow-sm p-6" ref={searchRef}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
              <CalendarIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>1. Rechercher une session</h2>
              <p className="text-sm" style={{ color: COLORS.textLight }}>Sélectionnez la session concernée</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5" style={{ color: COLORS.textLight }} />
            </div>
            <input
              type="text"
              placeholder="Rechercher une session (nom, mois, année, type)..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: COLORS.bg, 
                color: COLORS.text,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
                if (e.target.value === '') {
                  setSelectedSession(null);
                }
              }}
              onFocus={() => setShowSuggestions(true)}
            />

            {/* Suggestions */}
            {showSuggestions && filteredSessions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
                {filteredSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between border-b last:border-b-0"
                    style={{ borderColor: COLORS.border }}
                  >
                    <div>
                      <p className="font-semibold" style={{ color: COLORS.text }}>
                        {session.nom_session || `${session.mois} ${session.annee}`}
                      </p>
                      <p className="text-sm" style={{ color: COLORS.textLight }}>
                        {session.nom_type_cours} • Du {formatDate(session.date_debut)} au {formatDate(session.date_fin)}
                      </p>
                    </div>
                    <CheckIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedSession && selectedSessionInfo && (
            <div className="mt-4 p-4 rounded-2xl flex items-center justify-between" style={{ backgroundColor: COLORS.accent }}>
              <div>
                <p className="font-semibold" style={{ color: COLORS.text }}>Session sélectionnée</p>
                <p className="text-sm" style={{ color: COLORS.textLight }}>
                  {selectedSessionInfo.nom_session || `${selectedSessionInfo.mois} ${selectedSessionInfo.annee}`} - {selectedSessionInfo.nom_type_cours}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSession(null);
                  setSearchTerm('');
                  setGroups([]);
                  setSelectedGroup(null);
                  setApprenants([]);
                }}
                className="p-2 rounded-full hover:bg-white/50 transition"
              >
                <XMarkIcon className="w-5 h-5" style={{ color: COLORS.textLight }} />
              </button>
            </div>
          )}
        </div>

        {/* Sélection du groupe */}
        {selectedSession && (
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                <UserGroupIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>2. Sélectionner un groupe</h2>
                <p className="text-sm" style={{ color: COLORS.textLight }}>Choisissez le groupe concerné</p>
              </div>
            </div>

            {loadingGroups ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun groupe trouvé pour cette session</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedGroup === group.id
                        ? 'border-opacity-100 shadow-md'
                        : 'border-opacity-50 hover:border-opacity-75'
                    }`}
                    style={{ 
                      borderColor: COLORS.primary,
                      backgroundColor: selectedGroup === group.id ? COLORS.accent : COLORS.card
                    }}
                  >
                    <p className="font-semibold" style={{ color: selectedGroup === group.id ? COLORS.text : COLORS.textLight }}>
                      {group.nom_groupe}
                    </p>
                    {group.nom_type_cours && (
                      <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>{group.nom_type_cours}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Liste des apprenants */}
        {selectedGroup && (
          <>
            {/* Résumé */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                    <ClipboardDocumentCheckIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>3. Marquer la présence</h2>
                    <p className="text-sm" style={{ color: COLORS.textLight }}>
                      Groupe: {selectedGroupName} • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{presentCount}/{totalCount}</p>
                  <p className="text-sm" style={{ color: COLORS.textLight }}>Présents</p>
                </div>
              </div>

              {loadingApprenants ? (
                <div className="flex justify-center items-center h-40">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
                  </div>
                </div>
              ) : apprenants.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardDocumentCheckIcon className="h-12 w-12 mx-auto mb-3 opacity-50" style={{ color: COLORS.primary }} />
                  <p>Aucun apprenant inscrit dans ce groupe pour cette session</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {apprenants.map((inscription) => (
                    <div
                      key={inscription.id}
                      className="flex items-center justify-between p-4 rounded-2xl transition-all"
                      style={{ 
                        backgroundColor: attendance[inscription.id] ? COLORS.highlight : '#FEF2F2',
                        border: `1px solid ${attendance[inscription.id] ? COLORS.border : '#FECACA'}`
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: COLORS.text }}>
                          {inscription.prenom_apprenant || inscription.prenom} {inscription.nom_apprenant || inscription.nom}
                        </p>
                        <p className="text-sm" style={{ color: COLORS.textLight }}>{inscription.email_apprenant || inscription.email}</p>
                      </div>

                      <button
                        onClick={() => handleTogglePresence(inscription.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                          attendance[inscription.id]
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {attendance[inscription.id] ? (
                          <>
                            <CheckIcon className="h-5 w-5" />
                            Présent
                          </>
                        ) : (
                          <>
                            <XMarkIcon className="h-5 w-5" />
                            Absent
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            {!loadingApprenants && apprenants.length > 0 && (
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const initialAttendance = {};
                    apprenants.forEach(inscription => {
                      initialAttendance[inscription.id] = true;
                    });
                    setAttendance(initialAttendance);
                  }}
                  className="px-6 py-3 rounded-2xl font-medium transition hover:shadow-md"
                  style={{ backgroundColor: COLORS.border, color: COLORS.text }}
                >
                  Tout mettre à Présent
                </button>
                <button
                  onClick={handleSaveAttendance}
                  disabled={saving}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition hover:shadow-md ${
                    saving
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : ''
                  }`}
                  style={{
                    backgroundColor: saving ? '' : COLORS.primary,
                    color: saving ? '' : '#FFFFFF'
                  }}
                >
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  {saving ? 'Enregistrement...' : 'Enregistrer la Présence'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      )}

      {/* Vue Liste des absences */}
      {view === 'list' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                <EyeIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Liste des absences enregistrées</h2>
                <p className="text-sm" style={{ color: COLORS.textLight }}>Toutes les absences saisies par vos soins</p>
              </div>
            </div>

            {loadingAbsences ? (
              <div className="flex justify-center items-center h-40">
                <div className="relative">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
                </div>
              </div>
            ) : absences.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ClipboardDocumentCheckIcon className="h-12 w-12 mx-auto mb-3 opacity-50" style={{ color: COLORS.primary }} />
                <p className="text-lg font-medium">Aucune absence enregistrée</p>
                <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Les absences que vous enregistrerez apparaîtront ici</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2" style={{ borderColor: COLORS.border }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Date cours</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Apprenant</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Groupe</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Session</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Date saisie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absences.map((absence, index) => (
                      <tr key={absence.id || index} className="border-b hover:bg-gray-50" style={{ borderColor: COLORS.border }}>
                        <td className="px-4 py-3" style={{ color: COLORS.text }}>{formatDate(absence.date_cours)}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: COLORS.text }}>
                          {absence.nom_apprenant || absence.prenom_apprenant 
                            ? `${absence.prenom_apprenant || ''} ${absence.nom_apprenant || ''}`.trim()
                            : 'N/A'}
                        </td>
                        <td className="px-4 py-3" style={{ color: COLORS.text }}>{absence.nom_groupe || 'N/A'}</td>
                        <td className="px-4 py-3" style={{ color: COLORS.text }}>{absence.nom_session || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            absence.est_present 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {absence.est_present ? 'Présent' : 'Absent'}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: COLORS.text }}>
                          {absence.date_saisie 
                            ? new Date(absence.date_saisie).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Résumé */}
            {!loadingAbsences && absences.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl flex items-center justify-between" style={{ backgroundColor: COLORS.accent }}>
                <div>
                  <p className="font-semibold" style={{ color: COLORS.text }}>Total: {absences.length} enregistrement{absences.length > 1 ? 's' : ''}</p>
                  <p className="text-sm" style={{ color: COLORS.textLight }}>
                    {absences.filter(a => !a.est_present).length} absence{absences.filter(a => !a.est_present).length > 1 ? 's' : ''} enregistrée{absences.filter(a => !a.est_present).length > 1 ? 's' : ''}
                  </p>
                </div>
                <ClipboardDocumentCheckIcon className="h-8 w-8" style={{ color: COLORS.primary }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Presence;
