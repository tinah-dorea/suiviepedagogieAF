import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiUserLine, 
  RiBookOpenLine, 
  RiSettings4Line, 
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiCalendarLine,
  RiClipboardLine
} from 'react-icons/ri';

const Sidebar = ({ onLogout, userType = 'admin' }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const professorMenuItems = [
    { icon: <RiDashboardLine className="text-xl" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <RiCalendarLine className="text-xl" />, label: 'Planning', path: '/planning' },
    { icon: <RiBookOpenLine className="text-xl" />, label: 'Mes Cours', path: '/mes-cours' },
    { icon: <RiClipboardLine className="text-xl" />, label: 'Fiche de Présence', path: '/fiche-presence' }
  ];

  const adminMenuItems = [
    { icon: <RiDashboardLine className="text-xl" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <RiUserLine className="text-xl" />, label: 'Employés', path: '/employes' },
    { icon: <RiBookOpenLine className="text-xl" />, label: 'Gestion de cours', path: '/gestion-cours' },
    { icon: <RiSettings4Line className="text-xl" />, label: 'Paramètres', path: '/parametres' }
  ];

  const menuItems = userType === 'professeur' ? professorMenuItems : adminMenuItems;

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-800 text-white"
      >
        {isOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
      </button>

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-20 h-screen bg-gray-800 text-white transition-transform duration-300 ease-in-out`}>
        <div className={`h-screen ${isOpen ? 'w-64' : 'w-20'} md:w-64 transition-all duration-300 ease-in-out`}>
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              {isOpen && (
                <h2 className="text-xl font-bold whitespace-nowrap overflow-hidden">
                  {userType === 'professeur' ? 'Professeur AF' : 'Alliance Française'}
                </h2>
              )}
              <button 
                onClick={toggleSidebar}
                className="md:hidden p-1 rounded hover:bg-gray-700"
              >
                {isOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
              </button>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path} 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(item.path) ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}

            <button 
              onClick={onLogout} 
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RiLogoutBoxLine className="text-xl" />
              {isOpen && <span>Déconnexion</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;