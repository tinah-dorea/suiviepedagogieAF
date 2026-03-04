import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import presenceService from '../../services/presenceService';

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

const Absence = () => {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const presenceData = userId ? await presenceService.getByApprenant(userId) : [];
        
        // Filter absences (etat_presence = false means absent)
        const absencesList = (presenceData || []).filter(p => !p.etat_presence);
        setAbsences(absencesList);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération des absences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <DashboardLayout userType="apprenant" title="Mes Absences">
        <div className="flex justify-center items-center h-64">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          </div>
          <p className="ml-4 text-lg font-medium" style={{ color: COLORS.text }}>Chargement de vos absences...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="apprenant" title="Mes Absences">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6" role="alert">
          <strong className="font-semibold">Erreur! </strong>
          <span className="block sm:inline">Certaines informations n'ont pas pu être chargées: {error}</span>
        </div>
      )}

      {/* Summary card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>Total des absences</h2>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Nombre d'absences enregistrées</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold" style={{ color: absences.length > 0 ? '#EF4444' : COLORS.primary }}>
              {absences.length}
            </p>
            <p className="text-sm" style={{ color: COLORS.textLight }}>
              {absences.length > 0 ? 'absence(s)' : 'Aucune absence'}
            </p>
          </div>
        </div>
      </div>

      {/* Absences list */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Liste des absences</h2>
        {absences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ divideColor: COLORS.border }}>
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textLight }}>Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textLight }}>Session</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textLight }}>Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textLight }}>Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: COLORS.border }}>
                {absences.map((absence) => (
                  <tr key={absence.id} className="transition-colors hover:bg-red-50/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>
                      {absence.date_cours ? new Date(absence.date_cours).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: COLORS.text }}>
                      {absence.nom_session || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                        Absent
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textLight }}>
                      {absence.observation || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12" style={{ color: COLORS.textLight }}>
            <p className="text-lg font-medium" style={{ color: COLORS.text }}>Aucune absence enregistrée</p>
            <p className="text-sm mt-2">Félicitations! Vous avez une assiduité parfaite.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Absence;
