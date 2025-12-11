import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import sessionService from '../../services/sessionService';
import typeCoursService from '../../services/typeCoursService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Session = () => {
  const [sessions, setSessions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [formData, setFormData] = useState({
    mois: '',
    annee: '',
    id_type_cours: '',
    date_fin_inscription: '',
    date_debut: '',
    date_fin: '',
    date_exam: ''
  });
  const [loading, setLoading] = useState(true);

  // Charger les données
  const loadSessions = async () => {
    try {
      const data = await sessionService.getAll();
      setSessions(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des sessions');
      console.error(error);
    }
  };

  const loadTypeCours = async () => {
    try {
      const data = await typeCoursService.getAll();
      setTypeCours(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des types de cours');
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadSessions(), loadTypeCours()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Gestionnaires de formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    if (name === 'id_type_cours') {
      processedValue = parseInt(value, 10);
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSession) {
        await sessionService.update(currentSession.id, formData);
        toast.success('Session modifiée avec succès');
      } else {
        await sessionService.create(formData);
        toast.success('Session créée avec succès');
      }
      setIsModalOpen(false);
      loadSessions();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  };

  // Ouvrir le modal pour édition
  const handleEdit = (session) => {
    setCurrentSession(session);
    setFormData({
      mois: session.mois,
      annee: session.annee,
      id_type_cours: session.id_type_cours,
      date_fin_inscription: formatDateForInput(session.date_fin_inscription),
      date_debut: formatDateForInput(session.date_debut),
      date_fin: formatDateForInput(session.date_fin),
      date_exam: formatDateForInput(session.date_exam)
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour création
  const handleAdd = () => {
    setCurrentSession(null);
    setFormData({
      mois: '',
      annee: '',
      id_type_cours: '',
      date_fin_inscription: '',
      date_debut: '',
      date_fin: '',
      date_exam: ''
    });
    setIsModalOpen(true);
  };

  // Supprimer une session
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      try {
        await sessionService.delete(id);
        toast.success('Session supprimée avec succès');
        loadSessions();
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
        <h2 className="text-xl font-semibold">Sessions</h2>
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
                Mois
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Année
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de Cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fin Inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'examen
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.mois}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.annee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {typeCours.find(tc => tc.id === session.id_type_cours)?.nom_type_cours || session.id_type_cours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.date_fin_inscription ? new Date(session.date_fin_inscription).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.date_debut ? new Date(session.date_debut).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.date_fin ? new Date(session.date_fin).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.date_exam ? new Date(session.date_exam).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(session)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
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
        title={currentSession ? "Modifier la session" : "Ajouter une session"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mois" className="block text-sm font-medium text-gray-700">
              Mois
            </label>
            <select
              id="mois"
              name="mois"
              value={formData.mois}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un mois</option>
              <option value="Janvier">Janvier</option>
              <option value="Février">Février</option>
              <option value="Mars">Mars</option>
              <option value="Avril">Avril</option>
              <option value="Mai">Mai</option>
              <option value="Juin">Juin</option>
              <option value="Juillet">Juillet</option>
              <option value="Août">Août</option>
              <option value="Septembre">Septembre</option>
              <option value="Octobre">Octobre</option>
              <option value="Novembre">Novembre</option>
              <option value="Décembre">Décembre</option>
            </select>
          </div>

          <div>
            <label htmlFor="annee" className="block text-sm font-medium text-gray-700">
              Année
            </label>
            <input
              type="number"
              id="annee"
              name="annee"
              value={formData.annee}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
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
              <option value="">Sélectionner un type de cours</option>
              {typeCours.map((tc) => (
                <option key={tc.id} value={tc.id}>
                  {tc.nom_type_cours}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date_fin_inscription" className="block text-sm font-medium text-gray-700">
              Date de fin d'inscription
            </label>
            <input
              type="date"
              id="date_fin_inscription"
              name="date_fin_inscription"
              value={formData.date_fin_inscription}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700">
              Date de début
            </label>
            <input
              type="date"
              id="date_debut"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700">
              Date de fin
            </label>
            <input
              type="date"
              id="date_fin"
              name="date_fin"
              value={formData.date_fin}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date_exam" className="block text-sm font-medium text-gray-700">
              Date d'examen
            </label>
            <input
              type="date"
              id="date_exam"
              name="date_exam"
              value={formData.date_exam}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
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
              {currentSession ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Session;
