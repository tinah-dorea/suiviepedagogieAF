import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function DashboardPedagogique() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const mainColor = '#4CAF50';

  const navLinkStyle = "w-full text-left flex items-center p-3 rounded-xl transition";
  const activeStyle = "bg-green-100 text-green-700";
  const inactiveStyle = "text-gray-600 hover:bg-gray-50";

  const menuItems = [
    { to: "/dashboard-pedagogique", text: "Dashboard", icon: "📊", end: true },
    { to: "/dashboard-pedagogique/cours", text: "Gestion des Cours", icon: "📚" },
    { to: "/dashboard-pedagogique/inscriptions", text: "Gestion Inscription", icon: "👥" },
    { to: "/dashboard-pedagogique/professeurs", text: "Gestion des Professeurs", icon: "🧑‍🏫" },
    { to: "/dashboard-pedagogique/planning", text: "Gestion du Planning", icon: "📅" },
    { to: "/dashboard-pedagogique/attribution", text: "Attribution Prof/Salles",},
    { to: "/dashboard-pedagogique/notes", text: "Notes", icon: "📝" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold mb-8" style={{ color: mainColor }}>Service Pédagogique</h1>
          <nav>
            <ul>
              {menuItems.map(item => (
                <li key={item.to} className="mb-2">
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `${navLinkStyle} ${isActive ? activeStyle : inactiveStyle}`}
                  >
                    <span className="mr-3">{item.icon}</span> {item.text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition text-sm"
        >
          <span className="mr-3">→</span> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light">
            Bienvenue, <span className="font-semibold" style={{ color: mainColor }}>{user.prenom} {user.nom}</span>
          </h2>
          <div className="w-10 h-10 rounded-full bg-green-300 text-white flex items-center justify-center font-bold">
            {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
          </div>
        </header>
        
        <Outlet />
      </main>
    </div>
  );
}