import React, { useEffect, useState } from 'react';
import { getStatistiquesPedagogiques } from '../../services/statistiqueService.js';
import sessionService from '../../services/sessionService';
import { CalendarIcon, ClockIcon, BoltIcon, AcademicCapIcon, UserGroupIcon, BookOpenIcon, TrophyIcon } from '@heroicons/react/24/outline';

// Modern Pastel Palette - keeping sidebar burgundy (#7B011E)
const COLORS = {
  bg: '#F8F9FA',
  card: '#FFFFFF',
  primary: '#6B9080',
  secondary: '#A4C3B2',
  accent: '#EAF4F4',
  highlight: '#F6FFF8',
  text: '#2D3436',
  textLight: '#636E72',
  border: '#E8E8E8',
  // Stat colors (pastel)
  statGreen: '#B5EAD7',
  statGreenText: '#2D7A5F',
  statBlue: '#C7CEEA',
  statBlueText: '#5A5F8C',
  statPurple: '#E5C6FF',
  statPurpleText: '#6B4C7A',
  statOrange: '#FFD6B5',
  statOrangeText: '#A85A2A',
};

// Composant de Carte de Statistiques
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-opacity-50" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: COLORS.textLight }}>{title}</p>
        <p className="text-3xl font-bold" style={{ color: COLORS.text }}>{value}</p>
      </div>
      <div className="rounded-2xl p-4" style={{ backgroundColor: bgColor }}>
        <Icon className="h-6 w-6" style={{ color: color }} />
      </div>
    </div>
  </div>
);

// Composant de Carte de Cours
const CourseCard = ({ session, type }) => {
  const today = new Date();
  const startDate = new Date(session.date_debut);
  const isUpcoming = type === 'upcoming';

  const daysUntil = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-opacity-50" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold mb-1" style={{ color: COLORS.text }}>{session.nom_session || `${session.mois} ${session.annee}`}</h4>
          <p className="text-sm" style={{ color: COLORS.textLight }}>{session.nom_type_cours}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          isUpcoming ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {isUpcoming ? 'Bientôt' : 'Récent'}
        </span>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center" style={{ color: COLORS.textLight }}>
          <CalendarIcon className="w-4 h-4 mr-2" style={{ color: COLORS.primary }} />
          <span>{new Date(session.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center" style={{ color: COLORS.textLight }}>
          <ClockIcon className="w-4 h-4 mr-2" style={{ color: COLORS.primary }} />
          <span>{session.duree_cours || 0}h</span>
        </div>
        {isUpcoming && daysUntil > 0 && (
          <div className="flex items-center pt-2 mt-2 border-t" style={{ borderColor: COLORS.border }}>
            <BoltIcon className="w-4 h-4 mr-2" style={{ color: '#F59E0B' }} />
            <span className="font-medium" style={{ color: '#F59E0B' }}>{daysUntil} jours</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPedagogiqueAccueil = () => {
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalApprenantsCours: 0,
    totalApprenantsDALF: 0,
    totalEnseignants: 0
  });
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les statistiques
        const statsData = await getStatistiquesPedagogiques();
        setStats(statsData);

        // Charger les sessions
        const sessionsData = await sessionService.getAll();
        const today = new Date();

        // Trier les sessions par date de début
        const sortedSessions = sessionsData.sort((a, b) =>
          new Date(a.date_debut) - new Date(b.date_debut)
        );

        // 5 prochaines sessions à venir
        const upcoming = sortedSessions
          .filter(session => new Date(session.date_debut) > today)
          .slice(0, 5);

        // 5 dernières sessions récentes
        const recent = sortedSessions
          .filter(session => new Date(session.date_debut) <= today)
          .reverse()
          .slice(0, 5);

        setUpcomingCourses(upcoming);
        setRecentCourses(recent);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <AcademicCapIcon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Étudiants"
          value={stats.totalEtudiants || 0}
          icon={UserGroupIcon}
          color={COLORS.statGreenText}
          bgColor={COLORS.statGreen}
        />
        <StatCard
          title="Apprenants en Cours"
          value={stats.totalApprenantsCours || 0}
          icon={BookOpenIcon}
          color={COLORS.statBlueText}
          bgColor={COLORS.statBlue}
        />
        <StatCard
          title="Apprenants DALF"
          value={stats.totalApprenantsDALF || 0}
          icon={TrophyIcon}
          color={COLORS.statPurpleText}
          bgColor={COLORS.statPurple}
        />
        <StatCard
          title="Enseignants"
          value={stats.totalEnseignants || 0}
          icon={AcademicCapIcon}
          color={COLORS.statOrangeText}
          bgColor={COLORS.statOrange}
        />
      </div>

      {/* Prochains Cours */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.statBlue }}>
            <CalendarIcon className="h-5 w-5" style={{ color: COLORS.statBlueText }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>5 Prochains Cours</h2>
            <p className="text-xs" style={{ color: COLORS.textLight }}>À venir</p>
          </div>
        </div>
        {upcomingCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {upcomingCourses.map((session) => (
              <CourseCard key={session.id} session={session} type="upcoming" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed p-8 text-center" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}>
            <CalendarIcon className="mx-auto h-12 w-12 opacity-40" style={{ color: COLORS.primary }} />
            <p className="mt-3 text-sm font-medium" style={{ color: COLORS.text }}>Aucun cours à venir</p>
          </div>
        )}
      </div>

      {/* Derniers Cours */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.statGreen }}>
            <BookOpenIcon className="h-5 w-5" style={{ color: COLORS.statGreenText }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>5 Derniers Cours</h2>
            <p className="text-xs" style={{ color: COLORS.textLight }}>Récemment débutés</p>
          </div>
        </div>
        {recentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {recentCourses.map((session) => (
              <CourseCard key={session.id} session={session} type="recent" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed p-8 text-center" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}>
            <BookOpenIcon className="mx-auto h-12 w-12 opacity-40" style={{ color: COLORS.primary }} />
            <p className="mt-3 text-sm font-medium" style={{ color: COLORS.text }}>Aucun cours récent</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPedagogiqueAccueil;
