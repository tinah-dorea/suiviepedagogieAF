import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import inscriptionService from '../../services/inscriptionService';
import apprenantService from '../../services/apprenantService';

const ListeInscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtat, setFilterEtat] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [inscriptionsData, apprenantsData] = await Promise.all([
        inscriptionService.getAll(),
        apprenantService.getAll()
      ]);
      setInscriptions(inscriptionsData);
      setApprenants(apprenantsData);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
      setLoading(false);
    }
  };

  // Map apprenant par id
  const apprenantMap = apprenants.reduce((acc, app) => {
    acc[app.id] = app;
    return acc;
  }, {});

  // Filtrer les inscriptions
  const filteredInscriptions = inscriptions.filter(inscription => {
    const apprenant = apprenantMap[inscription.id_apprenant];
    if (!apprenant) return false;

    const fullName = `${apprenant.nom} ${apprenant.prenom}`.toLowerCase();
    const matchesSearch = searchTerm === '' || fullName.includes(searchTerm.toLowerCase());
    const matchesEtat = filterEtat === '' || inscription.etat_inscription === filterEtat;

    return matchesSearch && matchesEtat;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher par apprenant
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom ou prénom..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              État de l'inscription
            </label>
            <select
              value={filterEtat}
              onChange={(e) => setFilterEtat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les états</option>
              <option value="inscription">Inscription</option>
              <option value="réinscription">Réinscription</option>
              <option value="actif">Actif</option>
              <option value="report">Report</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des inscriptions avec scroll horizontal */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">N°</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de naissance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationalité</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu de naissance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Établissement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau scolaire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut apprenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État inscription</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groupe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date inscription</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInscriptions.length === 0 ? (
                <tr>
                  <td colSpan="17" className="px-6 py-4 text-center text-gray-500">
                    Aucune inscription trouvée
                  </td>
                </tr>
              ) : (
                filteredInscriptions.map((inscription, index) => {
                  const apprenant = apprenantMap[inscription.id_apprenant];
                  const etatColors = {
                    inscription: 'bg-blue-100 text-blue-800',
                    réinscription: 'bg-purple-100 text-purple-800',
                    actif: 'bg-green-100 text-green-800',
                    report: 'bg-yellow-100 text-yellow-800'
                  };
                  const etatColor = etatColors[inscription.etat_inscription] || 'bg-gray-100 text-gray-800';
                  const statutColors = {
                    actif: 'bg-green-100 text-green-800',
                    abandon: 'bg-red-100 text-red-800'
                  };
                  const statutColor = statutColors[apprenant?.statut] || 'bg-gray-100 text-gray-800';

                  return (
                    <tr key={inscription.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {apprenant?.nom || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.prenom || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.email || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.tel || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.date_n ? new Date(apprenant.date_n).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.sexe || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.adresse || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.nationalite || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.lieu_n || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.etablissement || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {apprenant?.niveau_scolaire || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statutColor}`}>
                          {apprenant?.statut || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${etatColor}`}>
                          {inscription.etat_inscription}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {inscription.id_groupe || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {inscription.note ? `${inscription.note}/20` : '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListeInscriptions;
