import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UsersIcon, AcademicCapIcon, CalendarIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

// Modern Pastel Palette
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
  gradient: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)',
  // Stat colors (pastel)
  statBlue: '#C7CEEA',
  statBlueText: '#5A5F8C',
  statGreen: '#B5EAD7',
  statGreenText: '#2D7A5F',
  statOrange: '#FFD6B5',
  statOrangeText: '#A85A2A',
  statPurple: '#E5C6FF',
  statPurpleText: '#6B4C7A',
};

const DashboardProfesseurAccueil = () => {
  const [stats, setStats] = useState({
    totalGroupes: 0,
    totalApprenants: 0,
    totalSessions: 0,
    coursAujourdhui: 0
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({
          totalGroupes: 3,
          totalApprenants: 45,
          totalSessions: 8,
          coursAujourdhui: 2
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, bgColor, textColor }) => (
    <div className="rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-opacity-50" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: COLORS.textLight }}>{label}</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.text }}>{value}</p>
        </div>
        <div className="rounded-2xl p-4" style={{ backgroundColor: bgColor }}>
          <Icon className="h-6 w-6" style={{ color: textColor }} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ href, label, icon: Icon, bgColor, textColor }) => (
    <a
      href={href}
      className="block p-4 rounded-2xl transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
          <Icon className="h-5 w-5" style={{ color: textColor }} />
        </div>
        <span className="font-semibold" style={{ color: textColor }}>{label}</span>
      </div>
    </a>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Tableau de Bord Professeur</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Bienvenue, {user.nom_employe || user.nom || 'Professeur'}</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={AcademicCapIcon}
          label="Groupes assignés"
          value={stats.totalGroupes}
          bgColor={COLORS.statBlue}
          textColor={COLORS.statBlueText}
        />
        <StatCard
          icon={UsersIcon}
          label="Total apprenants"
          value={stats.totalApprenants}
          bgColor={COLORS.statGreen}
          textColor={COLORS.statGreenText}
        />
        <StatCard
          icon={CalendarIcon}
          label="Sessions actives"
          value={stats.totalSessions}
          bgColor={COLORS.statOrange}
          textColor={COLORS.statOrangeText}
        />
        <StatCard
          icon={ChartBarIcon}
          label="Cours aujourd'hui"
          value={stats.coursAujourdhui}
          bgColor={COLORS.statPurple}
          textColor={COLORS.statPurpleText}
        />
      </div>

      {/* Sections rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Actions rapides */}
        <div className="rounded-3xl p-6 shadow-sm border" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
              <BookOpenIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Actions rapides</h2>
          </div>
          <div className="space-y-3">
            <QuickActionCard
              href="/dashboard-professeur/voir-cours"
              label="Consulter les sessions"
              icon={CalendarIcon}
              bgColor={COLORS.statBlue}
              textColor={COLORS.statBlueText}
            />
            <QuickActionCard
              href="/dashboard-professeur/consulter-attributs"
              label="Voir les apprenants"
              icon={UsersIcon}
              bgColor={COLORS.statGreen}
              textColor={COLORS.statGreenText}
            />
            <QuickActionCard
              href="/dashboard-professeur/presence"
              label="Faire l'appel"
              icon={ClockIcon}
              bgColor={COLORS.statPurple}
              textColor={COLORS.statPurpleText}
            />
          </div>
        </div>

        {/* Informations */}
        <div className="rounded-3xl p-6 shadow-sm border" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
              <UsersIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Informations personnelles</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: COLORS.bg }}>
              <span className="text-sm font-medium" style={{ color: COLORS.textLight }}>Service</span>
              <span className="font-semibold" style={{ color: COLORS.text }}>{user.service || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: COLORS.bg }}>
              <span className="text-sm font-medium" style={{ color: COLORS.textLight }}>Email</span>
              <span className="font-semibold" style={{ color: COLORS.text }}>{user.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: COLORS.bg }}>
              <span className="text-sm font-medium" style={{ color: COLORS.textLight }}>Statut</span>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: COLORS.statGreen, color: COLORS.statGreenText }}>Actif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfesseurAccueil;
