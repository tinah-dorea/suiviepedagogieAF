import React, { useState } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  UsersIcon,
  AcademicCapIcon,
  CalendarIcon,
  CogIcon,
  UserCircleIcon,
  HomeIcon,
  BookOpenIcon,
  PresentationChartLineIcon,
  ClipboardDocumentCheckIcon,
  Bars3BottomLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

export default function DashboardLayout({ 
  userType, 
  title,
  children
}) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    'Gestion des Cours': true,
    'Organisation': true,
    'Sessions': true
  });
  
  // Fonction pour déterminer si le lien est actif
  const isActive = (path) => {
    // Pour les pages d'accueil, vérifier uniquement si on est exactement sur cette route
    if (path === '/dashboard-pedagogique' || 
        path === '/dashboard' || 
        path === '/dashboard-professeur' || 
        path === '/dashboard-apprenant' || 
        path === '/dashboard-accueil') {
      return location.pathname === path;
    }
    // Pour les autres routes, vérifier si le chemin est inclus dans la route actuelle
    return location.pathname.includes(path);
  };

  // Fonction pour vérifier si on est sur la page d'accueil pédagogique
  const isAccueilPedagogique = location.pathname === '/dashboard-pedagogique';
  
  // Fonction pour vérifier si on est sur la page d'accueil professeur
  const isAccueilProfesseur = location.pathname === '/dashboard-professeur';

  // Fonction pour basculer l'expansion des menus
  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

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
        icon: BookOpenIcon,
        activePaths: ["/dashboard-pedagogique/cours"],
        submenu: [
          { name: "Type de service", path: "/dashboard-pedagogique/type-service", activePaths: ["/dashboard-pedagogique/type-service"] },
          { name: "Type de cours", path: "/dashboard-pedagogique/type-cours", activePaths: ["/dashboard-pedagogique/type-cours"] },
          { name: "Niveaux", path: "/dashboard-pedagogique/niveaux", activePaths: ["/dashboard-pedagogique/niveaux"] },
          { name: "Catégorie", path: "/dashboard-pedagogique/categorie", activePaths: ["/dashboard-pedagogique/categorie"] },
          { name: "Motivation", path: "/dashboard-pedagogique/motivation", activePaths: ["/dashboard-pedagogique/motivation"] },
          { name: "Salle", path: "/dashboard-pedagogique/salles", activePaths: ["/dashboard-pedagogique/salles"] }
        ]
      },
      {
        name: "Organisation",
        icon: CalendarIcon,
        activePaths: ["/dashboard-pedagogique/organisations"],
        submenu: [
          { name: "Sessions", path: "/dashboard-pedagogique/sessions", activePaths: ["/dashboard-pedagogique/sessions"] },
          { name: "Horaires", path: "/dashboard-pedagogique/horaires", activePaths: ["/dashboard-pedagogique/horaires"] },
          { name: "Créneaux", path: "/dashboard-pedagogique/creneaux", activePaths: ["/dashboard-pedagogique/creneaux"] }
        ]
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
        name: "Gestion des Groupes",
        icon: UsersIcon,
        activePaths: ["/dashboard-pedagogique/groupes"],
        submenu: [
          { name: "Attribution des Groupes", path: "/dashboard-pedagogique/attribution-groupes", activePaths: ["/dashboard-pedagogique/attribution-groupes"] },
          { name: "Liste de Groupes", path: "/dashboard-pedagogique/liste-groupes", activePaths: ["/dashboard-pedagogique/liste-groupes"] },
          { name: "Attribution Salle", path: "/dashboard-pedagogique/attribution-salle", activePaths: ["/dashboard-pedagogique/attribution-salle"] }
        ]
      },
      {
        name: "Gestion des Professeurs",
        path: "/dashboard-pedagogique/professeurs",
        icon: AcademicCapIcon,
        activePaths: ["/dashboard-pedagogique/professeurs"]
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
        name: "Tableau de Bord", 
        path: "/dashboard-professeur", 
        icon: HomeIcon,
        activePaths: ["/dashboard-professeur"]
      },
      { 
        name: "Voir Cours", 
        path: "/dashboard-professeur/voir-cours", 
        icon: BookOpenIcon,
        activePaths: ["/dashboard-professeur/voir-cours"]
      },
      { 
        name: "Consulter Attributs", 
        path: "/dashboard-professeur/consulter-attributs", 
        icon: UsersIcon,
        activePaths: ["/dashboard-professeur/consulter-attributs"]
      },
      { 
        name: "Présence", 
        path: "/dashboard-professeur/presence", 
        icon: ClipboardDocumentCheckIcon,
        activePaths: ["/dashboard-professeur/presence"]
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
            Alliance Française Mahajanga
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.3) transparent' }}>
          {userNavigation.map((item) => {
            const isItemActive = item.activePaths.some(path => isActive(path));
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus[item.name];

            if (hasSubmenu) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isItemActive ? 'bg-white/90' : 'hover:bg-white/20'
                    }`}
                    style={{
                      color: isItemActive ? primaryColor : '#FFFFFF',
                      ...(isItemActive ? { fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.9)' } : {})
                    }}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2.5" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUpIcon className="h-3.5 w-3.5 transition-transform duration-200" />
                    ) : (
                      <ChevronDownIcon className="h-3.5 w-3.5 transition-transform duration-200" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-white/20 pl-2">
                      {item.submenu.map((subItem) => {
                        const isSubItemActive = subItem.activePaths.some(path => isActive(path));
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`block px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                              isSubItemActive ? 'bg-white/80' : 'hover:bg-white/20'
                            }`}
                            style={{
                              color: isSubItemActive ? primaryColor : 'rgba(255,255,255,0.85)',
                              ...(isSubItemActive ? { fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.8)' } : {})
                            }}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isItemActive ? 'bg-white/90' : 'hover:bg-white/20'
                }`}
                style={{
                  color: isItemActive ? primaryColor : '#FFFFFF',
                  ...(isItemActive ? { fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.9)' } : {})
                }}
              >
                <item.icon className="h-4 w-4 mr-2.5" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
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
                Alliance Française Mahajanga
              </div>
              <button
                className="ml-auto text-gray-300 hover:text-white"
                onClick={() => setSidebarOpen(false)}
                style={{ color: '#FFFFFF' }}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.3) transparent' }}>
              {userNavigation.map((item) => {
                const isItemActive = item.activePaths.some(path => isActive(path));
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isExpanded = expandedMenus[item.name];

                if (hasSubmenu) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isItemActive ? 'bg-white/90' : 'hover:bg-white/20'
                        }`}
                        style={{
                          color: isItemActive ? primaryColor : '#FFFFFF',
                          ...(isItemActive ? { fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.9)' } : {})
                        }}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-4 w-4 mr-2.5" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUpIcon className="h-3.5 w-3.5 transition-transform duration-200" />
                        ) : (
                          <ChevronDownIcon className="h-3.5 w-3.5 transition-transform duration-200" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-white/20 pl-2">
                          {item.submenu.map((subItem) => {
                            const isSubItemActive = subItem.activePaths.some(path => isActive(path));
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className={`block px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                                  isSubItemActive ? 'bg-white/80' : 'hover:bg-white/20'
                                }`}
                                style={{
                                  color: isSubItemActive ? primaryColor : 'rgba(255,255,255,0.85)',
                                  ...(isSubItemActive ? { fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.8)' } : {})
                                }}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isItemActive ? 'bg-white/90' : 'hover:bg-white/20'
                    }`}
                    style={{
                      color: isItemActive ? primaryColor : '#FFFFFF',
                      ...(isItemActive ? { fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.9)' } : {})
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-2.5" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
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
                  <button
                    onClick={() => {
                      setProfileModalOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mon Profil
                  </button>
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
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}