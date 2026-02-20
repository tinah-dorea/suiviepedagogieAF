import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import inscriptionService from '../../services/inscriptionService';

const DashboardApprenant = () => {
  const navigate = useNavigate();
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || user.email_inscription; // Use either field that might contain student email

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        // Fetch inscriptions for the current logged-in student
        const data = await inscriptionService.getByEmail(userEmail);
        setInscriptions(data);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération des inscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchInscriptions();
    }
  }, [userEmail]);

  if (loading) {
    return (
      <DashboardLayout 
        userType="apprenant" 
        title="Tableau de Bord Apprenant" 
      >
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Chargement de vos informations...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout 
        userType="apprenant" 
        title="Tableau de Bord Apprenant" 
      >
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">Impossible de charger vos informations: {error}</span>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate student statistics
  const totalInscriptions = inscriptions.length;
  const activeInscriptions = inscriptions.filter(ins => ins.etat_inscription).length;

  // Stat cards for the student dashboard
  const statCards = [
    {
      title: "Mes Inscriptions",
      value: totalInscriptions,
      color: "#3B82F6",
      icon: "📝"
    },
    {
      title: "Cours Actifs",
      value: activeInscriptions,
      color: "#10B981",
      icon: "📚"
    },
    {
      title: "Assiduité",
      value: "N/A", // This would need to come from a presence service
      color: "#EF4444",
      icon: "✅"
    }
  ];

  // Get user profile info
  const studentProfile = {
    nom: user.nom || "N/A",
    prenom: user.prenom || "N/A",
    email: user.email || "N/A",
    tel: user.tel || "N/A",
    niveau_scolaire: user.niveau_scolaire || "N/A",
    etablissement: user.etablissement || "N/A"
  };

  return (
    <DashboardLayout 
      userType="apprenant" 
      title="Tableau de Bord Apprenant" 
    >
      {/* Welcome section with student profile */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {studentProfile.prenom} {studentProfile.nom}!</h1>
            <p className="mt-2 opacity-90">Bienvenue dans votre espace personnel</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm">Niveau: {studentProfile.niveau_scolaire}</p>
            <p className="text-sm">Établissement: {studentProfile.etablissement}</p>
          </div>
        </div>
      </div>

      {/* Statistiques pour l'apprenant */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100"
            style={{ borderLeft: `5px solid ${stat.color}` }}
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Card for My Courses */}
        <div 
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/mes-cours')}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <span className="text-blue-600 text-xl">📚</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Mes Cours</h2>
              <p className="text-gray-600 text-sm">Consulter vos cours</p>
            </div>
          </div>
        </div>
        
        {/* Card for Schedule */}
        <div 
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/mon-planning')}
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-green-600 text-xl">📅</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Mon Emploi du Temps</h2>
              <p className="text-gray-600 text-sm">Voir votre planning</p>
            </div>
          </div>
        </div>
        
        {/* Card for Presence */}
        <div 
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/ma-presence')}
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <span className="text-purple-600 text-xl">✅</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Ma Présence</h2>
              <p className="text-gray-600 text-sm">Suivre votre assiduité</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inscriptions Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mes Inscriptions Récentes</h2>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => navigate('/dashboard-apprenant/inscriptions')}
          >
            Voir tout
          </button>
        </div>
        
        {inscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro de Carte
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'Inscription
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscriptions.slice(0, 3).map((inscription) => (
                  <tr key={inscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inscription.num_carte || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inscription.nom_session || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inscription.etat_inscription 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {inscription.etat_inscription ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inscription.date_inscription ? new Date(inscription.date_inscription).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Vous n'avez aucune inscription pour le moment.</p>
        )}
      </div>

      {/* Student Info Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-2">
            <p className="text-sm text-gray-500">Nom Complet</p>
            <p className="font-medium">{studentProfile.prenom} {studentProfile.nom}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{studentProfile.email}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-500">Téléphone</p>
            <p className="font-medium">{studentProfile.tel}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-500">Établissement</p>
            <p className="font-medium">{studentProfile.etablissement}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardApprenant;