import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon, EnvelopeIcon, PhoneIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { getServiceRoute, SERVICE_CONFIG } from '../../utils/auth';

// Modern Pastel Palette - matching ConsultationCours & HomePage
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
  error: '#EF4444',
  errorBg: '#FEF2F2',
  success: '#10B981',
  successBg: '#F0FDF4',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motPasse, setMotPasse] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();
  const servicesDisponibles = useMemo(() => Object.values(SERVICE_CONFIG).map((config) => config.aliases[0]), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!isLoginMode) {
      setMessage("L'inscription n'est pas encore disponible.");
      return;
    }

    // Vérifier qu'au moins un des champs (email ou téléphone) est rempli
    if (!email.trim() && !telephone.trim()) {
      setMessage("Veuillez entrer un email ou un numéro de téléphone.");
      return;
    }

    try {
      // Envoyer les données d'identification avec email ou téléphone
      const loginData = {};
      if (email.trim()) {
        loginData.email = email;
      } else if (telephone.trim()) {
        loginData.telephone = telephone;
      }
      loginData.mot_passe = motPasse;

      // Connexion unifiée : employe ou apprenant (une seule requête)
      const res = await api.post('/auth/login', loginData);
      
      // Stockage dans localStorage
      localStorage.setItem('token', res.data.token);

      // Store user data (employee or student)
      const userData = res.data.employe || res.data.student;
      localStorage.setItem('user', JSON.stringify(userData));

      setMessage('✅ Connexion réussie ! Redirection...');

      // Redirection basée sur le service
      const userService = userData.service;
      const redirectPath = getServiceRoute(userService);
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        setMessage(`Service "${userService}" non reconnu. Services valides : ${servicesDisponibles.join(', ')}`);
      }
      
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Erreur de connexion. Vérifiez vos identifiants."
      );
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.bg }}>
      {/* Left side - Decorative gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: COLORS.gradient }}>
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
            <AcademicCapIcon className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Alliance Française Mahajanga</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-lg mb-12 font-light leading-relaxed">
            Apprenez le français dans un cadre d'excellence
          </p>
          <div className="flex flex-col gap-5 text-white/85">
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">Formations de qualité</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">Professeurs certifiés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-8 text-sm font-semibold transition-colors duration-200"
            style={{ color: COLORS.textLight }}
            onMouseEnter={(e) => e.target.style.color = COLORS.primary}
            onMouseLeave={(e) => e.target.style.color = COLORS.textLight}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Retour à l'accueil
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10" style={{ border: `1px solid ${COLORS.border}` }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: COLORS.gradient }}>
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
                Authentification
              </h2>
              <p className="text-sm" style={{ color: COLORS.textLight }}>
                Connectez-vous à votre espace personnel
              </p>
            </div>

            {/* Message d'état */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-start gap-3 ${message.includes('✅') ? '' : ''}`}
                style={{
                  backgroundColor: message.includes('✅') ? COLORS.successBg : COLORS.errorBg,
                  color: message.includes('✅') ? COLORS.success : COLORS.error,
                }}
              >
                <span className="flex-1 text-sm font-medium">{message}</span>
              </div>
            )}

        {/* Formulaire de Connexion */}
        {isLoginMode ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email ou Téléphone */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                Email ou Téléphone
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <EnvelopeIcon className={`w-5 h-5 transition-colors ${focused === 'email' ? '' : ''}`} style={{ color: focused === 'email' ? COLORS.primary : COLORS.textLight }} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none text-sm`}
                    style={{
                      borderColor: focused === 'email' ? COLORS.primary : COLORS.border,
                      backgroundColor: COLORS.bg,
                      color: COLORS.text,
                    }}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if(e.target.value) setTelephone('');
                    }}
                  />
                </div>
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <PhoneIcon className={`w-5 h-5 transition-colors`} style={{ color: focused === 'tel' ? COLORS.primary : COLORS.textLight }} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none text-sm`}
                    style={{
                      borderColor: focused === 'tel' ? COLORS.primary : COLORS.border,
                      backgroundColor: COLORS.bg,
                      color: COLORS.text,
                    }}
                    onFocus={() => setFocused('tel')}
                    onBlur={() => setFocused(null)}
                    value={telephone}
                    onChange={(e) => {
                      setTelephone(e.target.value);
                      if(e.target.value) setEmail('');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  className={`w-full pl-4 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none text-sm`}
                  style={{
                    borderColor: focused === 'password' ? COLORS.primary : COLORS.border,
                    backgroundColor: COLORS.bg,
                    color: COLORS.text,
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  value={motPasse}
                  onChange={(e) => setMotPasse(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 transition-colors duration-200"
                  style={{ color: COLORS.textLight }}
                  onMouseEnter={(e) => e.target.style.color = COLORS.primary}
                  onMouseLeave={(e) => e.target.style.color = COLORS.textLight}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none shadow-lg hover:shadow-xl"
              style={{
                background: COLORS.gradient,
                boxShadow: '0 4px 14px 0 rgba(107, 144, 128, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              Se connecter
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: COLORS.accent }}>
              <AcademicCapIcon className="w-8 h-8" style={{ color: COLORS.primary }} />
            </div>
            <p className="font-semibold mb-2" style={{ color: COLORS.text }}>L'inscription n'est pas encore disponible.</p>
            <p className="text-sm" style={{ color: COLORS.textLight }}>
              Contactez votre administrateur pour obtenir un compte.
            </p>
          </div>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}