import { useState, useEffect } from 'react';
import { getEmployes, toggleStatus, deleteEmploye } from '../../services/employeService';

export default function EmployeList({ onAdd, onEdit }) {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployes();
  }, []);

  const fetchEmployes = async () => {
    try {
      setLoading(true);
      const data = await getEmployes();
      setEmployes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des employés :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleStatus(id, !currentStatus);
      fetchEmployes();
    } catch (error) {
      alert("Erreur lors de la modification du statut.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir désactiver cet employé ?")) {
      try {
        await deleteEmploye(id);
        fetchEmployes();
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <button
          onClick={onAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Ajouter Employé
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Liste des Employés</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Avatar</th>
                <th className="text-left py-3 px-4">Nom</th>
                <th className="text-left py-3 px-4">Prénom</th>
                <th className="text-left py-3 px-4">Service</th>
                <th className="text-left py-3 px-4">Fonction</th>
                <th className="text-left py-3 px-4">Téléphone</th>
                <th className="text-left py-3 px-4">Rôle</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employes.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                      {emp.nom.charAt(0)}{emp.prenom.charAt(0)}
                    </div>
                  </td>
                  <td className="py-3 px-4">{emp.nom}</td>
                  <td className="py-3 px-4">{emp.prenom}</td>
                  <td className="py-3 px-4">{emp.service}</td>
                  <td className="py-3 px-4">{emp.nom_activite}</td>
                  <td className="py-3 px-4">{emp.tel}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      emp.nom_role.toLowerCase().includes('admin') 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {emp.nom_role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(emp.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(emp.id, emp.is_active)}
                        className={`${
                          emp.is_active 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {emp.is_active ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m-6-3a3 3 0 1112 0v3M9 9l3 3 3-3m6 6l-3-3-3 3" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995 5.01L5 12m0 0L4.364 5.636A2 2 0 015 4h1.068l12.142.867M19 7l-3 3m-3-3l3 3" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}