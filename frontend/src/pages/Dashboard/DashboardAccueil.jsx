import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant de Carte de Statistiques
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center" style={{ borderLeft: `5px solid ${color}` }}>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: color }}>{value}</p>
    </div>
    <Icon className="h-8 w-8 text-gray-300" />
  </div>
);

// Icônes
const VisitorIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AppointmentIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MessageIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const CallIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export default function DashboardAccueil() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et du service accueil
    if (!user.service?.toLowerCase().includes('accueil')) {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate, user.service]);

  const mainColor = '#FF9800';
  const accentColor = '#2196F3';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold mb-8" style={{ color: mainColor }}>Service Accueil</h1>
          <nav>
            <ul>
              {['Dashboard', 'Visiteurs', 'Rendez-vous', 'Messages', 'Contacts'].map((item, index) => (
                <li key={index} className="mb-2">
                  <button className="w-full text-left flex items-center p-3 rounded-xl transition text-gray-600 hover:bg-gray-50">
                    <span className="mr-3"></span> {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition text-sm"
        >
          <span className="mr-3">→</span> Déconnexion
        </button>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light">
            Bienvenue, <span className="font-semibold" style={{ color: mainColor }}>{user.prenom} {user.nom}</span>
          </h2>
          <div className="w-10 h-10 rounded-full bg-orange-300 text-white flex items-center justify-center font-bold">
            {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
          </div>
        </header>

        {/* Statistiques */}
        <section className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Visiteurs Aujourd'hui" value="45" icon={VisitorIcon} color={mainColor} />
          <StatCard title="Rendez-vous" value="12" icon={AppointmentIcon} color={accentColor} />
          <StatCard title="Messages" value="28" icon={MessageIcon} color="#9C27B0" />
          <StatCard title="Appels" value="63" icon={CallIcon} color="#4CAF50" />
        </section>

        {/* Sections spécifiques à l'accueil */}
        <section className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Prochains Rendez-vous</h3>
            {/* Liste des rendez-vous du jour */}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Messages Récents</h3>
            {/* Liste des derniers messages */}
          </div>
        </section>

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Visiteurs en Attente</h3>
            {/* Liste des visiteurs en attente */}
          </div>
          <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Notes Importantes</h3>
            {/* Notes et rappels importants */}
          </div>
        </section>
      </main>
    </div>
  );
}