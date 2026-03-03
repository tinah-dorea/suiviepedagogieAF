import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AcademicCapIcon, BookOpenIcon, ClockIcon, CalendarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import typeServiceApi from '../services/typeService';

import accueilImg from '../assets/images/accueil.jpg';
import localImg from '../assets/images/local.jpg';
import logoAFM from '../assets/images/logo AFM.png';

// Modern Pastel Palette - matching ConsultationCours
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
};

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-opacity-30 mx-auto mb-6" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }} />
            <AcademicCapIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: COLORS.primary }} />
          </div>
          <p className="text-lg font-medium" style={{ color: COLORS.text }}>Chargement...</p>
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
      {/* Header fixe avec gradient */}
      <header className="fixed top-0 left-0 right-0 shadow-lg z-50" style={{ background: COLORS.gradient }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logoAFM}
              alt="Logo AFM"
              className="h-10 md:h-12 object-contain"
            />
            <h1 className="text-xl font-bold text-white">{aboutInfo?.nom_etablissement || 'Alliance Française'}</h1>
          </div>

          <nav className="hidden md:flex justify-center space-x-10">
            <a href="#accueil" className="font-semibold transition-colors duration-200 text-white hover:text-white/80">Accueil</a>
            <a href="#services" className="font-semibold transition-colors duration-200 text-white hover:text-white/80">
              Services
            </a>
            <a href="#apropos" className="font-semibold transition-colors duration-200 text-white hover:text-white/80">
              À propos
            </a>
          </nav>

          <div>
            <Link
              to="/login"
              className="px-5 py-2.5 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg bg-white text-opacity-90 hover:text-opacity-100"
              style={{ color: COLORS.primary }}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Section Hero - Accueil avec overlay gradient */}
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(107,144,128,0.85) 0%, rgba(164,195,178,0.75) 100%)' }}></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center px-6 pt-24">
          <div className="inline-block mb-8">
            <img
              src={logoAFM}
              alt="Logo AFM"
              className="h-32 md:h-40 lg:h-48 object-contain drop-shadow-2xl mx-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg mb-4 text-white">
            {aboutInfo?.nom_etablissement || 'Alliance Française'}
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-white/95 font-light">
            Apprenez le français dans un cadre d'excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cours"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ backgroundColor: COLORS.primary }}
            >
              <BookOpenIcon className="w-6 h-6" />
              Consulter les cours
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white text-lg font-semibold rounded-xl transition-all duration-300 border-2 border-white/50 hover:bg-white hover:text-opacity-90"
              style={{ color: COLORS.white }}
            >
              <AcademicCapIcon className="w-6 h-6" />
              Nos Services
            </a>
          </div>
        </div>
      </section>

      {/* Section Services - Données dynamiques depuis type_service */}
      <section id="services" className="py-20 relative overflow-hidden" style={{ backgroundColor: COLORS.accent }}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: COLORS.primary }}>
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.text }}>Nos Services</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.textLight }}>
              Découvrez notre gamme complète de formations en français adaptées à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {typeServices.length > 0 ? (
              typeServices.map((service, idx) => (
                <div
                  key={service.id}
                  className="group rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-opacity-50 hover:-translate-y-2"
                  style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
                >
                  <div className="h-2" style={{ backgroundColor: COLORS.primary }}></div>
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ backgroundColor: COLORS.accent }}>
                      <span className="text-3xl font-bold" style={{ color: COLORS.primary }}>{service.nom_service?.charAt(0) || '?'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.text }}>{service.nom_service}</h3>
                    <p className="leading-relaxed" style={{ color: COLORS.textLight }}>
                      {service.libelle || 'Formation de qualité pour tous les niveaux.'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12" style={{ color: COLORS.textLight }}>
                <p>Aucun service disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section À propos - Description avec image local.jpg */}
      <section id="apropos" className="py-20" style={{ backgroundColor: COLORS.card }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: COLORS.secondary }}>
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.text }}>À propos de nous</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: COLORS.accent }}>
                <AcademicCapIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>Notre mission</span>
              </div>
              <h3 className="text-3xl font-bold mb-6" style={{ color: COLORS.text }}>
                Excellence et qualité pédagogique
              </h3>
              <p className="leading-relaxed text-lg mb-6" style={{ color: COLORS.textLight }}>
                {aboutInfo?.description || 'L\'Alliance Française propose des formations en français de qualité pour tous les publics.'}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.highlight }}>
                  <ClockIcon className="w-8 h-8 mb-2" style={{ color: COLORS.primary }} />
                  <p className="font-semibold" style={{ color: COLORS.text }}>Horaires flexibles</p>
                  <p className="text-sm" style={{ color: COLORS.textLight }}>Cours du lundi au samedi</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ backgroundColor: COLORS.highlight }}>
                  <AcademicCapIcon className="w-8 h-8 mb-2" style={{ color: COLORS.primary }} />
                  <p className="font-semibold" style={{ color: COLORS.text }}>Professeurs qualifiés</p>
                  <p className="text-sm" style={{ color: COLORS.textLight }}>Expérience certifiée</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 rounded-3xl opacity-20" style={{ backgroundColor: COLORS.secondary }}></div>
                <div className="absolute -bottom-4 -right-4 w-72 h-72 rounded-3xl opacity-20" style={{ backgroundColor: COLORS.primary }}></div>
                <img
                  src={localImg}
                  alt="Nos locaux"
                  className="relative w-full h-auto rounded-3xl shadow-2xl object-cover max-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16" style={{ background: COLORS.gradient, color: COLORS.white }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Logo et nom */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                {aboutInfo?.logo_url && (
                  <img src={aboutInfo.logo_url} alt="Logo" className="h-12 object-contain brightness-0 invert" />
                )}
                <span className="text-xl font-bold">{aboutInfo?.nom_etablissement}</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Apprenez le français avec des experts dans un cadre d'excellence.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-lg font-bold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#accueil" className="text-white/80 hover:text-white transition-colors">Accueil</a></li>
                <li><a href="#services" className="text-white/80 hover:text-white transition-colors">Services</a></li>
                <li><a href="#apropos" className="text-white/80 hover:text-white transition-colors">À propos</a></li>
                <li><Link to="/login" className="text-white/80 hover:text-white transition-colors">Se connecter</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{aboutInfo?.tel}</span>
                </div>
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{aboutInfo?.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{aboutInfo?.adresse}</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <ClockIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-white/80">
                    {aboutInfo?.jours_ouverture} de {aboutInfo?.heure_ouverture?.substring(0, 5)} à {aboutInfo?.heure_fermeture?.substring(0, 5)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/70">&copy; {new Date().getFullYear()} {aboutInfo?.nom_etablissement}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
