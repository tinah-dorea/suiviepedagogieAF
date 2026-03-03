import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import groupeService from '../../services/groupeService';
import creneauService from '../../services/creneauService';
import professeurService from '../../services/professeurService';
import sessionService from '../../services/sessionService';
import { PencilIcon, TrashIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const ListeGroupes = () => {
  const [groupes, setGroupes] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroupe, setCurrentGroupe] = useState(null);
  const [formData, setFormData] = useState({
    nom_groupe: '',
    id_session: '',
    id_creneau: '',
    id_professeur: ''
  });
  const [sessionSearch, setSessionSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Charger les données
  const loadData = async () => {
    try {
      const [groupesData, creneauxData, professeursData, sessionsData] = await Promise.all([
        groupeService.getAll(),
        creneauService.getAll(),
        professeurService.getAll(),
        sessionService.getAll()
      ]);

      console.log('Groupes data:', groupesData);
      console.log('Professeurs data:', professeursData);

      // Map professeurs to handle nom_employe/prenom_employe fields
      const mappedProfesseurs = Array.isArray(professeursData)
        ? professeursData.map(prof => ({
            ...prof,
            id: prof.id,
            nom: prof.nom_employe || prof.nom || '',
            prenom: prof.prenom_employe || prof.prenom || ''
          }))
        : [];

      console.log('Mapped Professeurs:', mappedProfesseurs);

      setGroupes(Array.isArray(groupesData) ? groupesData : []);
      setCreneaux(Array.isArray(creneauxData) ? creneauxData : []);
      setProfesseurs(mappedProfesseurs);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des groupes');
      console.error('Error details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Gestionnaires de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset creneau when session changes
    if (name === 'id_session') {
      setFormData(prev => ({ ...prev, id_creneau: '' }));
    }
  };

  // Filter creneaux by session's type_cours
  const getFilteredCreneaux = () => {
    if (!formData.id_session) return creneaux;
    const session = sessions.find(s => s.id === parseInt(formData.id_session));
    if (!session || !session.id_type_cours) return creneaux;
    return creneaux.filter(c => c.id_type_cours === session.id_type_cours);
  };

  // Filter sessions by search term
  const getFilteredSessions = () => {
    if (!sessionSearch) return sessions;
    return sessions.filter(s =>
      s.nom_session?.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      s.mois?.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      s.annee?.toString().includes(sessionSearch)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        nom_groupe: formData.nom_groupe,
        id_creneau: parseInt(formData.id_creneau, 10),
        id_professeur: parseInt(formData.id_professeur, 10)
      };

      console.log('Submitting groupe data:', submitData);

      if (currentGroupe) {
        await groupeService.update(currentGroupe.id, submitData);
        toast.success('Groupe modifié avec succès');
      } else {
        await groupeService.create(submitData);
        toast.success('Groupe créé avec succès');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating/updating groupe:', error);
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (groupe) => {
    console.log('Editing groupe:', groupe);
    setCurrentGroupe(groupe);
    setFormData({
      nom_groupe: groupe.nom_groupe || '',
      id_session: '',
      id_creneau: groupe.id_creneau?.toString() || '',
      id_professeur: groupe.id_professeur?.toString() || ''
    });
    setSessionSearch('');
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentGroupe(null);
    setFormData({
      nom_groupe: '',
      id_session: '',
      id_creneau: '',
      id_professeur: ''
    });
    setSessionSearch('');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      await groupeService.delete(deleteConfirmation);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Liste des Groupes</h1>
            <p className="text-sm text-gray-600">Gérez les groupes d'apprenants</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Ajouter un groupe
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">N°</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Nom du groupe</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Professeur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Créneau</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <UserGroupIcon className="mx-auto h-16 w-16 opacity-30 mb-4 text-blue-600" />
                    <p className="text-lg font-medium text-gray-600">Aucun groupe trouvé</p>
                    <p className="text-sm text-gray-500 mt-1">Commencez par ajouter un groupe</p>
                  </td>
                </tr>
              ) : (
                groupes.map((groupe, index) => {
                  const creneau = creneaux.find(c => c.id === groupe.id_creneau);
                  
                  // Try multiple ways to get professor name
                  let professeurName = null;
                  
                  // Method 1: From backend JOIN (nom_prof, prenom_prof)
                  if (groupe.nom_prof && groupe.prenom_prof) {
                    professeurName = `${groupe.nom_prof} ${groupe.prenom_prof}`;
                  }
                  // Method 2: From professeurs array lookup
                  else if (groupe.id_professeur) {
                    const prof = professeurs.find(p => {
                      return p.id === groupe.id_professeur;
                    });
                    if (prof && prof.nom) {
                      professeurName = `${prof.nom} ${prof.prenom || ''}`;
                    }
                  }
                  
                  console.log(`Groupe ${groupe.nom_groupe}:`, {
                    id_professeur: groupe.id_professeur,
                    nom_prof: groupe.nom_prof,
                    prenom_prof: groupe.prenom_prof,
                    professeurName,
                    professeursCount: professeurs.length
                  });
                  
                  return (
                    <tr key={groupe.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-semibold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">{groupe.nom_groupe}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {professeurName || <span className="text-gray-400">Non assigné</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {creneau ? `${creneau.jour_semaine?.join(', ')} - ${creneau.heure_debut?.substring(0,5)}` : <span className="text-gray-400">Non assigné</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(groupe)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(groupe.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto my-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl sticky top-0">
              <h3 className="text-lg font-semibold">{currentGroupe ? "Modifier le groupe" : "Ajouter un groupe"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Nom du groupe */}
                <div>
                  <label htmlFor="nom_groupe" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du groupe *
                  </label>
                  <input
                    type="text"
                    id="nom_groupe"
                    name="nom_groupe"
                    value={formData.nom_groupe}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Groupe A1 - Lundi 10h"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Recherche de session */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session *
                  </label>
                  <input
                    type="text"
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    placeholder="Rechercher une session..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {sessionSearch && (
                    <div className="mt-1 max-h-32 overflow-y-auto border border-gray-300 rounded-lg bg-white">
                      {getFilteredSessions().length > 0 ? (
                        getFilteredSessions().map(session => (
                          <button
                            key={session.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, id_session: session.id.toString() }));
                              setSessionSearch('');
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b last:border-0"
                          >
                            <div className="font-medium text-sm">{session.nom_session || `${session.mois} ${session.annee}`}</div>
                            <div className="text-xs text-gray-500">{session.nom_type_cours}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">Aucune session trouvée</div>
                      )}
                    </div>
                  )}
                  {formData.id_session && !sessionSearch && (
                    <div className="mt-1 text-xs text-green-600">
                      ✓ Session : {sessions.find(s => s.id === parseInt(formData.id_session))?.nom_session || 'Sélectionnée'}
                    </div>
                  )}
                </div>

                {/* Créneau (filtré par type_cours de la session) */}
                <div>
                  <label htmlFor="id_creneau" className="block text-sm font-medium text-gray-700 mb-1">
                    Créneau *
                  </label>
                  <select
                    id="id_creneau"
                    name="id_creneau"
                    value={formData.id_creneau}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.id_session}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner un créneau</option>
                    {getFilteredCreneaux().map(creneau => (
                      <option key={creneau.id} value={creneau.id}>
                        {creneau.jour_semaine?.join(', ')} - {creneau.heure_debut?.substring(0,5)} à {creneau.heure_fin?.substring(0,5)}
                      </option>
                    ))}
                  </select>
                  {!formData.id_session && (
                    <p className="mt-1 text-xs text-gray-500">Sélectionnez d'abord une session</p>
                  )}
                </div>

                {/* Professeur */}
                <div>
                  <label htmlFor="id_professeur" className="block text-sm font-medium text-gray-700 mb-1">
                    Professeur *
                  </label>
                  <select
                    id="id_professeur"
                    name="id_professeur"
                    value={formData.id_professeur}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un professeur</option>
                    {professeurs.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.nom} {prof.prenom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md">{currentGroupe ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto my-8">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600 text-center mb-6">Êtes-vous sûr de vouloir supprimer ce groupe ?</p>
              <div className="flex space-x-3">
                <button onClick={() => setDeleteConfirmation(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Annuler</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeGroupes;
