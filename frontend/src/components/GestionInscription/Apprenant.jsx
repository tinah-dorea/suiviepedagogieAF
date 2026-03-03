import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apprenantService from '../../services/apprenantService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Apprenant = () => {
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentApprenant, setCurrentApprenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [apprenantToDelete, setApprenantToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loadError, setLoadError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_n: '',
    sexe: 'Autre',
    adresse: '',
    tel: '',
    email: '',
    nationalite: '',
    lieu_n: '',
    etablissement: '',
    niveau_scolaire: '',
    statut: 'actif'
  });

  useEffect(() => {
    loadApprenants();
  }, []);

  const loadApprenants = async () => {
    try {
      setLoadError('');
      const data = await apprenantService.getAll();
      setApprenants(data);
      setLoading(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des apprenants. Veuillez vérifier votre connexion.';
      setLoadError('✗ ' + errorMsg);
      toast.error(errorMsg);
      console.error(error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    setCurrentApprenant(null);
    setFormData({
      nom: '',
      prenom: '',
      date_n: '',
      sexe: 'Autre',
      adresse: '',
      tel: '',
      email: '',
      nationalite: '',
      lieu_n: '',
      etablissement: '',
      niveau_scolaire: '',
      statut: 'actif'
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleEdit = (apprenant) => {
    setCurrentApprenant(apprenant);
    setFormData({
      nom: apprenant.nom || '',
      prenom: apprenant.prenom || '',
      date_n: apprenant.date_n ? apprenant.date_n.split('T')[0] : '',
      sexe: apprenant.sexe || 'Autre',
      adresse: apprenant.adresse || '',
      tel: apprenant.tel || '',
      email: apprenant.email || '',
      nationalite: apprenant.nationalite || '',
      lieu_n: apprenant.lieu_n || '',
      etablissement: apprenant.etablissement || '',
      niveau_scolaire: apprenant.niveau_scolaire || '',
      statut: apprenant.statut || 'actif'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validations
    if (!formData.nom || !formData.nom.trim()) {
      const msg = 'Le nom est requis';
      setFormError('✗ ' + msg);
      toast.error(msg);
      return;
    }

    if (!formData.prenom || !formData.prenom.trim()) {
      const msg = 'Le prénom est requis';
      setFormError('✗ ' + msg);
      toast.error(msg);
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const msg = 'Veuillez entrer un email valide';
      setFormError('✗ ' + msg);
      toast.error(msg);
      return;
    }

    try {
      if (currentApprenant) {
        await apprenantService.update(currentApprenant.id, formData);
        setFormSuccess('✓ Apprenant modifié avec succès');
        toast.success('Apprenant modifié avec succès');
      } else {
        await apprenantService.create(formData);
        setFormSuccess('✓ Apprenant créé avec succès');
        toast.success('Apprenant créé avec succès');
      }
      setIsModalOpen(false);
      setCurrentApprenant(null);
      loadApprenants();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Une erreur est survenue lors de l'enregistrement";
      setFormError('✗ ' + errorMsg);
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const prepareDelete = (apprenant) => {
    setApprenantToDelete(apprenant);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      setFormError('');
      await apprenantService.remove(apprenantToDelete.id);
      setFormSuccess('✓ Apprenant supprimé avec succès');
      toast.success('Apprenant supprimé avec succès');
      loadApprenants();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Une erreur est survenue lors de la suppression";
      setFormError('✗ ' + errorMsg);
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setShowConfirmation(false);
      setApprenantToDelete(null);
    }
  };

  const filteredApprenants = apprenants.filter(app => {
    const fullName = `${app.nom} ${app.prenom}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || app.email?.toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* Header et bouton Ajouter */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Gestion des Apprenants</h3>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-teal-400 to-teal-500 text-white px-5 py-2.5 rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md hover:shadow-lg font-medium"
        >
          Ajouter un apprenant
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom, prénom ou email..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tableau des apprenants */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">N°</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Naiss.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationalité</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApprenants.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                    Aucun apprenant trouvé
                  </td>
                </tr>
              ) : (
                filteredApprenants.map((apprenant, index) => (
                  <tr key={apprenant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {apprenant.nom}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {apprenant.prenom}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {apprenant.date_n ? new Date(apprenant.date_n).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {apprenant.sexe || '—'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {apprenant.email || '—'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {apprenant.tel || '—'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {apprenant.nationalite || '—'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apprenant.statut === 'actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apprenant.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(apprenant)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => prepareDelete(apprenant)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirmer la suppression</h3>
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer l'apprenant "{apprenantToDelete?.nom} {apprenantToDelete?.prenom}" ?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto my-8">
            <div className="px-6 py-5 border-b flex items-center justify-between bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-t-xl sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">{currentApprenant ? "Modifier l'apprenant" : "Ajouter un apprenant"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                {formError && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300 font-medium">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-green-100 text-green-700 rounded-lg border border-green-300 font-medium">
                    {formSuccess}
                  </div>
                )}

                {/* Section 1: Informations personnelles */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Informations personnelles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                      <input
                        type="date"
                        name="date_n"
                        value={formData.date_n}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                      <select
                        name="sexe"
                        value={formData.sexe}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner</option>
                        <option>Homme</option>
                        <option>Femme</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Coordonnées */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Coordonnées</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                      <input
                        type="text"
                        name="nationalite"
                        value={formData.nationalite}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Section 3: Informations scolaires */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Informations scolaires</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                      <input
                        type="text"
                        name="lieu_n"
                        value={formData.lieu_n}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niveau scolaire</label>
                      <input
                        type="text"
                        name="niveau_scolaire"
                        value={formData.niveau_scolaire}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Terminale, 1ère..."
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
                    <input
                      type="text"
                      name="etablissement"
                      value={formData.etablissement}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom de l'école/lycée"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="actif">Actif</option>
                      <option value="abandon">Abandon</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  {currentApprenant ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apprenant;
