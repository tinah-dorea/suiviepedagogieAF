import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  EllipsisHorizontalIcon,
  Bars3Icon,
  IdentificationIcon,
  XMarkIcon,
  UserCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import logoAFM from '../../assets/images/logo AFM.png';
import { createEmploye, deleteEmploye, getEmployes, toggleStatus, updateEmploye } from '../../services/employeService';

const ROLES = ['Admin', 'Pédagogie', 'Professeurs', 'Accueil'];
const MENU = ['Dashboard', 'Gestion employer', 'Etablissement'];
const COLORS = {
  bg: '#EFEFD7',
  primary: '#1F3FC3',
  card: '#FFFFFF',
  soft: '#E5EAFD'
};

const EMPTY_EMPLOYE = {
  nom: '',
  prenom: '',
  age: '',
  adresse: '',
  tel: '',
  email: '',
  role: 'Admin',
  mot_passe: ''
};

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('fr-FR');
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="rounded-2xl p-4 shadow-sm border" style={{ backgroundColor: COLORS.card, borderColor: '#dbe2ff' }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600">{title}</p>
        <p className="text-3xl font-bold mt-1" style={{ color: COLORS.primary }}>{value}</p>
      </div>
      <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.soft }}>
        <Icon className="h-6 w-6" style={{ color: COLORS.primary }} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.service === 'rh' || (user.role || '').toLowerCase().includes('admin');

  const [activeView, setActiveView] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    totalInscriptions: 0,
    sessionsAVenir: 0,
    tauxReussite: 0,
    coursDuJour: 0
  });
  const [employes, setEmployes] = useState([]);
  const [search, setSearch] = useState('');
  const [openActionId, setOpenActionId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [aPropos, setAPropos] = useState(null);
  const [editEtablissement, setEditEtablissement] = useState(false);
  const [etabForm, setEtabForm] = useState({});

  const [showEmployeModal, setShowEmployeModal] = useState(false);
  const [employeMode, setEmployeMode] = useState('add');
  const [currentEmploye, setCurrentEmploye] = useState(null);
  const [employeForm, setEmployeForm] = useState(EMPTY_EMPLOYE);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    tel: user.tel || '',
    email: user.email || '',
    adresse: user.adresse || '',
    age: user.age || '',
    role: user.role || '',
    mot_passe: ''
  });

  useEffect(() => {
    if (!isAdmin) navigate('/login', { replace: true });
  }, [isAdmin, navigate]);

  const loadStatsWithFallback = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/statistiques/admin', { headers: getAuthHeaders() });
      return res.data || {};
    } catch {
      // Fallback pour éviter l'erreur bloquante si route admin indisponible
      const res = await axios.get('http://localhost:5000/api/statistiques/pedagogiques', { headers: getAuthHeaders() });
      return {
        totalInscriptions: res.data?.totalEtudiants || 0,
        sessionsAVenir: 0,
        tauxReussite: 0,
        coursDuJour: Array.isArray(res.data?.coursDuJour) ? res.data.coursDuJour.length : 0
      };
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [employesData, statsData, aproposRes] = await Promise.all([
        getEmployes(),
        loadStatsWithFallback(),
        axios.get('http://localhost:5000/api/a-propos').catch(() => ({ data: null }))
      ]);

      setEmployes(employesData || []);
      setStats(statsData || {});
      setAPropos(aproposRes.data || null);
      setEtabForm(aproposRes.data || {});
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredEmployes = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return employes;
    return employes.filter((e) =>
      [e.nom, e.prenom, e.email, e.tel, e.role, e.adresse]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [employes, search]);

  const openEmployeForm = (mode, employe = null) => {
    setEmployeMode(mode);
    setCurrentEmploye(employe);
    if (mode === 'edit' && employe) {
      setEmployeForm({
        nom: employe.nom || '',
        prenom: employe.prenom || '',
        age: employe.age || '',
        adresse: employe.adresse || '',
        tel: employe.tel || '',
        email: employe.email || '',
        role: employe.role || 'Admin',
        mot_passe: ''
      });
    } else {
      setEmployeForm(EMPTY_EMPLOYE);
    }
    setShowEmployeModal(true);
    setOpenActionId(null);
  };

  const submitEmploye = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...employeForm };
      if (employeMode === 'edit' && !payload.mot_passe) delete payload.mot_passe;
      if (employeMode === 'add') await createEmploye(payload);
      else await updateEmploye(currentEmploye.id, payload);
      setShowEmployeModal(false);
      await loadAll();
    } catch (err) {
      setError(err?.message || 'Erreur lors de l’enregistrement');
    }
  };

  const onAction = async (action, employe) => {
    try {
      if (action === 'modifier') {
        openEmployeForm('edit', employe);
        return;
      }
      if (action === 'desactiver') {
        await toggleStatus(employe.id, !employe.is_active);
      }
      if (action === 'supprimer') {
        if (!window.confirm(`Supprimer ${employe.nom} ${employe.prenom} ?`)) return;
        await deleteEmploye(employe.id);
      }
      setOpenActionId(null);
      await loadAll();
    } catch (err) {
      setError(err?.message || 'Action impossible');
    }
  };

  const saveEtablissement = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/a-propos', etabForm, { headers: getAuthHeaders() });
      setEditEtablissement(false);
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur mise à jour établissement');
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...profileForm };
      if (!payload.mot_passe) delete payload.mot_passe;
      const updated = await updateEmploye(user.id, payload);
      const merged = { ...user, ...updated };
      localStorage.setItem('user', JSON.stringify(merged));
      setShowProfileModal(false);
      await loadAll();
    } catch (err) {
      setError(err?.message || 'Erreur de mise à jour du profil');
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen lg:flex" style={{ backgroundColor: COLORS.bg }}>
      <aside className="hidden lg:block lg:w-72 border-r p-6" style={{ backgroundColor: COLORS.card, borderColor: '#d9e0ff' }}>
        <div className="flex items-center gap-3 mb-6">
          <img src={logoAFM} alt="Logo AFM" className="h-12 w-12 rounded-lg object-cover" />
          <div>
            <p className="font-bold text-lg" style={{ color: COLORS.primary }}>Alliance Française</p>
            <p className="text-sm text-slate-600">Mahajanga</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {MENU.map((item) => (
            <button
              key={item}
              onClick={() => setActiveView(item)}
              className="text-left px-4 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: activeView === item ? COLORS.primary : 'transparent',
                color: activeView === item ? '#fff' : '#334155'
              }}
            >
              {item}
            </button>
          ))}
        </div>

      </aside>

      <main className="flex-1 p-4 lg:p-8 pt-28">
        <header
          className="fixed top-0 right-0 left-0 z-30 border-b px-4 lg:px-8 py-4"
          style={{ backgroundColor: COLORS.card, borderColor: '#d9e0ff' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: COLORS.primary }}>
                Dashboard Admin
              </h1>
              <p className="text-slate-600">Bienvenue {user.nom} {user.prenom}</p>
            </div>
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen((v) => !v);
                  setUserMenuOpen(false);
                }}
                className="h-10 w-10 rounded-lg border flex items-center justify-center"
                style={{ borderColor: '#c9d6ff', color: COLORS.primary }}
              >
                {mobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen((v) => !v);
                  setMobileMenuOpen(false);
                }}
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: COLORS.primary }}
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="mb-4 bg-white border rounded-xl p-2" style={{ borderColor: '#d9e0ff' }}>
            {MENU.map((item) => (
              <button
                key={item}
                onClick={() => { setActiveView(item); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: activeView === item ? COLORS.primary : 'transparent',
                  color: activeView === item ? '#fff' : '#334155'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {userMenuOpen && (
          <div className="mb-4 bg-white border rounded-xl p-2" style={{ borderColor: '#d9e0ff' }}>
            <button onClick={() => { setShowProfileModal(true); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Profil</button>
            <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">Déconnexion</button>
          </div>
        )}

        {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">{error}</div>}

        {loading ? (
          <div className="p-6 bg-white rounded-xl shadow-sm">Chargement...</div>
        ) : (
          <>
            {activeView === 'Dashboard' && (
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="Nombre d’inscriptions" value={stats.totalInscriptions || 0} icon={IdentificationIcon} />
                <StatCard title="Sessions à venir" value={stats.sessionsAVenir || 0} icon={CalendarDaysIcon} />
                <StatCard title="Taux de réussite" value={`${stats.tauxReussite || 0}%`} icon={CheckBadgeIcon} />
                <StatCard title="Cours du jour" value={stats.coursDuJour || 0} icon={UserGroupIcon} />
              </section>
            )}

            {activeView === 'Gestion employer' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>Gestion employer</h2>
                  <div className="flex items-center gap-2">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-56 p-2 rounded-lg border"
                      style={{ borderColor: '#c9d6ff' }}
                    />
                    <button
                      onClick={() => openEmployeForm('add')}
                      className="px-4 py-2 rounded-xl text-white font-medium"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      + Nouvel Employé
                    </button>
                  </div>
                </div>

                <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-auto">
                  <table className="w-full min-w-[980px]">
                    <thead style={{ backgroundColor: COLORS.soft }}>
                      <tr>
                        {['N°', 'Nom', 'Prénom', 'Âge', 'Téléphone', 'Email', 'Adresse', 'Rôle', 'Statut', 'Créé le', 'Désactivé le', 'Désactivé par', 'Actions'].map((h) => (
                          <th key={h} className="text-left py-3 px-3 text-sm font-semibold text-slate-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployes.map((emp, index) => (
                        <tr key={emp.id} className="border-t">
                          <td className="px-3 py-3">{index + 1}</td>
                          <td className="px-3 py-3">{emp.nom}</td>
                          <td className="px-3 py-3">{emp.prenom}</td>
                          <td className="px-3 py-3">{emp.age ?? '-'}</td>
                          <td className="px-3 py-3">{emp.tel || '-'}</td>
                          <td className="px-3 py-3">{emp.email}</td>
                          <td className="px-3 py-3">{emp.adresse || '-'}</td>
                          <td className="px-3 py-3">{emp.role || '-'}</td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${emp.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                              {emp.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-3 py-3">{formatDate(emp.date_creation)}</td>
                          <td className="px-3 py-3">{formatDate(emp.deactivated_at)}</td>
                          <td className="px-3 py-3">{emp.deactivated_by ?? '-'}</td>
                          <td className="px-3 py-3 relative">
                            <button onClick={() => setOpenActionId(openActionId === emp.id ? null : emp.id)} className="p-1 rounded hover:bg-slate-100">
                              <EllipsisHorizontalIcon className="h-5 w-5 text-slate-600" />
                            </button>
                            {openActionId === emp.id && (
                              <div className="absolute right-3 mt-1 z-20 bg-white border rounded-lg shadow-lg min-w-[130px]">
                                <button onClick={() => onAction('modifier', emp)} className="w-full px-3 py-2 text-left hover:bg-slate-50 text-sm">Modifier</button>
                                <button onClick={() => onAction('desactiver', emp)} className="w-full px-3 py-2 text-left hover:bg-slate-50 text-sm">
                                  {emp.is_active ? 'Désactiver' : 'Activer'}
                                </button>
                                <button onClick={() => onAction('supprimer', emp)} className="w-full px-3 py-2 text-left hover:bg-red-50 text-sm text-red-600">Supprimer</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {filteredEmployes.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-xl p-4 shadow-sm border relative">
                      <div className="absolute right-3 top-3">
                        <button onClick={() => setOpenActionId(openActionId === emp.id ? null : emp.id)} className="p-1 rounded hover:bg-slate-100">
                          <EllipsisHorizontalIcon className="h-5 w-5 text-slate-600" />
                        </button>
                        {openActionId === emp.id && (
                          <div className="absolute right-0 mt-1 z-20 bg-white border rounded-lg shadow-lg min-w-[130px]">
                            <button onClick={() => onAction('modifier', emp)} className="w-full px-3 py-2 text-left hover:bg-slate-50 text-sm">Modifier</button>
                            <button onClick={() => onAction('desactiver', emp)} className="w-full px-3 py-2 text-left hover:bg-slate-50 text-sm">
                              {emp.is_active ? 'Désactiver' : 'Activer'}
                            </button>
                            <button onClick={() => onAction('supprimer', emp)} className="w-full px-3 py-2 text-left hover:bg-red-50 text-sm text-red-600">Supprimer</button>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold">{emp.nom} {emp.prenom}</p>
                      <p className="text-sm text-slate-600">{emp.email}</p>
                      <p className="text-sm">Tél: {emp.tel || '-'}</p>
                      <p className="text-sm">Adresse: {emp.adresse || '-'}</p>
                      <p className="text-sm">Rôle: {emp.role || '-'}</p>
                      <p className="text-sm">Âge: {emp.age ?? '-'}</p>
                      <p className="text-sm">Créé le: {formatDate(emp.date_creation)}</p>
                      <p className="text-sm">Désactivé le: {formatDate(emp.deactivated_at)}</p>
                      <p className="text-sm">Désactivé par: {emp.deactivated_by ?? '-'}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeView === 'Etablissement' && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
                    <BuildingOffice2Icon className="h-6 w-6" /> Informations établissement
                  </h2>
                  <button
                    onClick={() => setEditEtablissement((v) => !v)}
                    className="px-3 py-2 rounded-lg text-white"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {editEtablissement ? 'Annuler' : 'Modifier'}
                  </button>
                </div>

                {!editEtablissement ? (
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <p><strong>Nom:</strong> {aPropos?.nom_etablissement || '-'}</p>
                    <p><strong>Téléphone:</strong> {aPropos?.tel || '-'}</p>
                    <p><strong>Email:</strong> {aPropos?.email || '-'}</p>
                    <p><strong>Adresse:</strong> {aPropos?.adresse || '-'}</p>
                    <p><strong>Jours ouverture:</strong> {aPropos?.jours_ouverture || '-'}</p>
                    <p><strong>Heures:</strong> {aPropos?.heure_ouverture?.substring?.(0, 5)} - {aPropos?.heure_fermeture?.substring?.(0, 5)}</p>
                    <p className="sm:col-span-2"><strong>Description:</strong> {aPropos?.description || '-'}</p>
                  </div>
                ) : (
                  <form onSubmit={saveEtablissement} className="grid sm:grid-cols-2 gap-3">
                    <input className="border rounded-lg p-2" placeholder="Nom établissement" value={etabForm.nom_etablissement || ''} onChange={(e) => setEtabForm({ ...etabForm, nom_etablissement: e.target.value })} />
                    <input className="border rounded-lg p-2" placeholder="Téléphone" value={etabForm.tel || ''} onChange={(e) => setEtabForm({ ...etabForm, tel: e.target.value })} />
                    <input className="border rounded-lg p-2" placeholder="Email" value={etabForm.email || ''} onChange={(e) => setEtabForm({ ...etabForm, email: e.target.value })} />
                    <input className="border rounded-lg p-2" placeholder="Adresse" value={etabForm.adresse || ''} onChange={(e) => setEtabForm({ ...etabForm, adresse: e.target.value })} />
                    <input className="border rounded-lg p-2" placeholder="Jours ouverture" value={etabForm.jours_ouverture || ''} onChange={(e) => setEtabForm({ ...etabForm, jours_ouverture: e.target.value })} />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" className="border rounded-lg p-2" value={etabForm.heure_ouverture?.substring?.(0, 5) || ''} onChange={(e) => setEtabForm({ ...etabForm, heure_ouverture: e.target.value })} />
                      <input type="time" className="border rounded-lg p-2" value={etabForm.heure_fermeture?.substring?.(0, 5) || ''} onChange={(e) => setEtabForm({ ...etabForm, heure_fermeture: e.target.value })} />
                    </div>
                    <textarea className="border rounded-lg p-2 sm:col-span-2" rows={4} placeholder="Description" value={etabForm.description || ''} onChange={(e) => setEtabForm({ ...etabForm, description: e.target.value })} />
                    <div className="sm:col-span-2 flex justify-end">
                      <button type="submit" className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: COLORS.primary }}>Enregistrer</button>
                    </div>
                  </form>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {showEmployeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg" style={{ color: COLORS.primary }}>
                {employeMode === 'add' ? 'Ajouter un employé' : 'Modifier un employé'}
              </h3>
              <button onClick={() => setShowEmployeModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={submitEmploye} className="p-4 grid sm:grid-cols-2 gap-3">
              <input className="border rounded-lg p-2" placeholder="Nom *" value={employeForm.nom} onChange={(e) => setEmployeForm({ ...employeForm, nom: e.target.value })} required />
              <input className="border rounded-lg p-2" placeholder="Prénom *" value={employeForm.prenom} onChange={(e) => setEmployeForm({ ...employeForm, prenom: e.target.value })} required />
              <input className="border rounded-lg p-2" type="number" placeholder="Âge" value={employeForm.age} onChange={(e) => setEmployeForm({ ...employeForm, age: e.target.value })} />
              <input className="border rounded-lg p-2" placeholder="Téléphone" value={employeForm.tel} onChange={(e) => setEmployeForm({ ...employeForm, tel: e.target.value })} />
              <input className="border rounded-lg p-2 sm:col-span-2" placeholder="Adresse" value={employeForm.adresse} onChange={(e) => setEmployeForm({ ...employeForm, adresse: e.target.value })} />
              <input className="border rounded-lg p-2 sm:col-span-2" type="email" placeholder="Email *" value={employeForm.email} onChange={(e) => setEmployeForm({ ...employeForm, email: e.target.value })} required />
              <select className="border rounded-lg p-2" value={employeForm.role} onChange={(e) => setEmployeForm({ ...employeForm, role: e.target.value })} required>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <input
                className="border rounded-lg p-2"
                type="password"
                placeholder={employeMode === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe (optionnel)'}
                value={employeForm.mot_passe}
                onChange={(e) => setEmployeForm({ ...employeForm, mot_passe: e.target.value })}
                required={employeMode === 'add'}
              />
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEmployeModal(false)} className="px-4 py-2 rounded-lg border">Annuler</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: COLORS.primary }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: COLORS.primary }}>
                <UserCircleIcon className="h-6 w-6" /> Profil
              </h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={saveProfile} className="p-4 grid sm:grid-cols-2 gap-3">
              <input className="border rounded-lg p-2" placeholder="Nom" value={profileForm.nom} onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })} />
              <input className="border rounded-lg p-2" placeholder="Prénom" value={profileForm.prenom} onChange={(e) => setProfileForm({ ...profileForm, prenom: e.target.value })} />
              <input className="border rounded-lg p-2" placeholder="Téléphone" value={profileForm.tel} onChange={(e) => setProfileForm({ ...profileForm, tel: e.target.value })} />
              <input className="border rounded-lg p-2" type="number" placeholder="Âge" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} />
              <input className="border rounded-lg p-2 sm:col-span-2" type="email" placeholder="Email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
              <input className="border rounded-lg p-2 sm:col-span-2" placeholder="Adresse" value={profileForm.adresse} onChange={(e) => setProfileForm({ ...profileForm, adresse: e.target.value })} />
              <input className="border rounded-lg p-2 bg-slate-100" value={profileForm.role} readOnly />
              <input className="border rounded-lg p-2" type="password" placeholder="Nouveau mot de passe (optionnel)" value={profileForm.mot_passe} onChange={(e) => setProfileForm({ ...profileForm, mot_passe: e.target.value })} />
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 rounded-lg border">Annuler</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: COLORS.primary }}>Mettre à jour</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}