import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, XMarkIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, UserGroupIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import groupeService from '../../services/groupeService';
import inscriptionService from '../../services/inscriptionService';

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

const ConsulterAttributs = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApprenants, setLoadingApprenants] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groupsData = await groupeService.getByProfesseur();
        setGroups(groupsData || []);
        if (groupsData && groupsData.length > 0) {
          setSelectedGroup(groupsData[0].id);
        }
      } catch (err) {
        setError(err.message || 'Impossible de charger les groupes');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
        </div>
      </div>
    );
  }

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)' }}>
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Mes Groupes Attribués</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Consultez les groupes qui vous sont assignés</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-5 rounded-2xl flex justify-between items-center gap-4 shadow-sm" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          <span className="font-medium">{error}</span>
          <button onClick={clearError} className="px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition-colors">Fermer</button>
        </div>
      )}

      {/* Group cards grid */}
      {groups.length === 0 ? (
        <div className="py-12 px-6 rounded-3xl border-2 border-dashed text-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center opacity-40" style={{ backgroundColor: COLORS.accent }}>
            <UserGroupIcon className="w-8 h-8" style={{ color: COLORS.primary }} />
          </div>
          <p className="text-lg font-medium" style={{ color: COLORS.text }}>Aucun groupe attribué</p>
          <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Vous n'êtes assigné à aucun groupe pour le moment</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`group rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-opacity-50 hover:-translate-y-1 cursor-pointer ${
                  selectedGroup === group.id ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{ 
                  backgroundColor: COLORS.card, 
                  borderColor: COLORS.border,
                  ringColor: COLORS.primary
                }}
              >
                {/* Top accent bar */}
                <div className="h-1.5" style={{ backgroundColor: selectedGroup === group.id ? COLORS.primary : COLORS.secondary }} />
                <div className="p-6">
                  {/* Group header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.text }}>
                        {group.nom_groupe}
                      </h3>
                      <p className="text-sm" style={{ color: COLORS.textLight }}>
                        {group.nom_type_cours || '—'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-3" style={{ backgroundColor: COLORS.accent }}>
                      <UserGroupIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="space-y-2 mb-4">
                    {group.nom_prof && (
                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg" style={{ backgroundColor: COLORS.highlight }}>
                        <AcademicCapIcon className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.primary }} />
                        <span style={{ color: COLORS.text }}>{group.nom_prof} {group.prenom_prof}</span>
                      </div>
                    )}
                    {group.nb_apprenants !== undefined && (
                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg" style={{ backgroundColor: COLORS.highlight }}>
                        <UsersIcon className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.primary }} />
                        <span style={{ color: COLORS.text }}>{group.nb_apprenants} apprenant(s)</span>
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                    selectedGroup === group.id 
                      ? 'text-white' 
                      : ''
                  }`} style={{ 
                    backgroundColor: selectedGroup === group.id ? COLORS.primary : COLORS.statBlue 
                  }}>
                    {selectedGroup === group.id ? 'Sélectionné' : 'Cliquez pour voir'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Apprenants section */}
          {selectedGroup && (
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                  <UsersIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Apprenants du groupe {selectedGroupName}</h2>
                  <p className="text-sm" style={{ color: COLORS.textLight }}>Liste des apprenants inscrits</p>
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
                  <UsersIcon className="h-12 w-12 mx-auto mb-3 opacity-50" style={{ color: COLORS.primary }} />
                  <p>Aucun apprenant trouvé dans le groupe {selectedGroupName}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2" style={{ borderColor: COLORS.border }}>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Nom</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Prénom</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: COLORS.text }}>Téléphone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apprenants.map((apprenant, index) => (
                        <tr key={apprenant.id || index} className="border-b hover:bg-gray-50" style={{ borderColor: COLORS.border }}>
                          <td className="px-4 py-3 font-medium" style={{ color: COLORS.text }}>{apprenant.nom}</td>
                          <td className="px-4 py-3" style={{ color: COLORS.text }}>{apprenant.prenom}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2" style={{ color: COLORS.text }}>
                              <EnvelopeIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
                              {apprenant.email}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2" style={{ color: COLORS.text }}>
                              <PhoneIcon className="h-4 w-4" style={{ color: COLORS.primary }} />
                              {apprenant.tel || apprenant.telephone || 'N/A'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary */}
              {!loadingApprenants && (
                <div className="mt-4 p-4 rounded-2xl flex items-center justify-between" style={{ backgroundColor: COLORS.accent }}>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.text }}>Groupe: {selectedGroupName}</p>
                    <p className="text-sm" style={{ color: COLORS.textLight }}>
                      Total: {apprenants.length} apprenant{apprenants.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <UsersIcon className="h-8 w-8" style={{ color: COLORS.primary }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsulterAttributs;
