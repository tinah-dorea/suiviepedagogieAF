import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sessionService from '../../services/sessionService';
import creneauService from '../../services/creneauService';
import professeurService from '../../services/professeurService';
import inscriptionService from '../../services/inscriptionService';
import apprenantService from '../../services/apprenantService';
import groupeService from '../../services/groupeService';
import { AcademicCapIcon, UserGroupIcon, CalendarIcon, ClockIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  statBlue: '#C7CEEA',
  statBlueText: '#5A5F8C',
  statGreen: '#B5EAD7',
  statGreenText: '#2D7A5F',
};

const AttributionGroupes = () => {
  const [formData, setFormData] = useState({
    nom_groupe: '',
    id_session: '',
    id_creneau: '',
    id_professeur: '',
    nombre_apprenants: ''
  });
  const [sessions, setSessions] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [apprenants, setApprenants] = useState([]);
  const [selectedApprenants, setSelectedApprenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApprenantsList, setShowApprenantsList] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [sessionsData, professeursData] = await Promise.all([
        sessionService.getAll(),
        professeurService.getAll()
      ]);
      setSessions(sessionsData);
      // Map professeur data to handle nom_employe/prenom_employe fields
      const mappedProfesseurs = professeursData.map(prof => ({
        ...prof,
        nom: prof.nom_employe || prof.nom,
        prenom: prof.prenom_employe || prof.prenom,
        email: prof.email_employe || prof.email,
        tel: prof.tel_employe || prof.tel
      }));
      setProfesseurs(mappedProfesseurs);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
    }
  };

  useEffect(() => {
    if (formData.id_session) {
      loadCreneauxBySession();
    }
  }, [formData.id_session]);

  useEffect(() => {
    if (formData.id_creneau) {
      loadApprenants();
    }
  }, [formData.id_creneau]);

  const loadCreneauxBySession = async () => {
    try {
      const session = sessions.find(s => s.id === parseInt(formData.id_session));
      if (session && session.id_type_cours) {
        const creneauxData = await creneauService.getAll();
        const filteredCreneaux = creneauxData.filter(c =>
          c.id_type_cours === session.id_type_cours
        );
        setCreneaux(filteredCreneaux);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
    }
  };

  const loadApprenants = async () => {
    try {
      const [inscriptions, apprenantsData] = await Promise.all([
        inscriptionService.getAll(),
        apprenantService.getAll()
      ]);
      
      const filteredInscriptions = inscriptions.filter(ins =>
        ins.id_session === parseInt(formData.id_session) &&
        ins.id_creneau === parseInt(formData.id_creneau)
      );
      
      // Map inscriptions with apprenant data
      const apprenantsWithDetails = filteredInscriptions.map(ins => {
        const apprenant = apprenantsData.find(a => a.id === ins.id_apprenant);
        return {
          id: ins.id,
          id_apprenant: ins.id_apprenant,
          nom: apprenant?.nom || 'Non défini',
          prenom: apprenant?.prenom || 'Non défini',
          email: apprenant?.email || '',
          tel: apprenant?.tel || '',
          statut: apprenant?.statut || 'actif'
        };
      });
      
      setApprenants(apprenantsWithDetails);
      setShowApprenantsList(true);
    } catch (error) {
      toast.error('Erreur lors du chargement des apprenants');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'id_session') {
      setFormData(prev => ({ ...prev, id_creneau: '' }));
      setCreneaux([]);
      setApprenants([]);
      setShowApprenantsList(false);
      setSelectedApprenants([]);
    }
    if (name === 'id_creneau') {
      setApprenants([]);
      setShowApprenantsList(false);
      setSelectedApprenants([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSessions = sessions.filter(session =>
    session.nom_session?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.mois?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.annee?.toString().includes(searchTerm)
  );

  const handleSelectApprenant = (id) => {
    setSelectedApprenants(prev => {
      if (prev.includes(id)) {
        return prev.filter(appId => appId !== id);
      } else {
        const maxStudents = parseInt(formData.nombre_apprenants) || 0;
        if (prev.length >= maxStudents && maxStudents > 0) {
          toast.warning(`Nombre maximum d'apprenants atteint (${maxStudents})`);
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    const maxStudents = parseInt(formData.nombre_apprenants) || 0;
    if (maxStudents > 0 && apprenants.length > maxStudents) {
      setSelectedApprenants(apprenants.slice(0, maxStudents).map(a => a.id));
      toast.warning(`Sélection limitée à ${maxStudents} apprenants`);
    } else {
      setSelectedApprenants(apprenants.map(a => a.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedApprenants([]);
  };

  const handleSubmit = async () => {
    if (!formData.nom_groupe) {
      toast.error('Veuillez saisir le nom du groupe');
      return;
    }
    if (!formData.id_session) {
      toast.error('Veuillez sélectionner une session');
      return;
    }
    if (!formData.id_creneau) {
      toast.error('Veuillez sélectionner un créneau');
      return;
    }
    if (!formData.id_professeur) {
      toast.error('Veuillez sélectionner un professeur');
      return;
    }
    if (selectedApprenants.length === 0) {
      toast.error('Veuillez sélectionner au moins un apprenant');
      return;
    }

    setLoading(true);
    try {
      const groupeData = {
        nom_groupe: formData.nom_groupe,
        id_creneau: parseInt(formData.id_creneau),
        id_professeur: parseInt(formData.id_professeur)
      };

      const nouveauGroupe = await groupeService.create(groupeData);

      const updatePromises = selectedApprenants.map(id =>
        inscriptionService.update(id, { id_groupe: nouveauGroupe.id })
      );

      await Promise.all(updatePromises);

      toast.success(`Groupe "${formData.nom_groupe}" créé avec succès ! ${selectedApprenants.length} apprenant(s) affecté(s).`);

      setFormData({
        nom_groupe: '',
        id_session: '',
        id_creneau: '',
        id_professeur: '',
        nombre_apprenants: ''
      });
      setCreneaux([]);
      setApprenants([]);
      setSelectedApprenants([]);
      setShowApprenantsList(false);
      setSearchTerm('');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du groupe');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Attribution des Groupes</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Assignez les apprenants aux groupes</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl shadow-sm border p-6 space-y-6" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        {/* Nom du groupe */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
            Nom du groupe *
          </label>
          <input
            type="text"
            name="nom_groupe"
            value={formData.nom_groupe}
            onChange={handleInputChange}
            placeholder="Ex: Groupe A1 - Lundi 10h"
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
          />
        </div>

        {/* Recherche de session */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
            Rechercher une session *
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Rechercher par nom, mois ou année..."
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
          />

          {/* Liste des sessions filtrées */}
          <div className="mt-2 max-h-48 overflow-y-auto border-2 rounded-xl" style={{ borderColor: COLORS.border }}>
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, id_session: session.id }));
                    setSearchTerm('');
                  }}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    formData.id_session === session.id ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="font-semibold" style={{ color: COLORS.text }}>{session.nom_session || `${session.mois} ${session.annee}`}</div>
                  <div className="text-sm" style={{ color: COLORS.textLight }}>
                    {session.nom_type_cours} | {session.nb_inscrits || 0} inscrits
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center" style={{ color: COLORS.textLight }}>Aucune session trouvée</div>
            )}
          </div>

          {formData.id_session && (
            <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: COLORS.statGreenText }}>
              <CheckCircleIcon className="w-4 h-4" />
              <span className="font-medium">Session sélectionnée : {sessions.find(s => s.id === formData.id_session)?.nom_session || `${sessions.find(s => s.id === formData.id_session)?.mois} ${sessions.find(s => s.id === formData.id_session)?.annee}`}</span>
            </div>
          )}
        </div>

        {/* Liste des créneaux */}
        {creneaux.length > 0 && (
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
              Sélectionner un créneau *
            </label>
            <select
              name="id_creneau"
              value={formData.id_creneau}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
            >
              <option value="">Choisir un créneau</option>
              {creneaux.map(creneau => (
                <option key={creneau.id} value={creneau.id}>
                  {creneau.jour_semaine?.join(', ')} - {creneau.heure_debut?.substring(0,5)} à {creneau.heure_fin?.substring(0,5)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Professeur */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
            Sélectionner un professeur *
          </label>
          <select
            name="id_professeur"
            value={formData.id_professeur}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
          >
            <option value="">Choisir un professeur</option>
            {professeurs.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.nom} {prof.prenom}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre d'apprenants */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
            Nombre d'apprenants à sélectionner
          </label>
          <input
            type="number"
            name="nombre_apprenants"
            value={formData.nombre_apprenants}
            onChange={handleInputChange}
            min="1"
            placeholder="Laisser vide pour tous les sélectionner"
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
          />
        </div>

        {/* Liste des apprenants */}
        {showApprenantsList && apprenants.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold" style={{ color: COLORS.text }}>
                Apprenants inscrits ({apprenants.length})
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:shadow-md"
                  style={{ backgroundColor: COLORS.statBlue, color: COLORS.statBlueText }}
                >
                  Tout sélectionner
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:shadow-md"
                  style={{ backgroundColor: COLORS.border, color: COLORS.textLight }}
                >
                  Tout déselectionner
                </button>
              </div>
            </div>

            <div className="border-2 rounded-xl overflow-hidden" style={{ borderColor: COLORS.border }}>
              <div className="max-h-64 overflow-y-auto">
                {apprenants.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="mt-2">Aucun apprenant trouvé pour cette session et ce créneau</p>
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead style={{ backgroundColor: COLORS.accent }}>
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedApprenants.length === apprenants.length && apprenants.length > 0}
                            onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                            className="rounded"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Prénom</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: COLORS.text }}>Téléphone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apprenants.map(apprenant => (
                        <tr
                          key={apprenant.id}
                          className={`transition-colors ${selectedApprenants.includes(apprenant.id) ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedApprenants.includes(apprenant.id)}
                              onChange={() => handleSelectApprenant(apprenant.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-medium" style={{ color: COLORS.text }}>{apprenant.nom}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: COLORS.textLight }}>{apprenant.prenom}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: COLORS.textLight }}>{apprenant.email || '—'}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: COLORS.textLight }}>{apprenant.tel || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: COLORS.textLight }}>
              <span className="font-semibold" style={{ color: COLORS.primary }}>{selectedApprenants.length}</span>
              <span>apprenant(s) sélectionné(s)</span>
              {formData.nombre_apprenants && (
                <span> / {formData.nombre_apprenants} maximum</span>
              )}
            </div>
          </div>
        )}

        {/* Bouton Valider */}
        <div className="flex justify-end pt-4 border-t" style={{ borderColor: COLORS.border }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: COLORS.gradient }}
          >
            {loading ? 'Création en cours...' : 'Valider le groupe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributionGroupes;
