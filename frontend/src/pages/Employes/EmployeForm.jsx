import { useState, useEffect } from 'react';
import { createEmploye, updateEmploye } from '../../services/employeService';

export default function EmployeForm({ mode = 'add', id, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    service: '',
    nom: '',
    prenom: '',
    age: '',
    adresse: '',
    tel: '',
    email: '',
    mot_passe: '',
    id_role_activite: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      // Charger les données de l'employé (à implémenter si nécessaire)
      // Exemple : fetchEmployeById(id).then(data => setFormData(data));
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'add') {
        await createEmploye(formData);
      } else {
        await updateEmploye(id, formData);
      }
      onSuccess(); // Appelle la fonction parente pour revenir à la liste
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6">{mode === 'add' ? 'Ajouter un Employé' : 'Modifier l\'Employé'}</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nom *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Prénom *</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Service *</label>
          <input
            type="text"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Adresse</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Téléphone</label>
          <input
            type="text"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mot de passe {mode === 'add' ? '*' : '(laisser vide pour ne pas changer)'}</label>
          <input
            type="password"
            name="mot_passe"
            value={formData.mot_passe}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder={mode === 'edit' ? "Laisser vide pour conserver le mot de passe actuel" : ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">ID Rôle Activité *</label>
          <input
            type="number"
            name="id_role_activite"
            value={formData.id_role_activite}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Ex: 1"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}