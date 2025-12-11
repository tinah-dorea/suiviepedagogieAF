import { useState } from 'react';
import { createEmploye, updateEmploye } from '../../services/employeService';

export default function EmployeFormModal({ isOpen, onClose, mode, employeData, onActionSuccess }) {
  const [formData, setFormData] = useState(
    mode === 'edit'
      ? { ...employeData }
      : {
          service: '',
          nom: '',
          prenom: '',
          age: '',
          adresse: '',
          tel: '',
          email: '',
          mot_passe: '',
          id_role: 1, // ou liste dynamique
          is_active: true
        }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'add') {
        await createEmploye(formData);
      } else {
        await updateEmploye(employeData.id, formData);
      }
      onActionSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">
            {mode === 'add' ? 'Ajouter un Employé' : 'Modifier un Employé'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="p-2 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <input
              name="nom"
              placeholder="Nom *"
              value={formData.nom}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              name="prenom"
              placeholder="Prénom *"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="service"
            placeholder="Service"
            value={formData.service}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="tel"
            placeholder="Téléphone"
            value={formData.tel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          {mode === 'add' && (
            <input
              name="mot_passe"
              type="password"
              placeholder="Mot de passe *"
              value={formData.mot_passe}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          )}

          {/* Rôle : simplifié à id_role */}
          <select
            name="id_role"
            value={formData.id_role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="1">Administrateur</option>
            <option value="2">Pédagogie</option>
            <option value="3">Comptable</option>
          </select>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'En cours...' : mode === 'add' ? 'Ajouter' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}