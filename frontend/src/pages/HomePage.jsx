import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import typeServiceApi from '../services/typeService';

import accueilImg from '../assets/images/accueil.jpg';
import localImg from '../assets/images/local.jpg';

// Palette: #F5F1E6 majorité, #DFF6FF accompagnement, #758695 titres/hover
const COLORS = { bg: '#F5F1E6', accent: '#DFF6FF', primary: '#758695', white: '#FFFFFF' };

const HomePage = () => {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [typeServices, setTypeServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutResponse, servicesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/a-propos`),
          typeServiceApi.getAll(),
        ]);
        setAboutInfo(aboutResponse.data);
        setTypeServices(servicesResponse || []);
      } catch (err) {
        setError('Impossible de charger les informations');
        setTypeServices([]);
        try {
          const aboutResponse = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/a-propos`);
          setAboutInfo(aboutResponse.data);
        } catch (_) {
          setAboutInfo(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: COLORS.bg }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2" style={{ borderColor: COLORS.primary, backgroundColor: COLORS.bg }}></div>
          <p className="font-medium text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !aboutInfo) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-700">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 shadow-md z-50" style={{ backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {aboutInfo?.logo_url ? (
              <img
                src={aboutInfo.logo_url}
                alt={aboutInfo.nom_etablissement}
                className="h-12 object-contain"
              />
            ) : (
              <h1 className="text-xl font-bold" style={{ color: COLORS.primary, fontFamily: "'Source Sans 3', sans-serif" }}>{aboutInfo?.nom_etablissement || 'Alliance Française'}</h1>
            )}
          </div>

          <nav className="hidden md:flex justify-center space-x-10">
            <a href="#accueil" className="font-semibold transition-colors duration-200 hover:opacity-80" style={{ color: COLORS.primary }}>Accueil</a>
            <a href="#services" className="font-semibold transition-colors duration-200 hover:opacity-80" style={{ color: COLORS.primary }}>
              Services
            </a>
            <a href="#apropos" className="font-semibold transition-colors duration-200 hover:opacity-80" style={{ color: COLORS.primary }}>
              À propos
            </a>
          </nav>

          <div>
            <Link
              to="/login"
              className="px-5 py-2.5 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Section Hero - Accueil avec background accueil.jpg */}
      <section
        id="accueil"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${accueilImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 opacity-50" style={{ backgroundColor: COLORS.primary }}></div>
        <div className="relative z-10 text-center px-6 pt-24">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" style={{ color: COLORS.white }}>
            {aboutInfo?.nom_etablissement || 'Alliance Française'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90" style={{ color: COLORS.white }}>
            Apprenez le français dans un cadre d'excellence
          </p>
          <Link
            to="/cours"
            className="inline-block px-10 py-4 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            style={{ backgroundColor: COLORS.primary }}
          >
            Consulter les cours
          </Link>
        </div>
      </section>

      {/* Section Services - Données dynamiques depuis type_service */}
      <section id="services" className="py-24" style={{ backgroundColor: COLORS.accent }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: COLORS.primary }}>Nos Services</h2>
          <p className="text-center mb-16 max-w-2xl mx-auto text-gray-600">
            Découvrez notre gamme complète de formations en français adaptées à vos besoins
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {typeServices.length > 0 ? (
              typeServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border"
                  style={{ backgroundColor: COLORS.white, borderColor: 'rgba(117,134,149,0.2)' }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: COLORS.accent }}>
                    <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>{service.nom_service?.charAt(0) || '?'}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.primary }}>{service.nom_service}</h3>
                  <p className="leading-relaxed text-gray-600">
                    {service.libelle || 'Formation de qualité pour tous les niveaux.'}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-600">
                <p>Aucun service disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section À propos - Description avec image local.jpg */}
      <section id="apropos" className="py-24" style={{ backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: COLORS.primary }}>À propos de nous</h2>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6" style={{ color: COLORS.primary }}>Que faisons-nous ?</h3>
              <p className="leading-relaxed text-lg text-gray-700">
                {aboutInfo?.description || 'L\'Alliance Française propose des formations en français de qualité pour tous les publics.'}
              </p>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              <img
                src={localImg}
                alt="Nos locaux"
                className="w-full h-auto rounded-2xl shadow-xl object-cover max-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              {aboutInfo?.logo_url && (
                <img src={aboutInfo.logo_url} alt="Logo" className="h-12 object-contain opacity-90" />
              )}
              <span className="text-lg font-semibold">{aboutInfo?.nom_etablissement}</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-lg font-semibold mb-2">Contact</p>
              <p className="opacity-90">Tél: {aboutInfo?.tel}</p>
              <p className="opacity-90">Email: {aboutInfo?.email}</p>
              <p className="opacity-90">Adresse: {aboutInfo?.adresse}</p>
              <p className="opacity-90 mt-2">
                Ouvert: {aboutInfo?.jours_ouverture} de {aboutInfo?.heure_ouverture?.substring(0, 5)} à {aboutInfo?.heure_fermeture?.substring(0, 5)}
              </p>
            </div>
          </div>

          <div className="border-t border-white/30 mt-10 pt-8 text-center opacity-80">
            <p>&copy; {new Date().getFullYear()} {aboutInfo?.nom_etablissement}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
