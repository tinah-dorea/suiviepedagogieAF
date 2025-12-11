import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import inscriptionService from '../../services/inscriptionService';
import typeCoursService from '../../services/typeCoursService';
import sessionService from '../../services/sessionService';
import niveauService from '../../services/niveauService';
import horaireService from '../../services/horaireService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  id_salle: '',
  id_employe: userId || ''
});

const Prepa = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [horaires, setHoraires] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInscription, setCurrentInscription] = useState(null);
  const currentUserId = useMemo(() => getCurrentUserId(), []);
  const [formData, setFormData] = useState(() => buildInitialForm(currentUserId));
  const [loading, setLoading] = useState(true);

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
          inscriptionsData
        ] = await Promise.all([
          typeCoursService.getAll(),
          sessionService.getAll(),
          niveauService.getAll(),
          horaireService.getAll(),
          inscriptionService.getAll()
        ]);

        const prepaTypeCours = filterTypeCours(typeCoursData, 'prepa');
        setTypeCours(prepaTypeCours);
        setSessions(sessionsData);
        setNiveaux(niveauxData);
        setHoraires(horairesData);
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
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    if (['id_type_cours', 'id_session', 'id_horaire', 'id_niveau', 'id_motivation', 'id_salle'].includes(name)) {
      processedValue = parseInt(value, 10);
    } else if (type === 'checkbox') {
      processedValue = checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error("Impossible d'identifier l'utilisateur connecté.");
      return;
    }

    try {
      const payload = {
        ...formData,
        id_employe: formData.id_employe || currentUserId,
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
      await loadInscriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
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
      id_salle: inscription.id_salle || '',
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

  return (
    <div className="p-4">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Préparation</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de Cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                État
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inscriptions.map((inscription) => (
              <tr key={inscription.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {inscription.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inscription.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inscription.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {typeCours.find(tc => tc.id === inscription.id_type_cours)?.nom_type_cours || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sessions.find(s => s.id === inscription.id_session)?.mois || '-'} {sessions.find(s => s.id === inscription.id_session)?.annee || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inscription.etat_inscription ? 'Inscrit' : 'Réinscrit'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(inscription)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(inscription.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentInscription ? "Modifier l'inscription" : "Ajouter une inscription"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
                Sexe
              </label>
              <select
                id="sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <div>
              <label htmlFor="date_n" className="block text-sm font-medium text-gray-700">
                Date de naissance
              </label>
              <input
                type="date"
                id="date_n"
                name="date_n"
                value={formData.date_n}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="id_type_cours" className="block text-sm font-medium text-gray-700">
              Type de Cours
            </label>
            <select
              id="id_type_cours"
              name="id_type_cours"
              value={formData.id_type_cours}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un type de cours</option>
              {typeCours.map((tc) => (
                <option key={tc.id} value={tc.id}>
                  {tc.nom_type_cours}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="id_session" className="block text-sm font-medium text-gray-700">
                Session
              </label>
              <select
                id="id_session"
                name="id_session"
                value={formData.id_session}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez une session</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.mois} {s.annee}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="id_niveau" className="block text-sm font-medium text-gray-700">
                Niveau
              </label>
              <select
                id="id_niveau"
                name="id_niveau"
                value={formData.id_niveau}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez un niveau</option>
                {niveaux.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nom_niveau}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="id_horaire" className="block text-sm font-medium text-gray-700">
                Horaire
              </label>
              <select
                id="id_horaire"
                name="id_horaire"
                value={formData.id_horaire}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez un horaire</option>
                {horaires.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.heure_debut} - {h.heure_fin}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="num_carte" className="block text-sm font-medium text-gray-700">
                Numéro de carte
              </label>
              <input
                type="text"
                id="num_carte"
                name="num_carte"
                value={formData.num_carte}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="etablissement" className="block text-sm font-medium text-gray-700">
                Établissement
              </label>
              <input
                type="text"
                id="etablissement"
                name="etablissement"
                value={formData.etablissement}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <textarea
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="niveau_scolaire" className="block text-sm font-medium text-gray-700">
                Niveau scolaire
              </label>
              <input
                type="text"
                id="niveau_scolaire"
                name="niveau_scolaire"
                value={formData.niveau_scolaire}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lieu_n" className="block text-sm font-medium text-gray-700">
                Lieu de naissance
              </label>
              <input
                type="text"
                id="lieu_n"
                name="lieu_n"
                value={formData.lieu_n}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="nationalite" className="block text-sm font-medium text-gray-700">
              Nationalité
            </label>
            <input
              type="text"
              id="nationalite"
              name="nationalite"
              value={formData.nationalite}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="etat_inscription"
              name="etat_inscription"
              checked={formData.etat_inscription}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="etat_inscription" className="ml-2 block text-sm text-gray-900">
              Inscription (décochez pour réinscription)
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {currentInscription ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Prepa;
