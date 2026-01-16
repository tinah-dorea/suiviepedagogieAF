import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';

export default function DashboardPedagogique() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Icônes SVG
  const DashboardIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const BookIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );

  const TeacherIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const CalendarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const AssignmentIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  // Données pour les cartes statistiques
  const stats = [
    {
      title: "Cours Actifs",
      value: "15",
      color: "#4CAF50",
      icon: BookIcon
    },
    {
      title: "Étudiants",
      value: "240",
      color: "#2196F3",
      icon: UsersIcon
    },
    {
      title: "Professeurs",
      value: "12",
      color: "#FF9800",
      icon: TeacherIcon
    },
    {
      title: "Présences",
      value: "92%",
      color: "#9C27B0",
      icon: AssignmentIcon
    }
  ];

  return (
    <DashboardLayout 
      userType="pedagogie" 
      title="Service Pédagogique" 
      showStats={true}
      stats={stats}
    >
      <div className="mb-6">
        <p className="text-gray-600">Bienvenue dans votre espace pédagogique, {user.prenom} {user.nom}</p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            className="bg-white rounded-lg shadow-sm p-5 text-left border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard-pedagogique/cours')}
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <BookIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Gestion des Cours</h3>
                <p className="text-sm text-gray-500">Créer et gérer les cours</p>
              </div>
            </div>
          </button>
          
          <button 
            className="bg-white rounded-lg shadow-sm p-5 text-left border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard-pedagogique/inscriptions')}
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Gestion Inscription</h3>
                <p className="text-sm text-gray-500">Inscrire des étudiants</p>
              </div>
            </div>
          </button>
          
          <button 
            className="bg-white rounded-lg shadow-sm p-5 text-left border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard-pedagogique/professeurs')}
          >
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <TeacherIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Gestion des Professeurs</h3>
                <p className="text-sm text-gray-500">Assigner des enseignants</p>
              </div>
            </div>
          </button>
          
          <button 
            className="bg-white rounded-lg shadow-sm p-5 text-left border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard-pedagogique/planning')}
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Gestion du Planning</h3>
                <p className="text-sm text-gray-500">Planifier les cours</p>
              </div>
            </div>
          </button>
          
          <button 
            className="bg-white rounded-lg shadow-sm p-5 text-left border border-gray-100 hover:shadow-md transition-shadow col-span-2"
            onClick={() => navigate('/dashboard-pedagogique/attribution')}
          >
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <AssignmentIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Attribution Prof/Salles</h3>
                <p className="text-sm text-gray-500">Affecter des professeurs et des salles</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <Outlet />
    </DashboardLayout>
  );
}