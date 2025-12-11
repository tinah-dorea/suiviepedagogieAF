import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployes, getRoles, toggleStatus, deleteEmploye, createEmploye, updateEmploye } from '../../services/employeService';
import roleService from '../../services/roleService';

// Composant de Carte de Statistiques avec nouvelle palette
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center" style={{ borderLeft: `5px solid ${color}` }}>
    <div>
      <p className="text-sm font-medium" style={{ color: '#6B7280' }}>{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: color }}>{value}</p>
    </div>
    <Icon className="h-8 w-8" style={{ color: '#D1D5DB' }} />
  </div>
);

// Icônes (inchangées)
const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const RevenueIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ExpenseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0l-4-4m4 4l-4 4M4 17h8m0 0l-4-4m4 4l-4 4" /></svg>;
const TaskIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2 4h.01M16 12h.01M16 16h.01M10 12h.01M10 16h.01M10 8h.01M9 16h.01M9 12h.01M9 8h.01" /></svg>;

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentEmploye, setCurrentEmploye] = useState(null);
  const [formData, setFormData] = useState({
    service: '',
    nom: '',
    prenom: '',
    age: '',
    adresse: '',
    tel: '',
    email: '',
    mot_passe: '',
    id_role: 1,
  });
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState('add');
  const [currentRole, setCurrentRole] = useState(null);
  const [roleFormData, setRoleFormData] = useState({
    nom_role: ''
  });

  // Récupérer les infos utilisateur
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 1;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // Nouvelle palette de couleurs Alliance Française
  const mainColor = '#DC2626'; // Rouge principal
  const accentColor = '#B91C1C'; // Rouge foncé

  // ... existing code ... (tous les useEffect et fonctions restent identiques)
  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (err) {
        console.error("Erreur chargement rôles:", err);
        setError("Erreur lors du chargement des rôles");
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const loadEmployes = async () => {
      setLoading(true);
      try {
        const data = await getEmployes();
        setEmployes(data);
      } catch (err) {
        console.error("Erreur chargement employés:", err);
        setError("Erreur lors du chargement des employés");
      } finally {
        setLoading(false);
      }
    };

    if (activeView === 'utilisateurs') {
      loadEmployes();
    }
  }, [activeView]);



  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const openModal = (mode, employe = null) => {
    setModalMode(mode);
    if (mode === 'edit' && employe) {
      setCurrentEmploye(employe);
      setFormData({
        service: employe.service || '',
        nom: employe.nom,
        prenom: employe.prenom,
        age: employe.age || '',
        adresse: employe.adresse || '',
        tel: employe.tel || '',
        email: employe.email,
        mot_passe: '',
        id_role: employe.id_role || 1,
      });
    } else {
      setCurrentEmploye(null);
      setFormData({
        service: '',
        nom: '',
        prenom: '',
        age: '',
        adresse: '',
        tel: '',
        email: '',
        mot_passe: '',
        id_role: 1,
      });
    }
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = { ...formData };
      if (modalMode === 'edit' && !submitData.mot_passe) {
        delete submitData.mot_passe;
      }

      if (modalMode === 'add') {
        await createEmploye(submitData);
      } else {
        await updateEmploye(currentEmploye.id, submitData);
      }
      
      const data = await getEmployes();
      setEmployes(data);
      closeModal();
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue lors de l'opération. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, is_active) => {
    try {
      setLoading(true);
      await toggleStatus(id, !is_active);
      const data = await getEmployes();
      setEmployes(data);
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err);
      setError("Erreur lors de la modification du statut. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const employe = employes.find(e => e.id === id);
    if (!employe) return;

    if (employe.is_active) {
      if (window.confirm("Êtes-vous sûr de vouloir désactiver cet employé ?")) {
        try {
          setLoading(true);
          await deleteEmploye(id);
          const data = await getEmployes();
          setEmployes(data);
        } catch (err) {
          console.error('Erreur lors de la désactivation:', err);
          const errorMessage = err.response?.data?.message || "Erreur lors de la désactivation. Veuillez réessayer.";
          alert(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    } else {
      alert("Cet employé est déjà désactivé.");
    }
  };

  const openRoleModal = (mode, role = null) => {
    setRoleModalMode(mode);
    if (mode === 'edit' && role) {
      setCurrentRole(role);
      setRoleFormData({
        nom_role: role.nom_role
      });
    } else {
      setCurrentRole(null);
      setRoleFormData({
        nom_role: ''
      });
    }
    setError('');
    setRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setRoleModalOpen(false);
    setError('');
  };

  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (roleModalMode === 'add') {
        await roleService.createRole(roleFormData);
      } else {
        await roleService.updateRole(currentRole.id, roleFormData);
      }

      // Reload roles
      const rolesData = await getRoles();
      setRoles(rolesData);
      closeRoleModal();
    } catch (err) {
      console.error('Erreur lors de la soumission du rôle:', err);
      setError(
        err.message ||
        "Une erreur est survenue lors de l'opération. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      try {
        setLoading(true);
        await roleService.deleteRole(id);
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        const errorMessage = err.message || "Erreur lors de la suppression. Veuillez réessayer.";
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Sidebar avec logo Alliance Française */}
      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between p-6">
        <div>
          {/* Logo et titre Alliance Française */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <img 
                src={process.env.PUBLIC_URL + '/assets/images/alliance-francaise-seeklogo.png'} 
                alt="Alliance Française Logo" 
                className="w-12 h-12 mr-3"
              />
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#1F2937' }}>
                  Alliance Française
                </h1>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Mahajanga
                </p>
              </div>
            </div>
          </div>

          <nav>
            <ul>
              {['Dashboard', 'Utilisateurs', 'Rôles & Activités', 'Statistiques'].map((item, index) => (
                <li key={index} className="mb-2">
                  <button
                    onClick={() => {
                      if (item === 'Dashboard') setActiveView('dashboard');
                      else if (item === 'Utilisateurs') setActiveView('utilisateurs');
                      else if (item === 'Rôles & Activités') setActiveView('roles');
                      else setActiveView('dashboard');
                    }}
                    className={`w-full text-left flex items-center p-3 rounded-xl transition-all duration-200 ${
                      (item === 'Dashboard' && activeView === 'dashboard') ||
                      (item === 'Utilisateurs' && activeView === 'utilisateurs') ||
                      (item === 'Rôles & Activités' && activeView === 'roles')
                        ? 'font-bold text-white'
                        : 'hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: (item === 'Dashboard' && activeView === 'dashboard') ||
                                     (item === 'Utilisateurs' && activeView === 'utilisateurs') ||
                                     (item === 'Rôles & Activités' && activeView === 'roles')
                        ? mainColor : 'transparent',
                      color: (item === 'Dashboard' && activeView === 'dashboard') ||
                             (item === 'Utilisateurs' && activeView === 'utilisateurs') ||
                             (item === 'Rôles & Activités' && activeView === 'roles')
                        ? 'white' : '#6B7280'
                    }}
                  >
                    <span className="mr-3">•</span> {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-xl transition-all duration-200 text-sm"
          style={{ color: mainColor }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FEF2F2';
            e.target.style.color = accentColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = mainColor;
          }}
        >
          <span className="mr-3">→</span> Déconnexion
        </button>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light" style={{ color: '#1F2937' }}>
            Service <span className="font-semibold" style={{ color: mainColor }}>{user.service || 'Administration'}</span>
          </h2>
          <div 
            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold"
            style={{ backgroundColor: mainColor }}
          >
            {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
          </div>
        </header>

        {/* Vue Dashboard */}
        {activeView === 'dashboard' && (
          <>
            <section className="grid grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Revenus" value="Rp 120.000.000" icon={RevenueIcon} color="#10B981" />
              <StatCard title="Dépenses Totales" value="Rp 20.000.000" icon={ExpenseIcon} color={mainColor} />
              <StatCard title="Total Élèves" value="150" icon={UserIcon} color="#3B82F6" />
              <StatCard title="Total Tâches" value="24" icon={TaskIcon} color="#8B5CF6" />
            </section>

            <section className="grid grid-cols-12 gap-6 mb-8">
              <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
                  Distribution <span className="text-3xl font-bold ml-2" style={{ color: mainColor }}>35%</span>
                </h3>
                <div className="flex justify-center items-center mb-6"></div>
                <ul className="text-sm">
                  <li className="flex items-center mb-1">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#10B981' }}></span> 
                    <span style={{ color: '#6B7280' }}>Progress Tracking</span>
                  </li>
                  <li className="flex items-center mb-1">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#F59E0B' }}></span> 
                    <span style={{ color: '#6B7280' }}>User Activity</span>
                  </li>
                  <li className="flex items-center mb-1">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: mainColor }}></span> 
                    <span style={{ color: '#6B7280' }}>Sales Performance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#8B5CF6' }}></span> 
                    <span style={{ color: '#6B7280' }}>Task Completion</span>
                  </li>
                </ul>
              </div>
              <div className="col-span-8 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>Statistiques Rapides</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-3xl font-bold" style={{ color: mainColor }}>10</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>Total Employés</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-3xl font-bold" style={{ color: mainColor }}>5</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>Sessions Actives</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-3xl font-bold" style={{ color: mainColor }}>92%</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>Taux de Présence</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex justify-between items-center" style={{ color: '#1F2937' }}>
                  Today Insight
                  <button className="text-sm" style={{ color: mainColor }}>See more</button>
                </h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex justify-between items-center" style={{ color: '#1F2937' }}>
                  Weekly Report
                  <button className="text-sm" style={{ color: mainColor }}>See more</button>
                </h3>
              </div>
            </section>
          </>
        )}

        {/* Vue Utilisateurs */}
        {activeView === 'utilisateurs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>Gestion des Utilisateurs</h1>
              <button
                onClick={() => openModal('add')}
                className="text-white px-4 py-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: mainColor }}
                onMouseEnter={(e) => e.target.style.backgroundColor = accentColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = mainColor}
              >
                + Ajouter Employé
              </button>
            </div>

            {loading ? (
              <p className="text-center py-4" style={{ color: '#6B7280' }}>Chargement...</p>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#F9FAFB' }}>
                    <tr>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Utilisateur</th>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Service</th>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Email</th>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Rôle</th>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Statut</th>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employes.map(emp => (
                      <tr key={emp.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium" style={{ color: '#1F2937' }}>{emp.nom} {emp.prenom}</td>
                        <td className="py-3 px-4" style={{ color: '#6B7280' }}>{emp.service || '-'}</td>
                        <td className="py-3 px-4" style={{ color: '#6B7280' }}>{emp.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-xs" style={{
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF'
                          }}>
                            {emp.id_role === 1 ? 'Admin' : 'Employé'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            emp.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {emp.is_active ? 'Actif' : 'Désactivé'}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => openModal('edit', emp)}
                            className="text-sm hover:underline"
                            style={{ color: '#3B82F6' }}
                          >
                            Éditer
                          </button>
                          <button
                            onClick={() => handleToggleStatus(emp.id, emp.is_active)}
                            className={`text-sm hover:underline ${
                              emp.is_active ? 'text-yellow-600' : 'text-green-600'
                            }`}
                          >
                            {emp.is_active ? 'Désactiver' : 'Activer'}
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="text-sm hover:underline"
                            style={{ color: mainColor }}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Vue Rôles */}
        {activeView === 'roles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>Gestion des Rôles</h1>
              <button
                onClick={() => openRoleModal('add')}
                className="text-white px-4 py-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: mainColor }}
                onMouseEnter={(e) => e.target.style.backgroundColor = accentColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = mainColor}
              >
                + Ajouter Rôle
              </button>
            </div>

            {loading ? (
              <p className="text-center py-4" style={{ color: '#6B7280' }}>Chargement...</p>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#F9FAFB' }}>
                    <tr>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Nom du Rôle</th>
                      <th className="text-left py-3 px-4" style={{ color: '#1F2937' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-center py-4" style={{ color: '#6B7280' }}>Aucun rôle trouvé. Cliquez sur "Ajouter Rôle" pour en créer un.</td>
                      </tr>
                    ) : (
                      roles.map(role => (
                        <tr key={role.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium" style={{ color: '#1F2937' }}>{role.nom_role}</td>
                          <td className="py-3 px-4 space-x-2">
                            <button
                              onClick={() => openRoleModal('edit', role)}
                              className="text-sm hover:underline"
                              style={{ color: '#3B82F6' }}
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-sm hover:underline"
                              style={{ color: mainColor }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modale avec nouvelle palette */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold" style={{ color: '#1F2937' }}>
                {modalMode === 'add' ? 'Ajouter un Employé' : 'Modifier un Employé'}
              </h2>
              <button
                onClick={closeModal}
                className="hover:bg-gray-100 rounded p-1"
                style={{ color: '#6B7280' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              {error && (
                <div className="p-2 text-sm rounded text-center" style={{
                  backgroundColor: '#FEF2F2',
                  color: mainColor
                }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="nom"
                  placeholder="Nom *"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded focus:outline-none focus:ring-2"
                  style={{ focusRingColor: mainColor }}
                />
                <input
                  name="prenom"
                  placeholder="Prénom *"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded focus:outline-none focus:ring-2"
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2"
              />

              <input
                name="service"
                placeholder="Service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2"
              />

              <input
                name="tel"
                placeholder="Téléphone"
                value={formData.tel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2"
              />

              {modalMode === 'add' && (
                <input
                  name="mot_passe"
                  type="password"
                  placeholder="Mot de passe *"
                  value={formData.mot_passe}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                />
              )}

              <select
                name="id_role"
                value={formData.id_role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                required
              >
                <option value="">Sélectionnez un rôle *</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.nom_role}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 rounded text-sm transition-colors"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-white rounded text-sm transition-colors"
                  style={{ backgroundColor: mainColor }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = accentColor}
                  onMouseLeave={(e) => e.target.style.backgroundColor = mainColor}
                >
                  {modalMode === 'add' ? 'Ajouter' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Rôles */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold" style={{ color: '#1F2937' }}>
                {roleModalMode === 'add' ? 'Ajouter un Rôle' : 'Modifier un Rôle'}
              </h2>
              <button
                onClick={closeRoleModal}
                className="hover:bg-gray-100 rounded p-1"
                style={{ color: '#6B7280' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRoleSubmit} className="p-4 space-y-3">
              {error && (
                <div className="p-2 text-sm rounded text-center" style={{
                  backgroundColor: '#FEF2F2',
                  color: mainColor
                }}>
                  {error}
                </div>
              )}

              <input
                name="nom_role"
                placeholder="Nom du rôle *"
                value={roleFormData.nom_role}
                onChange={handleRoleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                style={{ focusRingColor: mainColor }}
              />

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={closeRoleModal}
                  className="px-3 py-1.5 rounded text-sm transition-colors"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-white rounded text-sm transition-colors"
                  style={{ backgroundColor: mainColor }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = accentColor}
                  onMouseLeave={(e) => e.target.style.backgroundColor = mainColor}
                >
                  {roleModalMode === 'add' ? 'Ajouter' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}