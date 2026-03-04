import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import inscriptionService from '../../services/inscriptionService';

// Modern Pastel Palette - matching HomePage
const COLORS = {
  primary: '#6B9080',
  secondary: '#A4C3B2',
  accent: '#EAF4F4',
  highlight: '#F6FFF8',
  text: '#2D3436',
  textLight: '#636E72',
  border: '#E8E8E8',
};

const MesCours = () => {
  const [coursEnCours, setCoursEnCours] = useState([]);
  const [coursTermines, setCoursTermines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || user.email_inscription;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inscriptionData = userEmail ? await inscriptionService.getByEmail(userEmail) : [];
        
        const now = new Date();
        const enCours = [];
        const termines = [];
        
        (inscriptionData || []).forEach(ins => {
          if (ins.date_fin_session) {
            const finDate = new Date(ins.date_fin_session);
            if (finDate >= now && ins.etat_inscription) {
              enCours.push(ins);
            } else if (finDate < now) {
              termines.push(ins);
            }
          } else if (ins.etat_inscription) {
            enCours.push(ins);
          }
        });
        
        setCoursEnCours(enCours);
        setCoursTermines(termines);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération des cours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  if (loading) {
    return (
      <DashboardLayout userType="apprenant" title="Mes Cours">
        <div className="flex justify-center items-center h-64">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          </div>
          <p className="ml-4 text-lg font-medium" style={{ color: COLORS.text }}>Chargement de vos cours...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="apprenant" title="Mes Cours">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6" role="alert">
          <strong className="font-semibold">Erreur! </strong>
          <span className="block sm:inline">Certaines informations n'ont pas pu être chargées: {error}</span>
        </div>
      )}

      {/* Cours en cours */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>Cours en cours</h2>
          <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 font-medium">
            {coursEnCours.length} cours
          </span>
        </div>
        {coursEnCours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursEnCours.map((cours) => (
              <div
                key={cours.id}
                className="border rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.highlight }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: COLORS.text }}>{cours.nom_session || 'Session en cours'}</h3>
                    <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Niveau: {cours.niveau || 'N/A'}</p>
                    {cours.date_debut_session && (
                      <p className="text-xs mt-2" style={{ color: COLORS.textLight }}>
                        Début: {new Date(cours.date_debut_session).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {cours.date_fin_session && (
                      <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                        Fin: {new Date(cours.date_fin_session).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-600">
                    En cours
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8" style={{ color: COLORS.textLight }}>
            <p>Aucun cours en cours pour le moment.</p>
          </div>
        )}
      </div>

      {/* Cours terminés */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>Cours terminés</h2>
          <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
            {coursTermines.length} cours
          </span>
        </div>
        {coursTermines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursTermines.map((cours) => (
              <div
                key={cours.id}
                className="border rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: COLORS.text }}>{cours.nom_session || 'Session terminée'}</h3>
                    <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Niveau: {cours.niveau || 'N/A'}</p>
                    {cours.date_fin_session && (
                      <p className="text-xs mt-2" style={{ color: COLORS.textLight }}>
                        Terminé le: {new Date(cours.date_fin_session).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                    Terminé
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8" style={{ color: COLORS.textLight }}>
            <p>Aucun cours terminé pour le moment.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MesCours;
