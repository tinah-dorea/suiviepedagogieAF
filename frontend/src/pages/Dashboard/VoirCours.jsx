import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import sessionService from '../../services/sessionService';

const VoirCours = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Récupérer toutes les sessions
        const data = await sessionService.getAllSessions();
        setSessions(data || []);
      } catch (err) {
        setError('Impossible de charger les sessions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSessionStatus = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return end >= today ? 'En cours' : 'Terminée';
  };

  const getStatusColor = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return end >= today ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.nom_session?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.mois?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const sessionStatus = getSessionStatus(session.date_fin);
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && sessionStatus === 'En cours') ||
      (filterStatus === 'finished' && sessionStatus === 'Terminée');
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarIcon className="h-8 w-8" />
          Mes Sessions de Cours
        </h1>
        <p className="mt-2 text-blue-100">Consultez les sessions auxquelles vous êtes assigné</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une session..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">En cours</option>
            <option value="finished">Terminées</option>
          </select>
        </div>
      </div>

      {/* Tableau des sessions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune session trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom Session</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mois</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Année</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dates</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{session.nom_session}</td>
                    <td className="px-6 py-4 text-gray-600">{session.mois}</td>
                    <td className="px-6 py-4 text-gray-600">{session.annee}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(session.date_debut)} à {formatDate(session.date_fin)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.date_fin)}`}>
                        {getSessionStatus(session.date_fin)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition">
                        <EyeIcon className="h-4 w-4" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 font-semibold">Sessions actives</p>
          <p className="text-3xl font-bold text-green-900">
            {filteredSessions.filter(s => getSessionStatus(s.date_fin) === 'En cours').length}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 font-semibold">Sessions terminées</p>
          <p className="text-3xl font-bold text-gray-900">
            {filteredSessions.filter(s => getSessionStatus(s.date_fin) === 'Terminée').length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 font-semibold">Total sessions</p>
          <p className="text-3xl font-bold text-blue-900">{filteredSessions.length}</p>
        </div>
      </div>
    </div>
  );
};

export default VoirCours;
