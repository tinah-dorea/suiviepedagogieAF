import React, { useState } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ChartBarIcon, 
  UsersIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  CogIcon, 
  UserCircleIcon,
  HomeIcon,
  BookOpenIcon,
  PresentationChartLineIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon as HomeIconSolid,
  Bars3BottomLeftIcon 
} from '@heroicons/react/24/outline';
import { 
  AcademicCapIcon as AcademicCapIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
  PresentationChartLineIcon as PresentationChartLineIconSolid,
  HomeIcon as HomeIconSolidAlt
} from '@heroicons/react/24/solid';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { getStatistiquesPedagogiques, getStatistiquesProfesseur } from '../../services/statistiqueService.js';

export default function DashboardLayout({ 
  userType, 
  title, 
  children
}) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Initialize stats state based on user type
  const [stats, setStats] = useState(() => {
    if (userType === 'professeur') {
      // For professors, initialize with pedagogical stats structure
      return {
        totalEtudiants: 0,
        totalApprenantsCours: 0,
        totalApprenantsDALF: 0,
        totalEnseignants: 0,
        coursDuJour: []
      };
    } else {
      return {
        totalEtudiants: 0,
        totalApprenantsCours: 0,
        totalApprenantsDALF: 0,
        totalEnseignants: 0,
        coursDuJour: []
      };
    }
  });
  
  const [loading, setLoading] = useState(
    (userType === 'pedagogie' && location.pathname === '/dashboard-pedagogique') ||
    (userType === 'professeur' && location.pathname === '/dashboard-professeur')
  );
  const [error, setError] = useState(null);
  
  // Fonction pour déterminer si le lien est actif
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Fonction pour vérifier si on est sur la page d'accueil pédagogique
  const isAccueilPedagogique = location.pathname === '/dashboard-pedagogique';
  
  // Fonction pour vérifier si on est sur la page d'accueil professeur
  const isAccueilProfesseur = location.pathname === '/dashboard-professeur';
  
  // Vérifier si l'utilisateur est un professeur (même s'il est sur le dashboard pédagogique)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTeacher = user.service === 'professeurs';
  
  // Navigation items pour chaque type d'utilisateur
  const navigationItems = {
    pedagogie: [
      { 
        name: "Accueil", 
        path: "/dashboard-pedagogique", 
        icon: HomeIcon,
        activePaths: ["/dashboard-pedagogique"]
      },
      { 
        name: "Gestion des Cours", 
        path: "/dashboard-pedagogique/cours", 
        icon: BookOpenIcon,
        activePaths: ["/dashboard-pedagogique/cours"]
      },
      { 
        name: "Organisation", 
        path: "/dashboard-pedagogique/organisation", 
        icon: CalendarIcon,
        activePaths: ["/dashboard-pedagogique/organisation"]
      },
      { 
        name: "Gestion Inscription", 
        path: "/dashboard-pedagogique/inscriptions", 
        icon: UsersIcon,
        activePaths: ["/dashboard-pedagogique/inscriptions"]
      },
      { 
        name: "Sessions", 
        path: "/dashboard-pedagogique/sessions", 
        icon: PresentationChartLineIcon,
        activePaths: ["/dashboard-pedagogique/sessions"]
      },
      { 
        name: "Gestion des Professeurs", 
        path: "/dashboard-pedagogique/professeurs", 
        icon: AcademicCapIcon,
        activePaths: ["/dashboard-pedagogique/professeurs"]
      },
      { 
        name: "Gestion du Planning", 
        path: "/dashboard-pedagogique/planning", 
        icon: CalendarIcon,
        activePaths: ["/dashboard-pedagogique/planning"]
      },
      { 
        name: "Attribution Prof/Salles", 
        path: "/dashboard-pedagogique/attribution", 
        icon: ClipboardDocumentCheckIcon,
        activePaths: ["/dashboard-pedagogique/attribution"]
      }
    ],
    rh: [
      { 
        name: "Tableau de bord", 
        path: "/dashboard", 
        icon: HomeIcon,
        activePaths: ["/dashboard"]
      },
      { 
        name: "Gestion des Rôles", 
        path: "/dashboard/roles", 
        icon: CogIcon,
        activePaths: ["/dashboard/roles"]
      },
      { 
        name: "Gestion des Utilisateurs", 
        path: "/dashboard/utilisateurs", 
        icon: UsersIcon,
        activePaths: ["/dashboard/utilisateurs"]
      }
    ],
    accueil: [
      { 
        name: "Tableau de bord", 
        path: "/dashboard-accueil", 
        icon: HomeIcon,
        activePaths: ["/dashboard-accueil"]
      }
    ],
    professeur: [
      { 
        name: "Tableau de bord", 
        path: "/dashboard-professeur", 
        icon: HomeIcon,
        activePaths: ["/dashboard-professeur"]
      },
      { 
        name: "Mes Cours", 
        path: "/mes-cours", 
        icon: BookOpenIcon,
        activePaths: ["/mes-cours", "/cours"]
      },
      { 
        name: "Planning", 
        path: "/dashboard-professeur/planning", 
        icon: CalendarIcon,
        activePaths: ["/dashboard-professeur/planning"]
      },
      { 
        name: "Sessions", 
        path: "/dashboard-professeur/sessions", 
        icon: PresentationChartLineIcon,
        activePaths: ["/dashboard-professeur/sessions"]
      },
      { 
        name: "Gestion de Présence", 
        path: "/fiche-presence", 
        icon: ClipboardDocumentCheckIcon,
        activePaths: ["/fiche-presence", "/presence"]
      }
    ],
    apprenant: [
      { 
        name: "Tableau de bord", 
        path: "/dashboard-apprenant", 
        icon: HomeIcon,
        activePaths: ["/dashboard-apprenant"]
      },
      { 
        name: "Mes Cours", 
        path: "/mes-cours", 
        icon: BookOpenIcon,
        activePaths: ["/mes-cours", "/cours"]
      },
      { 
        name: "Mon Planning", 
        path: "/mon-planning", 
        icon: CalendarIcon,
        activePaths: ["/mon-planning", "/planning"]
      },
      { 
        name: "Ma Présence", 
        path: "/ma-presence", 
        icon: ClipboardDocumentCheckIcon,
        activePaths: ["/ma-presence", "/presence"]
      },
      { 
        name: "Profil", 
        path: "/profile", 
        icon: UserCircleIcon,
        activePaths: ["/profile"]
      }
    ]
  };

  const userNavigation = navigationItems[userType] || [];

  // Couleurs du thème
  const bgColor = '#F5F1E6'; // Fond
  const primaryColor = '#7B011E'; // Primaire
  const sidebarColor = '#7B011E'; // Couleur du sidebar

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Charger les statistiques pour le tableau de bord pédagogique
  React.useEffect(() => {
    if (userType === 'pedagogie' && isAccueilPedagogique && !isTeacher) {
      const fetchStats = async () => {
        try {
          const data = await getStatistiquesPedagogiques();
          setStats(data);
        } catch (err) {
          setError(err.message);
          console.error("Erreur lors de la récupération des statistiques:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
    // Also fetch pedagogical stats for teachers
    else if (userType === 'professeur' && isAccueilProfesseur) {
      const fetchStats = async () => {
        try {
          const data = await getStatistiquesPedagogiques();
          setStats(data);
        } catch (err) {
          setError(err.message);
          console.error("Erreur lors de la récupération des statistiques:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [userType, isAccueilPedagogique, isAccueilProfesseur, isTeacher]);

  // Charger les statistiques pour le tableau de bord professeur (only when on pedagogical dashboard as teacher)
  React.useEffect(() => {
    if (userType === 'pedagogie' && isAccueilPedagogique && isTeacher) {
      const fetchStats = async () => {
        try {
          const data = await getStatistiquesProfesseur();
          setStats({
            mesCours: data.mesCours || 0,
            mesEtudiants: data.mesEtudiants || 0,
            mesExamens: data.mesExamens || 0,
            tauxPresence: data.tauxPresence || '0%'
          });
        } catch (err) {
          setError(err.message);
          console.error("Erreur lors de la récupération des statistiques professeur:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [userType, isAccueilPedagogique, isTeacher]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Sidebar pour desktop */}
      <div 
        className={`hidden md:flex md:w-64 flex-col fixed inset-y-0 z-30 pt-8 pb-4 px-4 transition-all duration-300 ease-in-out`}
        style={{ 
          backgroundColor: sidebarColor, // Appliquer la couleur du sidebar
        }}
      >
        <div className="flex items-center justify-center mb-8 px-4">
          <div className="text-xl sm:text-2xl font-bold text-center" style={{ color: '#FFFFFF' }}>
            Alliance Française
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col space-y-2">
          {userNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                item.activePaths.some(path => isActive(path))
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              style={{
                color: item.activePaths.some(path => isActive(path)) 
                  ? primaryColor 
                  : '#FFFFFF',
                ...(item.activePaths.some(path => isActive(path)) 
                  ? { fontWeight: 'bold', backgroundColor: '#FFFFFF' } 
                  : {})
              }}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-200" style={{ borderColor: '#FFFFFF' }}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#FFFFFF' }}>{user.prenom} {user.nom}</p>
              <p className="text-xs text-gray-300 truncate" style={{ color: '#FFFFFF' }}>{user.service}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white ml-2"
              style={{ color: '#FFFFFF' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar pour mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="fixed inset-0" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div 
            className="relative flex-1 flex flex-col pt-8 pb-4 px-4 w-64 h-full transition-all duration-300 ease-in-out"
            style={{ 
              backgroundColor: sidebarColor, // Appliquer la couleur du sidebar
            }}
          >
            <div className="flex items-center justify-center mb-8 px-4">
              <div className="text-lg sm:text-xl font-bold truncate" style={{ color: '#FFFFFF' }}>
                Alliance Française
              </div>
              <button
                className="ml-auto text-gray-300 hover:text-white"
                onClick={() => setSidebarOpen(false)}
                style={{ color: '#FFFFFF' }}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col space-y-2">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 truncate ${
                    item.activePaths.some(path => isActive(path))
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{
                    color: item.activePaths.some(path => isActive(path)) 
                      ? primaryColor 
                      : '#FFFFFF',
                    ...(item.activePaths.some(path => isActive(path)) 
                      ? { fontWeight: 'bold', backgroundColor: '#FFFFFF' } 
                      : {})
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto pt-6 border-t border-gray-200" style={{ borderColor: '#FFFFFF' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#FFFFFF' }}>{user.prenom} {user.nom}</p>
                  <p className="text-xs text-gray-300 truncate" style={{ color: '#FFFFFF' }}>{user.service}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white ml-2"
                  style={{ color: '#FFFFFF' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Barre de navigation supérieure */}
        <header 
          className="flex items-center justify-between px-4 py-3 sm:px-6 shadow sticky top-0 z-10"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderBottom: `1px solid ${primaryColor}`,
          }}
        >
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3BottomLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[50vw]" style={{ color: primaryColor }}>{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Bouton du profil utilisateur */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold" style={{ color: primaryColor }}>
                  {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                </div>
                <span className="hidden sm:block">{user.prenom} {user.nom}</span>
              </button>
              
              {/* Dropdown du profil */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Zone de contenu principale */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-6">
          {/* Statistiques pour le tableau de bord pédagogique (non teachers) */}
          {userType === 'pedagogie' && isAccueilPedagogique && !isTeacher && !loading && !error && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <StatCard title="Total Étudiants" value={stats.totalEtudiants} icon={UsersIcon} color="#4CAF50" />
              <StatCard title="Apprenants Cours" value={stats.totalApprenantsCours} icon={BookOpenIcon} color="#2196F3" />
              <StatCard title="Apprenants DALF" value={stats.totalApprenantsDALF} icon={AcademicCapIcon} color="#9C27B0" />
              <StatCard title="Enseignants" value={stats.totalEnseignants} icon={AcademicCapIconSolid} color="#FF9800" />
            </section>
          )}
          
          {/* Statistiques pédagogiques pour le tableau de bord professeur */}
          {userType === 'professeur' && isAccueilProfesseur && !loading && !error && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <StatCard title="Total Étudiants" value={stats.totalEtudiants} icon={UsersIcon} color="#4CAF50" />
              <StatCard title="Apprenants Cours" value={stats.totalApprenantsCours} icon={BookOpenIcon} color="#2196F3" />
              <StatCard title="Apprenants DALF" value={stats.totalApprenantsDALF} icon={AcademicCapIcon} color="#9C27B0" />
              <StatCard title="Enseignants" value={stats.totalEnseignants} icon={AcademicCapIconSolid} color="#FF9800" />
            </section>
          )}
          
          {/* Statistiques pour un professeur sur le tableau de bord pédagogique */}
          {userType === 'pedagogie' && isAccueilPedagogique && isTeacher && !loading && !error && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <StatCard title="Mes Cours" value={stats.mesCours} icon={BookOpenIcon} color="#3B82F6" />
              <StatCard title="Mes Étudiants" value={stats.mesEtudiants} icon={UsersIcon} color="#10B981" />
              <StatCard title="Examens" value={stats.mesExamens} icon={ClipboardDocumentCheckIcon} color="#8B5CF6" />
              <StatCard title="Taux de Présence" value={stats.tauxPresence} icon={ChartBarIcon} color="#EF4444" />
            </section>
          )}
          
          {/* Chargement pour le tableau de bord pédagogique (non teachers) */}
          {userType === 'pedagogie' && isAccueilPedagogique && !isTeacher && loading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Chargement des statistiques...</p>
            </div>
          )}
          
          {/* Chargement pour le tableau de bord professeur */}
          {userType === 'professeur' && isAccueilProfesseur && loading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Chargement des statistiques...</p>
            </div>
          )}
          
          {/* Chargement pour un professeur sur le tableau de bord pédagogique */}
          {userType === 'pedagogie' && isAccueilPedagogique && isTeacher && loading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Chargement des statistiques...</p>
            </div>
          )}
          
          {/* Erreur pour le tableau de bord pédagogique (non teachers) */}
          {userType === 'pedagogie' && isAccueilPedagogique && !isTeacher && error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erreur! </strong>
              <span className="block sm:inline">Impossible de charger les statistiques: {error}</span>
            </div>
          )}
          
          {/* Erreur pour le tableau de bord professeur */}
          {userType === 'professeur' && isAccueilProfesseur && error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erreur! </strong>
              <span className="block sm:inline">Impossible de charger les statistiques: {error}</span>
            </div>
          )}
          
          {/* Erreur pour un professeur sur le tableau de bord pédagogique */}
          {userType === 'pedagogie' && isAccueilPedagogique && isTeacher && error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erreur! </strong>
              <span className="block sm:inline">Impossible de charger les statistiques: {error}</span>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}

// Composant de Carte de Statistiques
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center" style={{ borderLeft: `5px solid ${color}` }}>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: color }}>{value}</p>
    </div>
    <Icon className="h-8 w-8 text-gray-300" />
  </div>
);