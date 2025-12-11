import { useState, useEffect } from 'react';
import { getEmployes, toggleStatus, deleteEmploye } from '../../services/employeService';
import EmployeFormModal from './EmployeFormModal';

export default function EmployeList({ onRefresh }) {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, mode: 'add', data: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployes = async () => {
    try {
      setLoading(true);
      const data = await getEmployes();
      setEmployes(data);
    } catch (err) {
      alert("Erreur lors du chargement des employés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployes();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await toggleStatus(id, !currentStatus);
      fetchEmployes();
    } catch (err) {
      alert("Erreur lors de la modification du statut");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous désactiver cet employé ?")) {
      try {
        await deleteEmploye(id);
        fetchEmployes();
      } catch (err) {
        alert("Erreur lors de la désactivation");
      }
    }
  };

  const openModal = (mode, data = null) => {
    setModal({ isOpen: true, mode, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleSuccess = () => {
    fetchEmployes();
  };

  if (loading) return <p className="text-center py-4">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal('add')}
          className="bg-green-600 text-white px-3 py-1.5 text-sm rounded hover:bg-green-700"
        >
          + Ajouter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Utilisateur</th>
              <th className="p-2 text-left">Service</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Rôle</th>
              <th className="p-2 text-left">Statut</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employes.map(emp => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{emp.nom} {emp.prenom}</td>
                <td className="p-2">{emp.service || '-'}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {emp.id_role === 1 ? 'Admin' : 'Employé'}
                  </span>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    emp.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {emp.is_active ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => openModal('edit', emp)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleToggle(emp.id, emp.is_active)}
                    className={`text-sm ${
                      emp.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                    }`}
                  >
                    {emp.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmployeFormModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        mode={modal.mode}
        employeData={modal.data}
        onActionSuccess={handleSuccess}
      />
    </div>
  );
}