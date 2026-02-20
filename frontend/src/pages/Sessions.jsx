import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import sessionService from '../services/sessionService';
import typeCoursService from '../services/typeCoursService';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    date_exam: ''
  });
  
  // Get user info to determine if they are a teacher
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTeacher = user.service === 'professeurs';

  // Charger les sessions et les types de cours
  useEffect(() => {
    const fetchData = async () => {
      try {
        let sessionData;
        if (isTeacher) {
          // If the user is a teacher, get only their sessions
          sessionData = await sessionService.getSessionsByProfesseur();
        } else {
          // Otherwise, get all sessions
          sessionData = await sessionService.getSessions();
        }
        
        const typeCoursData = await typeCoursService.getAll();
        
        setSessions(sessionData);
        setFilteredSessions(sessionData);
        setTypeCours(typeCoursData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isTeacher]);

  // Filtrer les sessions
  useEffect(() => {
    let result = [...sessions];

    // Filtre de recherche
    if (searchTerm) {
      result = result.filter(session =>
        session.mois?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.annee?.toString().includes(searchTerm) ||
        session.nom_type_cours?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      const today = new Date();
      result = result.filter(session => {
        const endDate = new Date(session.date_fin);
        return filterStatus === 'active' ? endDate >= today : endDate < today;
      });
    }

    setFilteredSessions(result);
  }, [searchTerm, filterStatus, sessions]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusLabel = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return end >= today ? 'En cours' : 'Terminée';
  };

  const getStatusColor = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return end >= today ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (id) => {
    try {
      await sessionService.deleteSession(id);
      setSessions(sessions.filter(session => session.id !== id));
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
    } catch (error) {
      alert(`Erreur lors de la suppression: ${error.message}`);
    }
  };

  const confirmDelete = (session) => {
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convertir id_type_cours en nombre entier
      const updatedFormData = {
        ...formData,
        id_type_cours: formData.id_type_cours ? parseInt(formData.id_type_cours, 10) : null,
        annee: formData.annee ? parseInt(formData.annee, 10) : null
      };
      
      if (currentSession) {
        // Update session
        await sessionService.update(currentSession.id, updatedFormData);
        setSessions(sessions.map(s => s.id === currentSession.id ? {...s, ...updatedFormData} : s));
        setShowEditForm(false);
      } else {
        // Create new session
        const newSession = await sessionService.create(updatedFormData);
        setSessions([...sessions, newSession]);
        setShowAddForm(false);
      }
      
      // Reset form
      setFormData({ 
        nom_session: '',
        mois: '',
        annee: '',
        id_type_cours: '',
        date_fin_inscription: '',
        date_debut: '',
        date_fin: '',
        date_exam: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la session:', error);
      // Extraire le message d'erreur spécifique
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'enregistrement';
      alert(`Erreur lors de l'enregistrement: ${errorMessage}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      date_exam: ''
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
      date_exam: session.date_exam ? session.date_exam.split('T')[0] : ''
    });
    setCurrentSession(session);
    setShowEditForm(true);
  };

  const toggleActions = (sessionId) => {
    setShowActions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Chargement des sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur! </strong>
        <span className="block sm:inline">Impossible de charger les sessions: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Ajouter une session</h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de la session</label>
                <input
                  type="text"
                  name="nom_session"
                  value={formData.nom_session}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mois</label>
                <select
                  name="mois"
                  value={formData.mois}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
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
                <label className="block text-sm font-medium text-gray-700">Année</label>
                <input
                  type="number"
                  name="annee"
                  value={formData.annee}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Type de cours</label>
                <select
                  name="id_type_cours"
                  value={formData.id_type_cours}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Sélectionnez un type de cours</option>
                  {typeCours.map((tc) => (
                    <option key={tc.id} value={tc.id}>{tc.nom_type_cours}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin d'inscription</label>
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
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ 
                      nom_session: '',
                      mois: '',
                      annee: '',
                      id_type_cours: '',
                      date_fin_inscription: '',
                      date_debut: '',
                      date_fin: '',
                      date_exam: ''
                    });
                  }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire de modification */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Modifier la session</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit(e);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de la session</label>
                <input
                  type="text"
                  name="nom_session"
                  value={formData.nom_session}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mois</label>
                <select
                  name="mois"
                  value={formData.mois}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
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
                <label className="block text-sm font-medium text-gray-700">Année</label>
                <input
                  type="number"
                  name="annee"
                  value={formData.annee}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Type de cours</label>
                <select
                  name="id_type_cours"
                  value={formData.id_type_cours}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Sélectionnez un type de cours</option>
                  {typeCours.map((tc) => (
                    <option key={tc.id} value={tc.id}>{tc.nom_type_cours}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin d'inscription</label>
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
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setCurrentSession(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirmer la suppression</h3>
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer la session "{sessionToDelete?.nom_session || `${sessionToDelete?.mois} ${sessionToDelete?.annee}`}" ?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(sessionToDelete.id)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
        {/* Only show "Ajouter" button for non-teachers */}
        {!isTeacher && (
          <button 
            onClick={openAddForm}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Ajouter
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Rechercher des sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="finished">Terminées</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Filtres
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-white overflow-hidden shadow rounded-lg relative">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.date_fin)}`}>
                      {getStatusLabel(session.date_fin)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{typeCours.find(tc => tc.id === session.id_type_cours)?.nom_type_cours || 'Type non spécifié'}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {session.nom_session || `${session.mois} ${session.annee}`}
                  </h3>
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleActions(session.id)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {showActions[session.id] && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                          onClick={() => {
                            openEditForm(session);
                          }}
                        >
                          Modifier
                        </button>
                        {!isTeacher && ( // Only allow deletion for non-teachers
                          <button
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                            onClick={() => confirmDelete(session)}
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Dates:</span>
                  <span>{formatDate(session.date_debut)} - {formatDate(session.date_fin)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Inscriptions jusqu'au:</span>
                  <span>{formatDate(session.date_fin_inscription)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Examens:</span>
                  <span>{session.date_exam ? formatDate(session.date_exam) : 'Non programmé'}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{session.nb_inscrits || 0}</p>
                      <p className="text-xs text-gray-500">Inscrits</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{session.nb_groupes || 0}</p>
                      <p className="text-xs text-gray-500">Groupes</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{session.duree_cours || 0}h</p>
                      <p className="text-xs text-gray-500">Cours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune session trouvée</p>
        </div>
      )}
    </div>
  );
}