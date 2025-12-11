import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiUserLine, RiBookOpenLine, RiSettings4Line, RiLogoutBoxLine } from 'react-icons/ri';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Alliance Française</h2>
      </div>
      
      <nav className="space-y-2">
        <Link to="/dashboard" 
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/dashboard') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}>
          <RiDashboardLine className="text-xl" />
          <span>Dashboard</span>
        </Link>

        <Link to="/employes" 
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/employes') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}>
          <RiUserLine className="text-xl" />
          <span>Employés</span>
        </Link>

        <Link to="/gestion-cours" 
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/gestion-cours') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}>
          <RiBookOpenLine className="text-xl" />
          <span>Gestion de cours</span>
        </Link>

        <Link to="/parametres" 
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/parametres') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}>
          <RiSettings4Line className="text-xl" />
          <span>Paramètres</span>
        </Link>

        <button onClick={() => {/* Fonction de déconnexion */}} 
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <RiLogoutBoxLine className="text-xl" />
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
