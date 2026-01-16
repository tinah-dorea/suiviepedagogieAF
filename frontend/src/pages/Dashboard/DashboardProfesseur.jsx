import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Sidebar from '../../components/Layout/Sidebar';

const DashboardProfesseur = () => {
  const navigate = useNavigate();

  // Icônes SVG
  const BookIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const ClipboardIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  // Données pour les cartes statistiques
  const stats = [
    {
      title: "Mes Cours",
      value: "5",
      color: "#3B82F6",
      icon: BookIcon
    },
    {
      title: "Mes Étudiants",
      value: "120",
      color: "#10B981",
      icon: UsersIcon
    },
    {
      title: "Examens",
      value: "3",
      color: "#8B5CF6",
      icon: ClipboardIcon
    },
    {
      title: "Présences",
      value: "95%",
      color: "#EF4444",
      icon: ClipboardIcon
    }
  ];

  return (
    <DashboardLayout 
      userType="professeur" 
      title="Tableau de Bord Professeur" 
      showStats={true}
      stats={stats}
    >
      <div className="mb-6">
        <p className="text-gray-600">Bienvenue dans votre espace professeur</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte des cours */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Mes Cours</h2>
          <p className="text-gray-600">Consultez vos cours assignés et les horaires</p>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/cours')}
          >
            Voir mes cours
          </button>
        </div>
        
        {/* Carte des étudiants */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Mes Étudiants</h2>
          <p className="text-gray-600">Liste des étudiants inscrits à vos cours</p>
          <button 
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => navigate('/inscriptions')}
          >
            Voir mes étudiants
          </button>
        </div>
        
        {/* Carte des examens */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Examens</h2>
          <p className="text-gray-600">Gérer les examens et résultats</p>
          <button 
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            onClick={() => navigate('/examens')}
          >
            Voir les examens
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProfesseur;