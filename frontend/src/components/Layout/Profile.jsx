import { useState, useEffect } from 'react';
import { updateEmploye } from '../../services/employeService';

export default function Profile() {
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
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, []);

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
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedData = await updateEmploye(storedUser.id, userData);
      
      // Update the local storage with new data
      const updatedUser = { ...storedUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMessage('Profil mis à jour avec succès!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de la mise à jour du profil");
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
    setError('');
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          <p className="opacity-80">Gérez vos informations personnelles</p>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
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
                    <p className="text-lg">{userData.nom}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Prénom</h3>
                    <p className="text-lg">{userData.prenom}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-lg">{userData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                    <p className="text-lg">{userData.tel || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Service</h3>
                    <p className="text-lg">{userData.service || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                    <p className="text-lg">{userData.role || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Âge</h3>
                    <p className="text-lg">{userData.age || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                    <p className="text-lg">{userData.adresse || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Modifier le profil
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="tel"
                      value={userData.tel}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                    <input
                      type="text"
                      value={userData.role || ''}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      name="adresse"
                      value={userData.adresse}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}