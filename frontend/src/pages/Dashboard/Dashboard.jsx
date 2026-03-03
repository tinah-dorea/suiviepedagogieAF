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
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import logoAFM from '../../assets/images/logo AFM.png';
import { createEmploye, deleteEmploye, getEmployes, toggleStatus, updateEmploye } from '../../services/employeService';

const ROLES = ['Admin', 'Pédagogie', 'Professeurs', 'Accueil'];
const MENU = ['Dashboard', 'Gestion employer', 'Etablissement'];
// Modern Pastel Palette - matching ConsultationCours & HomePage
const COLORS = {
  bg: '#F8F9FA',
  card: '#FFFFFF',
  primary: '#6B9080',
  secondary: '#A4C3B2',
  accent: '#EAF4F4',
  highlight: '#F6FFF8',
  text: '#2D3436',
  textLight: '#636E72',
  border: '#E8E8E8',
  gradient: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)',
  soft: '#B5EAD7'
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
  <div className="rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-opacity-50" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: COLORS.textLight }}>{title}</p>
        <p className="text-3xl font-bold" style={{ color: COLORS.text }}>{value}</p>
      </div>
      <div className="rounded-2xl p-4" style={{ background: COLORS.gradient }}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const SessionCard = ({ session, type }) => {
  const statusColors = {
    'en-cours': { bg: '#B5EAD7', text: '#2D7A5F' },
    'passe': { bg: '#E2E2E2', text: '#6B6B6B' },
    'avenir': { bg: '#C7CEEA', text: '#5A5F8C' }
  };
  const color = statusColors[type] || statusColors['avenir'];
  
  return (
    <div className="rounded-2xl p-4 border transition-all duration-200 hover:shadow-md" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1" style={{ color: COLORS.text }}>
            {session.nom_session || `${session.mois} ${session.annee}`}
          </h4>
          <p className="text-xs" style={{ color: COLORS.textLight }}>{session.nom_type_cours || '—'}</p>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: color.bg, color: color.text }}>
          {type === 'en-cours' ? 'En cours' : type === 'passe' ? 'Terminée' : 'À venir'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.textLight }}>
        <span>Début: {new Date(session.date_debut).toLocaleDateString('fr-FR')}</span>
      </div>
    </div>
  );
};

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
  const [sessions, setSessions] = useState([]);
  const [sessionsEnCours, setSessionsEnCours] = useState([]);
  const [dernieresSessions, setDernieresSessions] = useState([]);
  const [prochainesSessions, setProchainesSessions] = useState([]);
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
      const [employesData, statsData, aproposRes, sessionsRes] = await Promise.all([
        getEmployes(),
        loadStatsWithFallback(),
        axios.get('http://localhost:5000/api/a-propos').catch(() => ({ data: null })),
        axios.get('http://localhost:5000/api/consultation/sessions').catch(() => ({ data: [] }))
      ]);

      setEmployes(employesData || []);
      setStats(statsData || {});
      setAPropos(aproposRes.data || null);
      setEtabForm(aproposRes.data || {});
      
      // Process sessions
      const allSessions = sessionsRes.data || [];
      setSessions(allSessions);
      
      const today = new Date();
      const sessionsEnCours = allSessions.filter(s => {
        const debut = new Date(s.date_debut);
        const fin = new Date(s.date_fin);
        return debut <= today && fin >= today;
      });
      
      const dernieresSessions = allSessions
        .filter(s => new Date(s.date_fin) < today)
        .sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin))
        .slice(0, 5);
      
      const prochainesSessions = allSessions
        .filter(s => new Date(s.date_debut) > today)
        .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut))
        .slice(0, 5);
      
      setSessionsEnCours(sessionsEnCours);
      setDernieresSessions(dernieresSessions);
      setProchainesSessions(prochainesSessions);
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
      {/* Sidebar */}
      <aside className="hidden lg:block lg:w-72 border-r p-6 shadow-sm fixed top-0 left-0 h-full overflow-y-auto" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderColor: COLORS.border }}>
          <img src={logoAFM} alt="Logo AFM" className="h-14 w-14 rounded-2xl object-cover shadow-md" />
          <div>
            <p className="font-bold text-lg" style={{ color: COLORS.text }}>Alliance Française</p>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Mahajanga</p>
          </div>
        </div>

        <nav className="space-y-2">
          {MENU.map((item) => (
            <button
              key={item}
              onClick={() => setActiveView(item)}
              className="w-full text-left px-4 py-3.5 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: activeView === item ? COLORS.primary : COLORS.bg,
                color: activeView === item ? '#FFFFFF' : COLORS.textLight,
                fontWeight: activeView === item ? '600' : '500'
              }}
              onMouseEnter={(e) => {
                if (activeView !== item) {
                  e.target.style.backgroundColor = COLORS.accent;
                  e.target.style.color = COLORS.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== item) {
                  e.target.style.backgroundColor = COLORS.bg;
                  e.target.style.color = COLORS.textLight;
                }
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-8 lg:ml-72">
        <header
          className="sticky top-0 mb-6 shadow-sm border-b rounded-3xl px-6 py-5 z-20"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: COLORS.text }}>
                Dashboard Admin
              </h1>
              <p className="text-sm" style={{ color: COLORS.textLight }}>Bienvenue {user.nom} {user.prenom}</p>
            </div>
            <div className="relative flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen((v) => !v);
                  setUserMenuOpen(false);
                }}
                className="h-10 w-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
              >
                {mobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen((v) => !v);
                  setMobileMenuOpen(false);
                }}
                className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ background: COLORS.gradient }}
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="mb-4 bg-white border rounded-2xl p-2 shadow-sm" style={{ borderColor: COLORS.border }}>
            {MENU.map((item) => (
              <button
                key={item}
                onClick={() => { setActiveView(item); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeView === item ? COLORS.gradient : 'transparent',
                  color: activeView === item ? '#FFFFFF' : COLORS.textLight,
                  fontWeight: activeView === item ? '600' : '500'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {userMenuOpen && (
          <div className="mb-4 bg-white border rounded-2xl p-2 shadow-sm" style={{ borderColor: COLORS.border }}>
            <button onClick={() => { setShowProfileModal(true); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors" style={{ color: COLORS.text }}>Profil</button>
            <button onClick={logout} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Déconnexion</button>
          </div>
        )}

        {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-100">{error}</div>}

        {loading ? (
          <div className="p-6 bg-white rounded-xl shadow-sm">Chargement...</div>
        ) : (
          <>
            {activeView === 'Dashboard' && (
              <section className="space-y-8">
                {/* Stat Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard title="Nombre d'inscriptions" value={stats.totalInscriptions || 0} icon={IdentificationIcon} />
                  <StatCard title="Sessions à venir" value={stats.sessionsAVenir || 0} icon={CalendarDaysIcon} />
                  <StatCard title="Taux de réussite" value={`${stats.tauxReussite || 0}%`} icon={CheckBadgeIcon} />
                  <StatCard title="Cours du jour" value={stats.coursDuJour || 0} icon={UserGroupIcon} />
                </section>

                {/* Sessions Section */}
                <section className="space-y-6">
                  {/* Sessions en cours */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#B5EAD7' }}>
                        <CalendarIcon className="h-5 w-5" style={{ color: '#2D7A5F' }} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Sessions en cours</h2>
                        <p className="text-xs" style={{ color: COLORS.textLight }}>{sessionsEnCours.length} session{sessionsEnCours.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {sessionsEnCours.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sessionsEnCours.map((session) => (
                          <SessionCard key={session.id} session={session} type="en-cours" />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: COLORS.bg }}>
                        <p className="text-sm" style={{ color: COLORS.textLight }}>Aucune session en cours</p>
                      </div>
                    )}
                  </div>

                  {/* Dernières sessions */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E2E2E2' }}>
                        <CalendarIcon className="h-5 w-5" style={{ color: '#6B6B6B' }} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Dernières sessions terminées</h2>
                        <p className="text-xs" style={{ color: COLORS.textLight }}>{dernieresSessions.length} session{dernieresSessions.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {dernieresSessions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dernieresSessions.map((session) => (
                          <SessionCard key={session.id} session={session} type="passe" />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: COLORS.bg }}>
                        <p className="text-sm" style={{ color: COLORS.textLight }}>Aucune session terminée</p>
                      </div>
                    )}
                  </div>

                  {/* Prochaines sessions */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#C7CEEA' }}>
                        <CalendarIcon className="h-5 w-5" style={{ color: '#5A5F8C' }} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Prochaines sessions</h2>
                        <p className="text-xs" style={{ color: COLORS.textLight }}>{prochainesSessions.length} session{prochainesSessions.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {prochainesSessions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {prochainesSessions.map((session) => (
                          <SessionCard key={session.id} session={session} type="avenir" />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: COLORS.bg }}>
                        <p className="text-sm" style={{ color: COLORS.textLight }}>Aucune session à venir</p>
                      </div>
                    )}
                  </div>
                </section>
              </section>
            )}

            {activeView === 'Gestion employer' && (
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Gestion employer</h2>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full sm:w-56 px-4 py-2.5 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.card, color: COLORS.text }}
                    />
                    <button
                      onClick={() => openEmployeForm('add')}
                      className="px-5 py-2.5 rounded-xl text-white font-semibold whitespace-nowrap shadow-md hover:shadow-lg transition-all"
                      style={{ background: COLORS.gradient }}
                    >
                      + Nouvel Employé
                    </button>
                  </div>
                </div>

                <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-auto border" style={{ borderColor: COLORS.border }}>
                  <table className="w-full min-w-[980px]">
                    <thead style={{ backgroundColor: COLORS.accent }}>
                      <tr>
                        {['N°', 'Nom', 'Prénom', 'Âge', 'Téléphone', 'Email', 'Adresse', 'Rôle', 'Statut', 'Créé le', 'Actions'].map((h) => (
                          <th key={h} className="text-left py-4 px-4 text-sm font-semibold" style={{ color: COLORS.text }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployes.map((emp, index) => (
                        <tr key={emp.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
                          <td className="px-4 py-4 text-sm">{index + 1}</td>
                          <td className="px-4 py-4 text-sm font-medium" style={{ color: COLORS.text }}>{emp.nom}</td>
                          <td className="px-4 py-4 text-sm" style={{ color: COLORS.textLight }}>{emp.prenom}</td>
                          <td className="px-4 py-4 text-sm" style={{ color: COLORS.textLight }}>{emp.age ?? '-'}</td>
                          <td className="px-4 py-4 text-sm" style={{ color: COLORS.textLight }}>{emp.tel || '-'}</td>
                          <td className="px-4 py-4 text-sm" style={{ color: COLORS.textLight }}>{emp.email}</td>
                          <td className="px-4 py-4 text-sm" style={{ color: COLORS.textLight }}>{emp.adresse || '-'}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}>
                              {emp.role || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                              {emp.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm" style={{ color: COLORS.textLight }}>{formatDate(emp.date_creation)}</td>
                          <td className="px-4 py-4 relative">
                            <button onClick={() => setOpenActionId(openActionId === emp.id ? null : emp.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <EllipsisHorizontalIcon className="h-5 w-5" style={{ color: COLORS.textLight }} />
                            </button>
                            {openActionId === emp.id && (
                              <div className="absolute right-4 mt-2 z-20 bg-white border rounded-xl shadow-lg min-w-[140px]" style={{ borderColor: COLORS.border }}>
                                <button onClick={() => onAction('modifier', emp)} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm font-medium transition-colors" style={{ color: COLORS.text }}>Modifier</button>
                                <button onClick={() => onAction('desactiver', emp)} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm font-medium transition-colors" style={{ color: COLORS.text }}>
                                  {emp.is_active ? 'Désactiver' : 'Activer'}
                                </button>
                                <button onClick={() => onAction('supprimer', emp)} className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-sm font-medium transition-colors text-red-600">Supprimer</button>
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
                    <div key={emp.id} className="bg-white rounded-2xl p-4 shadow-sm border relative" style={{ borderColor: COLORS.border }}>
                      <div className="absolute right-3 top-3">
                        <button onClick={() => setOpenActionId(openActionId === emp.id ? null : emp.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <EllipsisHorizontalIcon className="h-5 w-5" style={{ color: COLORS.textLight }} />
                        </button>
                        {openActionId === emp.id && (
                          <div className="absolute right-0 mt-2 z-20 bg-white border rounded-xl shadow-lg min-w-[140px]" style={{ borderColor: COLORS.border }}>
                            <button onClick={() => onAction('modifier', emp)} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm font-medium transition-colors" style={{ color: COLORS.text }}>Modifier</button>
                            <button onClick={() => onAction('desactiver', emp)} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm font-medium transition-colors" style={{ color: COLORS.text }}>
                              {emp.is_active ? 'Désactiver' : 'Activer'}
                            </button>
                            <button onClick={() => onAction('supprimer', emp)} className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-sm font-medium transition-colors text-red-600">Supprimer</button>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-lg" style={{ color: COLORS.text }}>{emp.nom} {emp.prenom}</p>
                      <p className="text-sm" style={{ color: COLORS.textLight }}>{emp.email}</p>
                      <div className="mt-3 space-y-2 text-sm">
                        <p style={{ color: COLORS.textLight }}>Tél: {emp.tel || '-'}</p>
                        <p style={{ color: COLORS.textLight }}>Adresse: {emp.adresse || '-'}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}>
                            {emp.role || '-'}
                          </span>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                            {emp.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p style={{ color: COLORS.textLight }}>Créé le: {formatDate(emp.date_creation)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeView === 'Etablissement' && (
              <section className="bg-white rounded-3xl p-6 shadow-sm border" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: COLORS.text }}>
                    <BuildingOffice2Icon className="h-6 w-6" style={{ color: COLORS.primary }} /> Informations établissement
                  </h2>
                  <button
                    onClick={() => setEditEtablissement((v) => !v)}
                    className="px-4 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    style={{ background: COLORS.gradient }}
                  >
                    {editEtablissement ? 'Annuler' : 'Modifier'}
                  </button>
                </div>

                {!editEtablissement ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.bg }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textLight }}>Nom</p>
                      <p className="font-medium" style={{ color: COLORS.text }}>{aPropos?.nom_etablissement || '-'}</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.bg }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textLight }}>Téléphone</p>
                      <p className="font-medium" style={{ color: COLORS.text }}>{aPropos?.tel || '-'}</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.bg }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textLight }}>Email</p>
                      <p className="font-medium" style={{ color: COLORS.text }}>{aPropos?.email || '-'}</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.bg }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textLight }}>Adresse</p>
                      <p className="font-medium" style={{ color: COLORS.text }}>{aPropos?.adresse || '-'}</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.bg }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textLight }}>Jours ouverture</p>
                      <p className="font-medium" style={{ color: COLORS.text }}>{aPropos?.jours_ouverture || '-'}</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.bg }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textLight }}>Horaires</p>
                      <p className="font-medium" style={{ color: COLORS.text }}>{aPropos?.heure_ouverture?.substring?.(0, 5)} - {aPropos?.heure_fermeture?.substring?.(0, 5)}</p>
                    </div>
                    <div className="sm:col-span-2 p-4 rounded-2xl" style={{ backgroundColor: COLORS.bg }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textLight }}>Description</p>
                      <p className="font-medium" style={{ color: COLORS.text }}>{aPropos?.description || '-'}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={saveEtablissement} className="grid sm:grid-cols-2 gap-4">
                    <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Nom établissement" value={etabForm.nom_etablissement || ''} onChange={(e) => setEtabForm({ ...etabForm, nom_etablissement: e.target.value })} />
                    <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Téléphone" value={etabForm.tel || ''} onChange={(e) => setEtabForm({ ...etabForm, tel: e.target.value })} />
                    <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Email" value={etabForm.email || ''} onChange={(e) => setEtabForm({ ...etabForm, email: e.target.value })} />
                    <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Adresse" value={etabForm.adresse || ''} onChange={(e) => setEtabForm({ ...etabForm, adresse: e.target.value })} />
                    <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Jours ouverture" value={etabForm.jours_ouverture || ''} onChange={(e) => setEtabForm({ ...etabForm, jours_ouverture: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="time" className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} value={etabForm.heure_ouverture?.substring?.(0, 5) || ''} onChange={(e) => setEtabForm({ ...etabForm, heure_ouverture: e.target.value })} />
                      <input type="time" className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} value={etabForm.heure_fermeture?.substring?.(0, 5) || ''} onChange={(e) => setEtabForm({ ...etabForm, heure_fermeture: e.target.value })} />
                    </div>
                    <textarea className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all sm:col-span-2" style={{ borderColor: COLORS.border }} rows={4} placeholder="Description" value={etabForm.description || ''} onChange={(e) => setEtabForm({ ...etabForm, description: e.target.value })} />
                    <div className="sm:col-span-2 flex justify-end">
                      <button type="submit" className="px-5 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>Enregistrer</button>
                    </div>
                  </form>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {showEmployeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
              <h3 className="font-bold text-xl" style={{ color: COLORS.text }}>
                {employeMode === 'add' ? 'Ajouter un employé' : 'Modifier un employé'}
              </h3>
              <button onClick={() => setShowEmployeModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={submitEmploye} className="p-6 grid sm:grid-cols-2 gap-4">
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Nom *" value={employeForm.nom} onChange={(e) => setEmployeForm({ ...employeForm, nom: e.target.value })} required />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Prénom *" value={employeForm.prenom} onChange={(e) => setEmployeForm({ ...employeForm, prenom: e.target.value })} required />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} type="number" placeholder="Âge" value={employeForm.age} onChange={(e) => setEmployeForm({ ...employeForm, age: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Téléphone" value={employeForm.tel} onChange={(e) => setEmployeForm({ ...employeForm, tel: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all sm:col-span-2" style={{ borderColor: COLORS.border }} placeholder="Adresse" value={employeForm.adresse} onChange={(e) => setEmployeForm({ ...employeForm, adresse: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all sm:col-span-2" style={{ borderColor: COLORS.border }} type="email" placeholder="Email *" value={employeForm.email} onChange={(e) => setEmployeForm({ ...employeForm, email: e.target.value })} required />
              <select className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} value={employeForm.role} onChange={(e) => setEmployeForm({ ...employeForm, role: e.target.value })} required>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <input
                className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                style={{ borderColor: COLORS.border }}
                type="password"
                placeholder={employeMode === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe (optionnel)'}
                value={employeForm.mot_passe}
                onChange={(e) => setEmployeForm({ ...employeForm, mot_passe: e.target.value })}
                required={employeMode === 'add'}
              />
              <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowEmployeModal(false)} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
              <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: COLORS.text }}>
                <UserCircleIcon className="h-6 w-6" style={{ color: COLORS.primary }} /> Profil
              </h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={saveProfile} className="p-6 grid sm:grid-cols-2 gap-4">
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Nom" value={profileForm.nom} onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Prénom" value={profileForm.prenom} onChange={(e) => setProfileForm({ ...profileForm, prenom: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} placeholder="Téléphone" value={profileForm.tel} onChange={(e) => setProfileForm({ ...profileForm, tel: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} type="number" placeholder="Âge" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all sm:col-span-2" style={{ borderColor: COLORS.border }} type="email" placeholder="Email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all sm:col-span-2" style={{ borderColor: COLORS.border }} placeholder="Adresse" value={profileForm.adresse} onChange={(e) => setProfileForm({ ...profileForm, adresse: e.target.value })} />
              <input className="border-2 rounded-xl px-4 py-3 bg-gray-50" style={{ borderColor: COLORS.border }} value={profileForm.role} readOnly />
              <input className="border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all" style={{ borderColor: COLORS.border }} type="password" placeholder="Nouveau mot de passe (optionnel)" value={profileForm.mot_passe} onChange={(e) => setProfileForm({ ...profileForm, mot_passe: e.target.value })} />
              <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowProfileModal(false)} className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}>Annuler</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>Mettre à jour</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}