import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, CalendarIcon, ClockIcon, XMarkIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import sessionService from '../../services/sessionService';

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
};

const STATUS_SECTIONS = [
  {
    key: 'En cours',
    title: 'Sessions en cours',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: '#B5EAD7',
    textColor: '#2D7A5F',
    gradient: 'from-emerald-50 to-teal-50'
  },
  {
    key: 'À venir',
    title: 'Sessions à venir',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    bgColor: '#C7CEEA',
    textColor: '#5A5F8C',
    gradient: 'from-indigo-50 to-purple-50'
  },
  {
    key: 'Terminée',
    title: 'Sessions terminées',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: '#E2E2E2',
    textColor: '#6B6B6B',
    gradient: 'from-gray-50 to-slate-50'
  },
];

const VoirCours = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sessionService.getAll();
        setSessions(data);
        setFilteredSessions(data);
      } catch (err) {
        setError(err.message || 'Impossible de charger les sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...sessions];
    if (searchTerm) {
      result = result.filter(s =>
        (s.nom_session || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.mois || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.annee || '').toString().includes(searchTerm)
      );
    }
    setFilteredSessions(result);
  }, [searchTerm, sessions]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusInfo = (session) => {
    const today = new Date();
    const debut = new Date(session.date_debut);
    const fin = new Date(session.date_fin);
    if (fin < today) return { label: 'Terminée', color: 'bg-gray-200', textColor: 'text-gray-700' };
    if (debut > today) return { label: 'À venir', color: 'bg-blue-100', textColor: 'text-blue-800' };
    return { label: 'En cours', color: 'bg-green-100', textColor: 'text-green-800' };
  };

  // Group sessions by status
  const groupedSessions = {
    'En cours': [],
    'À venir': [],
    'Terminée': [],
  };

  filteredSessions.forEach((session) => {
    const status = getStatusInfo(session);
    if (groupedSessions[status.label]) {
      groupedSessions[status.label].push(session);
    }
  });

  const handleVoirPlus = async (session) => {
    setDetailLoading(true);
    setSelectedSession(null);
    try {
      const data = await sessionService.get(session.id);
      setSelectedSession(data);
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
      setError(err.response?.data?.message || err.message || 'Impossible de charger les détails de la session');
    } finally {
      setDetailLoading(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return '';
    const s = String(t);
    return s.length >= 5 ? s.substring(0, 5) : s;
  };

  const formatJourSemaine = (jours) => {
    if (!jours) return '';
    const arr = Array.isArray(jours) ? jours : [jours];
    return arr.map(j => (j || '').charAt(0).toUpperCase() + (j || '').slice(1)).join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30 mx-auto mb-6" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }} />
            <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
          </div>
          <p className="text-lg font-medium" style={{ color: COLORS.text }}>Chargement des sessions...</p>
        </div>
      </div>
    );
  }

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <main className="container mx-auto px-4 py-10">
        {/* Recherche */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5" style={{ color: COLORS.textLight }} />
            </div>
            <input
              type="text"
              placeholder="Rechercher une session par nom, mois, année..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ backgroundColor: COLORS.card, color: COLORS.text, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-2xl flex justify-between items-center gap-4 shadow-sm" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
            <span className="font-medium">{error}</span>
            <button onClick={clearError} className="px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition-colors">Fermer</button>
          </div>
        )}

        {/* Session sections by status */}
        <div className="space-y-12">
          {STATUS_SECTIONS.map((section) => {
            const sessionsInSection = groupedSessions[section.key];
            const hasSessions = sessionsInSection && sessionsInSection.length > 0;

            return (
              <section key={section.key}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: section.bgColor }}>
                    <div style={{ color: section.textColor }}>{section.icon}</div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>{section.title}</h2>
                    <p className="text-sm" style={{ color: COLORS.textLight }}>
                      {hasSessions ? `${sessionsInSection.length} session${sessionsInSection.length > 1 ? 's' : ''}` : 'Aucune session'}
                    </p>
                  </div>
                  {hasSessions && (
                    <span className="ml-auto px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: section.bgColor, color: section.textColor }}>
                      {sessionsInSection.length}
                    </span>
                  )}
                </div>

                {/* Session cards grid */}
                {hasSessions ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessionsInSection.map((session, idx) => {
                      const statusColor = { bg: section.bgColor, text: section.textColor };
                      return (
                        <div
                          key={`${section.key}-${session.id}`}
                          className="group rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-opacity-50 hover:-translate-y-1"
                          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
                        >
                          {/* Top accent bar */}
                          <div className="h-1.5" style={{ backgroundColor: statusColor.text }} />
                          <div className="p-6">
                            {/* Session header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1 line-clamp-1" style={{ color: COLORS.text }}>
                                  {session.nom_session || `${session.mois} ${session.annee}`}
                                </h3>
                                <p className="text-sm" style={{ color: COLORS.textLight }}>{session.nom_type_cours || '—'}</p>
                              </div>
                              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-3" style={{ backgroundColor: COLORS.accent }}>
                                <AcademicCapIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                              </div>
                            </div>

                            {/* Status badge */}
                            <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                              {section.title}
                            </span>

                            {/* Info section */}
                            <div className="space-y-3 mb-5">
                              <div className="flex items-center gap-3 text-sm p-3 rounded-xl" style={{ backgroundColor: COLORS.highlight }}>
                                <CalendarIcon className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                                <span style={{ color: COLORS.text }}>Début: {formatDate(session.date_debut)}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm p-3 rounded-xl" style={{ backgroundColor: COLORS.highlight }}>
                                <ClockIcon className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                                <span style={{ color: COLORS.text }}>Fin: {formatDate(session.date_fin)}</span>
                              </div>
                            </div>

                            {/* Action button */}
                            <button
                              onClick={() => handleVoirPlus(session)}
                              className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-md group-hover:brightness-95"
                              style={{ backgroundColor: COLORS.primary, color: '#FFFFFF' }}
                            >
                              Voir les détails
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 px-6 rounded-3xl border-2 border-dashed text-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center opacity-40" style={{ backgroundColor: section.bgColor }}>
                      <div style={{ color: section.textColor }}>{section.icon}</div>
                    </div>
                    <p className="text-lg font-medium" style={{ color: COLORS.text }}>Aucune session {section.key.toLowerCase()}</p>
                    <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Les sessions dans cette catégorie apparaîtront ici</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      {/* Modal Détail session */}
      {(selectedSession || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(45, 52, 54, 0.5)' }} onClick={() => !detailLoading && setSelectedSession(null)}>
          <div
            className="rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white"
            onClick={e => e.stopPropagation()}
          >
            {detailLoading ? (
              <div className="p-16 text-center">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }} />
                  <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
                </div>
                <p className="mt-6 text-lg font-medium" style={{ color: COLORS.text }}>Chargement des détails...</p>
              </div>
            ) : selectedSession ? (
              <>
                <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white rounded-t-3xl z-10" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                      <AcademicCapIcon className="w-6 h-6" style={{ color: COLORS.primary }} />
                    </div>
                    <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>
                      {selectedSession.session?.nom_session || `${selectedSession.session?.mois} ${selectedSession.session?.annee}`}
                    </h2>
                  </div>
                  <button onClick={() => setSelectedSession(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <XMarkIcon className="w-6 h-6" style={{ color: COLORS.textLight }} />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {/* Session Info Card */}
                  <section className="p-5 rounded-2xl" style={{ backgroundColor: COLORS.accent }}>
                    <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <BookOpenIcon className="w-5 h-5" />
                      Informations sur la session
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold" style={{ color: COLORS.textLight }}>Type de cours</span>
                        <span style={{ color: COLORS.text }}>{selectedSession.session?.nom_type_cours}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold" style={{ color: COLORS.textLight }}>Date de début</span>
                        <span style={{ color: COLORS.text }}>{formatDate(selectedSession.session?.date_debut)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold" style={{ color: COLORS.textLight }}>Date de fin</span>
                        <span style={{ color: COLORS.text }}>{formatDate(selectedSession.session?.date_fin)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold" style={{ color: COLORS.textLight }}>Fin inscription</span>
                        <span style={{ color: COLORS.text }}>{formatDate(selectedSession.session?.date_fin_inscription)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold" style={{ color: COLORS.textLight }}>Date d'examen</span>
                        <span style={{ color: COLORS.text }}>{formatDate(selectedSession.session?.date_exam) || '—'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold" style={{ color: COLORS.textLight }}>Durée (heures)</span>
                        <span style={{ color: COLORS.text }}>{selectedSession.session?.duree_cours ?? '—'}</span>
                      </div>
                    </div>
                  </section>

                  {selectedSession.horaires_cours?.length > 0 && (
                    <section>
                      <h3 className="font-bold mb-4" style={{ color: COLORS.text }}>Horaires de cours</h3>
                      <div className="space-y-4">
                        {selectedSession.horaires_cours.map((hc) => (
                          <div key={hc.id} className="p-5 rounded-2xl border-2 transition-shadow hover:shadow-md" style={{ borderColor: COLORS.border }}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                              <p className="font-semibold" style={{ color: COLORS.text }}>{hc.nom_categorie || 'Catégorie'}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                              <div className="flex justify-between p-2 rounded-lg" style={{ backgroundColor: COLORS.highlight }}>
                                <span style={{ color: COLORS.textLight }}>Durée (heures):</span>
                                <span className="font-medium" style={{ color: COLORS.text }}>{hc.duree_heures ?? '—'}</span>
                              </div>
                              <div className="flex justify-between p-2 rounded-lg" style={{ backgroundColor: COLORS.highlight }}>
                                <span style={{ color: COLORS.textLight }}>Durée (semaines):</span>
                                <span className="font-medium" style={{ color: COLORS.text }}>{hc.duree_semaines ?? '—'}</span>
                              </div>
                            </div>
                            {hc.creneaux?.length > 0 && (
                              <div className="mt-4">
                                <p className="font-semibold mb-3 text-sm" style={{ color: COLORS.textLight }}>Créneaux horaires:</p>
                                <div className="space-y-2">
                                  {hc.creneaux.map((c) => (
                                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: COLORS.accent }}>
                                      <CalendarIcon className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.primary }} />
                                      <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                                        {formatJourSemaine(c.jour_semaine)} — {formatTime(c.heure_debut)} - {formatTime(c.heure_fin)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoirCours;
