import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import inscriptionService from '../../services/inscriptionService';
import examenService from '../../services/examenService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const initialFormState = {
  id_inscription: '',
  etat_inscription: true,
  auto_inscription: false,
  verification: false
};

const Examen = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [examens, setExamens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExamen, setCurrentExamen] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const availableInscriptions = useMemo(() => {
    const assigned = new Set(examens.map((ex) => ex.id_inscription));
    return inscriptions.filter((inscription) => !assigned.has(inscription.id));
  }, [inscriptions, examens]);

  const selectableInscriptions = useMemo(() => {
    if (!currentExamen) {
      return availableInscriptions;
    }
    const current = inscriptions.find((ins) => ins.id === currentExamen.id_inscription);
    if (!current) {
      return availableInscriptions;
    }
    const map = new Map();
    [current, ...availableInscriptions].forEach((ins) => {
      if (ins) {
        map.set(ins.id, ins);
      }
    });
    return Array.from(map.values());
  }, [availableInscriptions, currentExamen, inscriptions]);

  const loadInscriptions = async () => {
    try {
      const data = await inscriptionService.getAll();
      setInscriptions(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des inscriptions');
      console.error(error);
    }
  };

  const loadExamens = async () => {
    try {
      const data = await examenService.getAll();
      setExamens(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des examens');
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadInscriptions(), loadExamens()]);
      } catch (error) {
        toast.error('Erreur lors du chargement des examens');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const openModal = (examen = null) => {
    if (examen) {
      setCurrentExamen(examen);
      setFormData({
        id_inscription: examen.id_inscription || '',
        etat_inscription: examen.etat_inscription ?? true,
        auto_inscription: examen.auto_inscription ?? false,
        verification: examen.verification ?? false
      });
    } else {
      setCurrentExamen(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExamen(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    let processedValue = value;
    if (type === 'checkbox') {
      processedValue = checked;
    }
    if (name === 'id_inscription') {
      processedValue = value ? parseInt(value, 10) : '';
    }
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_inscription) {
      toast.error('Veuillez sélectionner une inscription.');
      return;
    }

    const payload = {
      id_inscription: formData.id_inscription,
      etat_inscription: !!formData.etat_inscription,
      auto_inscription: !!formData.auto_inscription,
      verification: !!formData.verification
    };

    try {
      if (currentExamen) {
        await examenService.update(currentExamen.id, payload);
        toast.success('Examen mis à jour avec succès');
      } else {
        await examenService.create(payload);
        toast.success('Examen créé avec succès');
      }
      await Promise.all([loadExamens(), loadInscriptions()]);
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde de l’examen');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cet examen ?')) {
      return;
    }
    try {
      await examenService.delete(id);
      toast.success('Examen supprimé avec succès');
      await Promise.all([loadExamens(), loadInscriptions()]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleToggleField = async (examenId, field, value) => {
    try {
      await examenService.update(examenId, { [field]: value });
      toast.success('Examen mis à jour');
      loadExamens();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Examens</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                État
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auto-inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vérification
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {examens.map((examen) => (
              <tr key={examen.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{examen.id_inscription} — {examen.nom} {examen.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {examen.nom_type_cours || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {examen.mois ? `${examen.mois} ${examen.annee || ''}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={!!examen.etat_inscription}
                    onChange={(e) => handleToggleField(examen.id, 'etat_inscription', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={!!examen.auto_inscription}
                    onChange={(e) => handleToggleField(examen.id, 'auto_inscription', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={!!examen.verification}
                    onChange={(e) => handleToggleField(examen.id, 'verification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => openModal(examen)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(examen.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentExamen ? 'Modifier un examen' : 'Créer un examen'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="id_inscription" className="block text-sm font-medium text-gray-700">
              Inscription
            </label>
            <select
              id="id_inscription"
              name="id_inscription"
              value={formData.id_inscription}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez une inscription</option>
              {selectableInscriptions.map((inscription) => (
                <option key={inscription.id} value={inscription.id}>
                  #{inscription.id} — {inscription.nom} {inscription.prenom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="etat_inscription"
                checked={formData.etat_inscription}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>Inscription complète</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="auto_inscription"
                checked={formData.auto_inscription}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>Auto-inscription</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="verification"
                checked={formData.verification}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>Vérifié</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {currentExamen ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Examen;
