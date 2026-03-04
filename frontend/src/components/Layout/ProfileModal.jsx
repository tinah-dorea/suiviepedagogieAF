import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateEmploye } from '../../services/employeService';
import apprenantService from '../../services/apprenantService';
import api from '../../services/api';

export default function ProfileModal({ isOpen, onClose }) {
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    adresse: '',
    age: '',
    role: '',
    service: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [editing, setEditing] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser) {
        setUserData({
          nom: storedUser.nom || '',
          prenom: storedUser.prenom || '',
          email: storedUser.email || '',
          tel: storedUser.tel || '',
          adresse: storedUser.adresse || '',
          age: storedUser.age || '',
          role: storedUser.role || '',
          service: storedUser.service || ''
        });
      }
      setEditing(false);
      setError('');
      setMessage('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validations
      if (!userData.nom || !userData.nom.trim()) {
        throw { response: { data: { message: 'Le nom est requis' } } };
      }
      if (!userData.prenom || !userData.prenom.trim()) {
        throw { response: { data: { message: 'Le prénom est requis' } } };
      }
      if (!userData.email || !userData.email.trim()) {
        throw { response: { data: { message: 'L\'email est requis' } } };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw { response: { data: { message: 'Veuillez entrer un email valide' } } };
      }
      if (userData.age && (userData.age < 18 || userData.age > 100)) {
        throw { response: { data: { message: 'L\'âge doit être entre 18 et 100 ans' } } };
      }

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      let updatedData;

      // Use appropriate service based on user type
      if (storedUser.service === 'apprenants') {
        updatedData = await apprenantService.update(storedUser.id, userData);
      } else {
        updatedData = await updateEmploye(storedUser.id, userData);
      }

      // Update the local storage with new data
      const updatedUser = { ...storedUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMessage('✓ Profil mis à jour avec succès!');
      setMessageType('success');
      setEditing(false);

      // Auto-clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Une erreur est survenue lors de la mise à jour du profil";
      setError('✗ ' + errorMsg);
      setMessageType('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData({
      nom: storedUser.nom || '',
      prenom: storedUser.prenom || '',
      email: storedUser.email || '',
      tel: storedUser.tel || '',
      adresse: storedUser.adresse || '',
      age: storedUser.age || '',
      role: storedUser.role || '',
      service: storedUser.service || ''
    });
    setEditing(false);
    setEditingPassword(false);
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setError('');
    setMessage('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validations
      if (!passwordData.current_password) {
        throw { response: { data: { message: 'Le mot de passe actuel est requis' } } };
      }
      if (!passwordData.new_password) {
        throw { response: { data: { message: 'Le nouveau mot de passe est requis' } } };
      }
      if (passwordData.new_password.length < 6) {
        throw { response: { data: { message: 'Le mot de passe doit contenir au moins 6 caractères' } } };
      }
      if (passwordData.new_password !== passwordData.confirm_password) {
        throw { response: { data: { message: 'Les nouveaux mots de passe ne correspondent pas' } } };
      }

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Determine endpoint based on user type
      const endpoint = storedUser.service === 'apprenants'
        ? `/apprenants/${storedUser.id}/password`
        : `/employes/${storedUser.id}/password`;

      // Call API to update password
      await api.put(endpoint, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });

      setMessage('✓ Mot de passe mis à jour avec succès!');
      setMessageType('success');
      setEditingPassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });

      // Auto-clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Une erreur est survenue lors de la mise à jour du mot de passe";
      setError('✗ ' + errorMsg);
      setMessageType('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal floating */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Mon Profil</h1>
              <p className="opacity-80 text-sm">Gérez vos informations personnelles</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {message && (
              <div className={`mb-4 p-3 rounded-lg font-medium ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {!editing ? (
                // View Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                      <p className="text-lg font-semibold text-gray-900">{userData.nom}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Prénom</h3>
                      <p className="text-lg font-semibold text-gray-900">{userData.prenom}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-lg text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                      <p className="text-lg text-gray-900">{userData.tel || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Service</h3>
                      <p className="text-lg text-gray-900">{userData.service || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                      <p className="text-lg text-gray-900">{userData.role || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Âge</h3>
                      <p className="text-lg text-gray-900">{userData.age || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                      <p className="text-lg text-gray-900">{userData.adresse || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="pt-4 flex space-x-3">
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Modifier le profil
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        name="nom"
                        value={userData.nom}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input
                        type="text"
                        name="prenom"
                        value={userData.prenom}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        name="tel"
                        value={userData.tel}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                      <input
                        type="text"
                        value={userData.service || ''}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                      <input
                        type="text"
                        value={userData.role || ''}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Le rôle ne peut pas être modifié par vous-même</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                      <input
                        type="number"
                        name="age"
                        value={userData.age}
                        onChange={handleInputChange}
                        min="18"
                        max="100"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">Entre 18 et 100 ans</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                      <input
                        type="text"
                        name="adresse"
                        value={userData.adresse}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex space-x-3 border-t">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? '⏳ Enregistrement...' : '✓ Enregistrer'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Annuler
                    </button>
                  </div>

                  {/* Password Change Section */}
                  <div className="pt-6 border-t mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Changer le mot de passe</h3>
                      {!editingPassword && (
                        <button
                          onClick={() => setEditingPassword(true)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Modifier
                        </button>
                      )}
                    </div>

                    {!editingPassword ? (
                      <p className="text-sm text-gray-500">Cliquez sur "Modifier" pour changer votre mot de passe</p>
                    ) : (
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel *</label>
                          <input
                            type="password"
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe *</label>
                            <input
                              type="password"
                              name="new_password"
                              value={passwordData.new_password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                              required
                              minLength={6}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
                            <input
                              type="password"
                              name="confirm_password"
                              value={passwordData.confirm_password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                              required
                              minLength={6}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex space-x-3">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            {loading ? '⏳ Mise à jour...' : '✓ Mettre à jour'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPassword(false);
                              setPasswordData({
                                current_password: '',
                                new_password: '',
                                confirm_password: ''
                              });
                              setError('');
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
