import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, CalendarIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import consultationService from '../services/consultationService';

// Palette: #F5F1E6 majorité, #DFF6FF accompagnement, #758695 titres/hover
const COLORS = {
  bg: '#F5F1E6',
  accent: '#DFF6FF',
  primary: '#758695',
  white: '#FFFFFF',
};

const ConsultationCours = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [typeCoursList, setTypeCoursList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypeCours, setFilterTypeCours] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsData, typeCoursData] = await Promise.all([
          consultationService.getSessions(),
          consultationService.getTypeCours(),
        ]);
        setSessions(sessionsData);
        setFilteredSessions(sessionsData);
        setTypeCoursList(typeCoursData || []);
      } catch (err) {
        setError(err.message || 'Impossible de charger les données');
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
        (s.nom_type_cours || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.mois || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.annee || '').toString().includes(searchTerm)
      );
    }
    if (filterTypeCours) {
      result = result.filter(s => String(s.id_type_cours) === String(filterTypeCours));
    }
    setFilteredSessions(result);
  }, [searchTerm, filterTypeCours, sessions]);

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

  const handleVoirPlus = async (session) => {
    setDetailLoading(true);
    setSelectedSession(null);
    try {
      const data = await consultationService.getSessionDetail(session.id);
      setSelectedSession(data);
    } catch (err) {
      setError(err.message || 'Impossible de charger les détails');
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
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4" style={{ borderColor: COLORS.primary }} />
          <p style={{ color: COLORS.text }}>Chargement des sessions...</p>
        </div>
      </div>
    );
  }

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl" style={{ color: COLORS.primary }}>
            ← Retour
          </Link>
          <h1 className="text-xl font-bold" style={{ color: COLORS.primary }}>Consulter les cours</h1>
          <Link to="/login" className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
            Se connecter
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Recherche et Filtre par type de cours */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: '#ddd', backgroundColor: COLORS.white }}
            />
          </div>
          <div className="sm:w-64">
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Type de cours</label>
            <select
              value={filterTypeCours}
              onChange={(e) => setFilterTypeCours(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2"
              style={{ borderColor: '#ddd', backgroundColor: COLORS.white }}
            >
              <option value="">Tous les types</option>
              {typeCoursList.map((tc) => (
                <option key={tc.id} value={tc.id}>{tc.nom_type_cours}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-100 text-red-800 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-600 hover:text-red-800 font-medium">Fermer</button>
          </div>
        )}

        {/* Cartes sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map((session, idx) => {
            const status = getStatusInfo(session);
            const borderColor = status.label === 'En cours' ? '#22c55e' : status.label === 'À venir' ? '#3b82f6' : '#9ca3af';
            return (
              <div
                key={session.id}
                className="rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
                style={{ backgroundColor: COLORS.white }}
              >
                <div className="h-2" style={{ backgroundColor: borderColor }} />
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.primary }}>
                    {session.nom_session || `${session.mois} ${session.annee}`}
                  </h3>
                  <p className="text-sm mb-4 text-gray-600">{session.nom_type_cours || '—'}</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.textColor}`}>
                    {status.label}
                  </span>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                      {formatDate(session.date_debut)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 flex-shrink-0" />
                      {formatDate(session.date_fin)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleVoirPlus(session)}
                    className="mt-6 w-full py-2 rounded-lg font-medium"
                    style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
                  >
                    Voir plus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSessions.length === 0 && !loading && (
          <p className="text-center py-12 text-gray-600">Aucune session trouvée</p>
        )}
      </main>

      {/* Modal Détail session */}
      {(selectedSession || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !detailLoading && setSelectedSession(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {detailLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4" style={{ borderColor: COLORS.primary }} />
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : selectedSession ? (
              <>
                <div className="flex justify-between items-start p-6 border-b">
                  <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                    {selectedSession.session?.nom_session || `${selectedSession.session?.mois} ${selectedSession.session?.annee}`}
                  </h2>
                  <button onClick={() => setSelectedSession(null)} className="p-1 rounded-full hover:bg-gray-100">
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <section>
                    <h3 className="font-bold mb-3" style={{ color: COLORS.primary }}>Session</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li><strong>Type de cours:</strong> {selectedSession.session?.nom_type_cours}</li>
                      <li><strong>Date début:</strong> {formatDate(selectedSession.session?.date_debut)}</li>
                      <li><strong>Date fin:</strong> {formatDate(selectedSession.session?.date_fin)}</li>
                      <li><strong>Date fin inscription:</strong> {formatDate(selectedSession.session?.date_fin_inscription)}</li>
                      <li><strong>Date examen:</strong> {formatDate(selectedSession.session?.date_exam) || '—'}</li>
                      <li><strong>Durée cours (h):</strong> {selectedSession.session?.duree_cours ?? '—'}</li>
                    </ul>
                  </section>

                  {selectedSession.horaires_cours?.length > 0 && (
                    <section>
                      <h3 className="font-bold mb-3" style={{ color: COLORS.primary }}>Horaires de cours</h3>
                      {selectedSession.horaires_cours.map((hc) => (
                        <div key={hc.id} className="mb-4 p-4 rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
                          <p><strong>Catégorie:</strong> {hc.nom_categorie || '—'}</p>
                          <p><strong>Durée (heures):</strong> {hc.duree_heures ?? '—'}</p>
                          <p><strong>Durée (semaines):</strong> {hc.duree_semaines ?? '—'}</p>
                          {hc.creneaux?.length > 0 && (
                            <div className="mt-3">
                              <p className="font-medium mb-2">Créneaux:</p>
                              <ul className="space-y-2">
                                {hc.creneaux.map((c) => (
                                  <li key={c.id} className="text-sm pl-4">
                                    {formatJourSemaine(c.jour_semaine)} — {formatTime(c.heure_debut)} - {formatTime(c.heure_fin)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
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

export default ConsultationCours;
