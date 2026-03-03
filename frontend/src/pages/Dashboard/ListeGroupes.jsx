import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import groupeService from '../../services/groupeService';
import professeurService from '../../services/professeurService';
import creneauService from '../../services/creneauService';
import inscriptionService from '../../services/inscriptionService';
import { EllipsisHorizontalIcon, UserGroupIcon, XMarkIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';

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
  statGreen: '#B5EAD7',
  statGreenText: '#2D7A5F',
  statBlue: '#C7CEEA',
  statBlueText: '#5A5F8C',
};

const ListeGroupes = () => {
  const [groupes, setGroupes] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const loadData = async () => {
    try {
      const [groupesData, professeursData, creneauxData] = await Promise.all([
        groupeService.getAll(),
        professeurService.getAll(),
        creneauService.getAll()
      ]);
      setGroupes(groupesData);
      setProfesseurs(professeursData);
      setCreneaux(creneauxData);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des groupes');
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await groupeService.delete(id);
      toast.success('Groupe supprimé avec succès');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setDeleteConfirmation(null);
    }
  };

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

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Liste des Groupes</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Consultez et gérez vos groupes</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl shadow-sm border overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: COLORS.accent }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>N°</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Nom du groupe</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Professeur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Créneau</th>
                <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Nombre d'apprenants</th>
                <th className="px-6 py-4 text-right text-xs font-semibold" style={{ color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupes.map((groupe, index) => {
                const prof = professeurs.find(p => p.id === groupe.id_professeur);
                const creneau = creneaux.find(c => c.id === groupe.id_creneau);
                return (
                  <tr key={groupe.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center" style={{ color: COLORS.textLight }}>{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: COLORS.text }}>{groupe.nom_groupe}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>
                      {prof ? `${prof.nom} ${prof.prenom}` : 'Non assigné'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>
                      {creneau
                        ? `${creneau.jour_semaine?.join(', ')} - ${creneau.heure_debut?.substring(0,5)}`
                        : 'Non assigné'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <GroupeStats groupeId={groupe.id} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === groupe.id ? null : groupe.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: COLORS.textLight }}
                        >
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>

                        {openMenuId === groupe.id && (
                          <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg border z-20 overflow-hidden" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                            <button
                              onClick={() => {
                                toast.info('Fonctionnalité d\'édition à venir');
                                setOpenMenuId(null);
                              }}
                              className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                              style={{ color: COLORS.text }}
                            >
                              <AcademicCapIcon className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                              Éditer
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmation(groupe.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
                              style={{ color: '#DC2626' }}
                            >
                              <XMarkIcon className="h-4 w-4 mr-2" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {groupes.length === 0 && (
        <div className="text-center py-16">
          <UserGroupIcon className="mx-auto h-16 w-16 opacity-30 mb-4" style={{ color: COLORS.primary }} />
          <p className="text-lg font-medium" style={{ color: COLORS.text }}>Aucun groupe trouvé</p>
          <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Commencez par créer un groupe</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{ backgroundColor: '#FEF2F2' }}>
                <XMarkIcon className="w-8 h-8" style={{ color: '#DC2626' }} />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2" style={{ color: COLORS.text }}>Confirmer la suppression</h3>
              <p className="text-center mb-6" style={{ color: COLORS.textLight }}>
                Êtes-vous sûr de vouloir supprimer ce groupe ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmation)}
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
    </div>
  );
};

// Composant pour afficher le nombre d'apprenants par groupe
const GroupeStats = ({ groupeId }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const inscriptions = await inscriptionService.getAll();
        const apprenantsCount = inscriptions.filter(ins => ins.id_groupe === groupeId).length;
        setCount(apprenantsCount);
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [groupeId]);

  if (loading) {
    return <span className="text-gray-400">...</span>;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
      count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      <UserGroupIcon className="w-3.5 h-3.5 mr-1.5" />
      {count} apprenant{count > 1 ? 's' : ''}
    </span>
  );
};

export default ListeGroupes;
