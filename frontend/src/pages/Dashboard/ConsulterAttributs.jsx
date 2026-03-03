import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, UsersIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import groupeService from '../../services/groupeService';
import inscriptionService from '../../services/inscriptionService';

const ConsulterAttributs = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApprenants, setLoadingApprenants] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        // Récupérer tous les groupes
        const data = await groupeService.getAllGroupes();
        setGroups(data || []);
        // Sélectionner le premier groupe par défaut
        if (data && data.length > 0) {
          setSelectedGroup(data[0].id);
        }
      } catch (err) {
        setError('Impossible de charger les groupes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const fetchApprenants = async () => {
        try {
          setLoadingApprenants(true);
          // Récupérer les apprenants du groupe sélectionné
          const data = await inscriptionService.getApprenantsByGroupe(selectedGroup);
          setApprenants(data || []);
        } catch (err) {
          setError('Impossible de charger les apprenants');
          console.error(err);
        } finally {
          setLoadingApprenants(false);
        }
      };

      fetchApprenants();
    }
  }, [selectedGroup]);

  const selectedGroupName = groups.find(g => g.id === selectedGroup)?.nom || 'Non défini';

  const filteredApprenants = apprenants.filter(apprenant => {
    return !searchTerm || 
      apprenant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UsersIcon className="h-8 w-8" />
          Consulter les Attributs des Apprenants
        </h1>
        <p className="mt-2 text-purple-100">Filtrez les apprenants par groupe et consultez leurs profils</p>
      </div>

      {/* Sélection du groupe */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sélectionner un groupe
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedGroup || ''}
          onChange={(e) => setSelectedGroup(parseInt(e.target.value))}
        >
          <option value="">-- Choisir un groupe --</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.nom}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && (
        <>
          {/* Recherche */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un apprenant (nom, prénom, email)..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tableau des apprenants */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loadingApprenants ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredApprenants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UsersIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun apprenant trouvé dans le groupe {selectedGroupName}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prénom</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Téléphone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Genre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApprenants.map((apprenant, index) => (
                      <tr key={apprenant.id || index} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{apprenant.nom}</td>
                        <td className="px-6 py-4 text-gray-600">{apprenant.prenom}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                            {apprenant.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{apprenant.tel || apprenant.telephone || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {apprenant.sexe || apprenant.genre || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Résumé */}
          {!loadingApprenants && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 font-semibold">Groupe: {selectedGroupName}</p>
                  <p className="text-purple-600 text-sm mt-1">
                    {filteredApprenants.length === apprenants.length 
                      ? `Total: ${apprenants.length} apprenant${apprenants.length > 1 ? 's' : ''}` 
                      : `${filteredApprenants.length} apprenant${filteredApprenants.length > 1 ? 's' : ''} trouvé${filteredApprenants.length > 1 ? 's' : ''} sur ${apprenants.length} total`}
                  </p>
                </div>
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ConsulterAttributs;
