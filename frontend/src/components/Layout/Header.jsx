import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: 'var(--color-red)', fontSize: '1.8rem', fontWeight: '700' }}>
          AF Cours - Suivi Pédagogique
        </h1>
        <nav className="navbar">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/type-services" 
            className={`nav-link ${location.pathname.includes('type-services') ? 'active' : ''}`}
          >
            Types de Service
          </Link>
          <Link 
            to="/type-cours" 
            className={`nav-link ${location.pathname.includes('type-cours') ? 'active' : ''}`}
          >
            Types de Cours
          </Link>
          <Link 
            to="/inscriptions" 
            className={`nav-link ${location.pathname.includes('inscriptions') ? 'active' : ''}`}
          >
            Inscriptions
          </Link>
          <Link 
            to="/employes" 
            className={`nav-link ${location.pathname.includes('employes') ? 'active' : ''}`}
          >
            Employés
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;