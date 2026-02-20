import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import inscriptionService from '../../services/inscriptionService';
import typeCoursService from '../../services/typeCoursService';
import sessionService from '../../services/sessionService';
import niveauService from '../../services/niveauService';
import horaireService from '../../services/horaireService';
import creneauService from '../../services/creneauService';
import salleService from '../../services/salleService';
import { PencilIcon, TrashIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const getCurrentUserId = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    return stored?.id || null;
  } catch (error) {
    console.error('Impossible de lire le user depuis le localStorage', error);
    return null;
  }
};

const normalizeValue = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const filterTypeCours = (list = [], keyword = '') => {
  const needle = normalizeValue(keyword);
  return list.filter((tc) => {
    const byName = tc.nom_type_cours && normalizeValue(tc.nom_type_cours).includes(needle);
    const byService = tc.nom_service && normalizeValue(tc.nom_service).includes(needle);
    return byName || byService;
  });
};

const filterInscriptionsByType = (inscriptions = [], types = []) => {
  if (!types.length) return [];
  const allowedIds = new Set(types.map((tc) => tc.id));
  return inscriptions.filter((inscription) => allowedIds.has(inscription.id_type_cours));
};

const buildInitialForm = (userId = null) => ({
  id_type_cours: '',
  id_session: '',
  id_horaire: '',
  id_niveau: '',
  num_carte: '',
  etat_inscription: true,
  sexe: '',
  nom: '',
  prenom: '',
  date_n: '',
  adresse: '',
  tel: '',
  id_motivation: '',
  etablissement: '',
  niveau_scolaire: '',
  lieu_n: '',
  nationalite: '',
  id_salle: '', // Can be empty/optional
  id_creneau: '', // New field
  email: '',
  id_employe: userId || ''
});

const Prepa = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [sessions, setSessions] = useState([]); // Variable utilisée
  const [niveaux, setNiveaux] = useState([]); // Variable utilisée
  const [horaires, setHoraires] = useState([]); // Variable utilisée
  const [creneaux, setCreneaux] = useState([]); // Add creneaux state
  const [salles, setSalles] = useState([]); // Add salles state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentInscription, setCurrentInscription] = useState(null);
  const currentUserId = useMemo(() => getCurrentUserId(), []);
  const [formData, setFormData] = useState(() => buildInitialForm(currentUserId));
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [error, setError] = useState(''); // Add the error state variable

  const loadInscriptions = async (typesOverride) => {
    try {
      const data = await inscriptionService.getAll();
      const filtered = filterInscriptionsByType(data, typesOverride || typeCours);
      setInscriptions(filtered);
    } catch (error) {
      toast.error('Erreur lors du chargement des inscriptions');
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          typeCoursData,
          sessionsData,
          niveauxData,
          horairesData,
          inscriptionsData,
          creneauxData, // Load creneaux data
          sallesData   // Load salles data
        ] = await Promise.all([
          typeCoursService.getAll(),
          sessionService.getAll(),
          niveauService.getAll(),
          horaireService.getAll(),
          inscriptionService.getAll(),
          creneauService.getAll(), // Fetch creneaux
          salleService.getAll()     // Fetch salles
        ]);

        const prepaTypeCours = filterTypeCours(typeCoursData, 'prepa');
        setTypeCours(prepaTypeCours);
        setSessions(sessionsData);
        setNiveaux(niveauxData);
        setHoraires(horairesData);
        setCreneaux(creneauxData); // Set creneaux
        setSalles(sallesData);     // Set salles
        setInscriptions(filterInscriptionsByType(inscriptionsData, prepaTypeCours));
      } catch (error) {
        toast.error('Erreur lors du chargement des données');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Gestionnaires de formulaire
  const handleInputChange = (e) => { // Fonction utilisée dans le modal
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    if (['id_type_cours', 'id_session', 'id_horaire', 'id_niveau', 'id_motivation', 'id_salle', 'id_creneau'].includes(name)) {
      processedValue = value === '' ? '' : parseInt(value, 10);
    } else if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'email') {
      processedValue = value; // Handle email field
    }
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => { // Fonction utilisée dans le modal
    e.preventDefault();
    if (!currentUserId) {
      setError("Impossible d'identifier l'utilisateur connecté.");
      return;
    }

    try {
      // Prepare payload, ensuring id_salle and id_creneau can be null if not selected
      const payload = {
        ...formData,
        id_employe: formData.id_employe || currentUserId,
        id_salle: formData.id_salle === '' ? null : formData.id_salle,  // Make optional
        id_creneau: formData.id_creneau === '' ? null : formData.id_creneau  // Make optional
      };

      if (currentInscription) {
        await inscriptionService.update(currentInscription.id, payload);
        toast.success('Inscription modifiée avec succès');
      } else {
        await inscriptionService.create(payload);
        toast.success('Inscription créée avec succès');
      }
      setIsModalOpen(false);
      setCurrentInscription(null);
      setFormData(buildInitialForm(currentUserId));
      setError(''); // Clear any error
      await loadInscriptions();
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (inscription) => {
    setCurrentInscription(inscription);
    setFormData({
      id_type_cours: inscription.id_type_cours || '',
      id_session: inscription.id_session || '',
      id_horaire: inscription.id_horaire || '',
      id_niveau: inscription.id_niveau || '',
      num_carte: inscription.num_carte || '',
      etat_inscription: inscription.etat_inscription,
      sexe: inscription.sexe || '',
      nom: inscription.nom || '',
      prenom: inscription.prenom || '',
      date_n: inscription.date_n ? inscription.date_n.split('T')[0] : '',
      adresse: inscription.adresse || '',
      tel: inscription.tel || '',
      id_motivation: inscription.id_motivation || '',
      etablissement: inscription.etablissement || '',
      niveau_scolaire: inscription.niveau_scolaire || '',
      lieu_n: inscription.lieu_n || '',
      nationalite: inscription.nationalite || '',
      id_salle: inscription.id_salle || '', // Can be empty
      id_creneau: inscription.id_creneau || '', // New field
      email: inscription.email || '',
      id_employe: inscription.id_employe || currentUserId || ''
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentInscription(null);
    setFormData(buildInitialForm(currentUserId));
    setIsModalOpen(true);
  };

  // Supprimer une inscription
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      try {
        await inscriptionService.delete(id);
        toast.success('Inscription supprimée avec succès');
        await loadInscriptions();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  const filteredInscriptions = inscriptions.filter(inscription => 
    !searchTerm || 
    normalizeValue(inscription.nom).includes(normalizeValue(searchTerm)) ||
    normalizeValue(inscription.prenom).includes(normalizeValue(searchTerm)) ||
    normalizeValue(inscription.num_carte).includes(normalizeValue(searchTerm))
  );

  return (
    <div className="p-4">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Inscriptions Prépa</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Ajouter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">N°</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:hidden md:table-cell">N°</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInscriptions.map((inscription, index) => (
                <tr key={inscription.id} className="sm:table-row flex flex-col mb-4 border border-gray-300 rounded-lg p-3 sm:p-0 sm:border-0 sm:rounded-none">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:hidden">
                    <span className="font-bold">N°:</span> {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{inscription.nom} {inscription.prenom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {new Date(inscription.date_inscription).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${inscription.etat_inscription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {inscription.etat_inscription ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sm:absolute sm:right-2">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === inscription.id ? null : inscription.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      
                      {openMenuId === inscription.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                          <button
                            onClick={() => {
                              handleEdit(inscription);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Éditer
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(inscription.id);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentInscription(null);
          setFormData(buildInitialForm(currentUserId));
        }}
        title={currentInscription ? "Modifier l'inscription" : "Ajouter une inscription"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom *</label>
              <input
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom *</label>
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
              <input
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input
                type="date"
                name="date_n"
                value={formData.date_n}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
              <input
                name="lieu_n"
                value={formData.lieu_n}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nationalité</label>
              <input
                name="nationalite"
                value={formData.nationalite}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sexe</label>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Niveau scolaire</label>
              <input
                name="niveau_scolaire"
                value={formData.niveau_scolaire}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Établissement</label>
              <input
                name="etablissement"
                value={formData.etablissement}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de carte</label>
              <input
                name="num_carte"
                value={formData.num_carte}
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
                <option value="">Sélectionnez</option>
                {typeCours.map((tc) => (
                  <option key={tc.id} value={tc.id}>{tc.nom_type_cours}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Session</label>
              <select
                name="id_session"
                value={formData.id_session}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>{s.nom_session}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Niveau</label>
              <select
                name="id_niveau"
                value={formData.id_niveau}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                {niveaux.map((n) => (
                  <option key={n.id} value={n.id}>{n.nom_niveau}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horaire</label>
              <select
                name="id_horaire"
                value={formData.id_horaire}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                {horaires.map((h) => (
                  <option key={h.id} value={h.id}>{h.jours_des_cours} - {h.heure_debut} à {h.heure_fin}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Créneau</label>
              <select
                name="id_creneau"
                value={formData.id_creneau}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                {creneaux.map((c) => (
                  <option key={c.id} value={c.id}>{c.jour_semaine} - {c.heure_debut} à {c.heure_fin}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Salle</label>
              <select
                name="id_salle"
                value={formData.id_salle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                {salles.map((s) => (
                  <option key={s.id} value={s.id}>{s.nom_salle} (Capacité: {s.capacite})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Motivation</label>
              <select
                name="id_motivation"
                value={formData.id_motivation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                <option value={1}>Bourse</option>
                <option value={2}>Réduction</option>
                <option value={3}>Autre</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="etat_inscription"
                  checked={formData.etat_inscription}
                  onChange={(e) => setFormData(prev => ({...prev, etat_inscription: e.target.checked}))}
                  className="mr-2"
                />
                État d'inscription (actif)
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setCurrentInscription(null);
                setFormData(buildInitialForm(currentUserId));
              }}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {currentInscription ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Prepa;