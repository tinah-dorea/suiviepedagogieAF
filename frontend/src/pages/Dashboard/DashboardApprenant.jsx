import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import inscriptionService from '../../services/inscriptionService';
import consultationService from '../../services/consultationService';
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

const DashboardApprenant = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [coursDisponibles, setCoursDisponibles] = useState([]);
  const [coursEnCours, setCoursEnCours] = useState([]);
  const [coursTermines, setCoursTermines] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || user.email_inscription;
  const userId = user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inscriptionData, sessionsData, presenceData] = await Promise.all([
          userEmail ? inscriptionService.getByEmail(userEmail) : Promise.resolve([]),
          consultationService.getSessions().catch(() => []),
          userId ? presenceService.getByApprenant(userId).catch(() => []) : Promise.resolve([])
        ]);

        setInscriptions(inscriptionData || []);
        
        // Filter sessions
        const now = new Date();
        const available = (sessionsData || []).filter((s) => {
          if (!s?.date_fin) return true;
          return new Date(s.date_fin) >= now;
        }).slice(0, 6);
        setCoursDisponibles(available);

        // Separate completed and current courses from inscriptions
        const enCours = [];
        const termines = [];
        
        (inscriptionData || []).forEach(ins => {
          if (ins.date_fin_session) {
            const finDate = new Date(ins.date_fin_session);
            if (finDate >= now) {
              enCours.push(ins);
            } else {
              termines.push(ins);
            }
          } else if (ins.etat_inscription) {
            enCours.push(ins);
          }
        });
        
        setCoursEnCours(enCours.slice(0, 5));
        setCoursTermines(termines.slice(0, 5));

        // Filter absences (etat_presence = false means absent)
        const absencesList = (presenceData || []).filter(p => !p.etat_presence);
        setAbsences(absencesList.slice(0, 5));
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération des données apprenant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail, userId]);

  if (loading) {
    return (
      <DashboardLayout userType="apprenant" title="Tableau de Bord Apprenant">
        <div className="flex justify-center items-center h-64">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          </div>
          <p className="ml-4 text-lg font-medium" style={{ color: COLORS.text }}>Chargement de vos informations...</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalInscriptions = inscriptions.length;
  const activeInscriptions = inscriptions.filter(ins => ins.etat_inscription).length;

  const studentProfile = {
    nom: user.nom || "N/A",
    prenom: user.prenom || "N/A",
    email: user.email || "N/A",
    tel: user.tel || "N/A",
    niveau_scolaire: user.niveau_scolaire || "N/A",
    etablissement: user.etablissement || "N/A"
  };

  return (
    <DashboardLayout userType="apprenant" title="Tableau de Bord Apprenant">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6" role="alert">
          <strong className="font-semibold">Erreur! </strong>
          <span className="block sm:inline">Certaines informations n'ont pas pu être chargées: {error}</span>
        </div>
      )}

      {/* Welcome section with gradient matching homepage */}
      <div
        className="rounded-2xl p-6 mb-6 text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {studentProfile.prenom} {studentProfile.nom}!</h1>
            <p className="mt-2 text-white/90">Bienvenue dans votre espace personnel</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <p className="text-sm">Niveau: <span className="font-medium">{studentProfile.niveau_scolaire}</span></p>
            <p className="text-sm">Établissement: <span className="font-medium">{studentProfile.etablissement}</span></p>
          </div>
        </div>
      </div>

      {/* Statistiques - sans icônes */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-emerald-50 p-5 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
          <p className="text-sm font-medium text-gray-500">Mes Inscriptions</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">{totalInscriptions}</p>
        </div>
        <div className="bg-teal-50 p-5 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
          <p className="text-sm font-medium text-gray-500">Cours Actifs</p>
          <p className="text-3xl font-bold mt-1 text-teal-600">{activeInscriptions}</p>
        </div>
      </section>

      {/* Cours en cours et terminés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cours en cours */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Cours en cours</h2>
          {coursEnCours.length > 0 ? (
            <div className="space-y-3">
              {coursEnCours.map((cours) => (
                <div
                  key={cours.id}
                  className="border rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.highlight }}
                >
                  <h3 className="font-semibold" style={{ color: COLORS.text }}>{cours.nom_session || 'Session en cours'}</h3>
                  <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>{cours.niveau || 'N/A'}</p>
                  {cours.date_fin_session && (
                    <p className="text-xs mt-2" style={{ color: COLORS.textLight }}>
                      Fin: {new Date(cours.date_fin_session).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4" style={{ color: COLORS.textLight }}>Aucun cours en cours.</p>
          )}
        </div>

        {/* Cours terminés */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Cours terminés</h2>
          {coursTermines.length > 0 ? (
            <div className="space-y-3">
              {coursTermines.map((cours) => (
                <div
                  key={cours.id}
                  className="border rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
                >
                  <h3 className="font-semibold" style={{ color: COLORS.text }}>{cours.nom_session || 'Session terminée'}</h3>
                  <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>{cours.niveau || 'N/A'}</p>
                  {cours.date_fin_session && (
                    <p className="text-xs mt-2" style={{ color: COLORS.textLight }}>
                      Terminé le: {new Date(cours.date_fin_session).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4" style={{ color: COLORS.textLight }}>Aucun cours terminé.</p>
          )}
        </div>
      </div>

      {/* Absences */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>Mes Absences</h2>
          {absences.length > 0 && (
            <span className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium">
              {absences.length} absence{absences.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
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
                  <tr key={absence.id} className="transition-colors">
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
          <div className="flex flex-col items-center justify-center py-8" style={{ color: COLORS.textLight }}>
            <p>Aucune absence enregistrée. Bravo!</p>
          </div>
        )}
      </div>

      {/* Cours disponibles */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border" style={{ borderColor: COLORS.border }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Cours disponibles</h2>
        {coursDisponibles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursDisponibles.map((cours) => (
              <div
                key={cours.id}
                className="border rounded-xl p-4 hover:shadow-md transition-all duration-300"
                style={{
                  borderColor: COLORS.border,
                  background: `linear-gradient(135deg, ${COLORS.highlight} 0%, #FFFFFF 100%)`
                }}
              >
                <h3 className="font-semibold" style={{ color: COLORS.text }}>{cours.nom_session || `${cours.mois || ''} ${cours.annee || ''}`.trim()}</h3>
                <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>{cours.nom_type_cours || 'Type non spécifié'}</p>
                <p className="text-sm mt-2" style={{ color: COLORS.textLight }}>
                  {cours.date_debut ? new Date(cours.date_debut).toLocaleDateString('fr-FR') : '-'} - {cours.date_fin ? new Date(cours.date_fin).toLocaleDateString('fr-FR') : '-'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4" style={{ color: COLORS.textLight }}>Aucun cours disponible pour le moment.</p>
        )}
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Informations Personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-3" style={{ borderColor: COLORS.border }}>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Nom Complet</p>
            <p className="font-medium" style={{ color: COLORS.text }}>{studentProfile.prenom} {studentProfile.nom}</p>
          </div>
          <div className="border-b pb-3" style={{ borderColor: COLORS.border }}>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Email</p>
            <p className="font-medium" style={{ color: COLORS.text }}>{studentProfile.email}</p>
          </div>
          <div className="border-b pb-3" style={{ borderColor: COLORS.border }}>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Téléphone</p>
            <p className="font-medium" style={{ color: COLORS.text }}>{studentProfile.tel}</p>
          </div>
          <div className="border-b pb-3" style={{ borderColor: COLORS.border }}>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Établissement</p>
            <p className="font-medium" style={{ color: COLORS.text }}>{studentProfile.etablissement}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardApprenant;
