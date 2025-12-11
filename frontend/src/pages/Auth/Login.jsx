import { useState, useMemo } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { getServiceRoute, SERVICE_CONFIG } from '../../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [motPasse, setMotPasse] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const servicesDisponibles = useMemo(() => Object.values(SERVICE_CONFIG).map((config) => config.aliases[0]), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!isLoginMode) {
      setMessage("L'inscription n'est pas encore disponible.");
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        email,
        mot_passe: motPasse,
      });
      
      // Stockage dans localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.employe));
      
      setMessage('✅ Connexion réussie ! Redirection...');
      
      // Redirection basée sur le service
      const userService = res.data.employe.service;
      console.log("Service de l'utilisateur:", userService);
      
      if (!userService) {
        console.log("Service manquant dans la réponse:", res.data.employe);
        setMessage("Veuillez contacter l'administrateur pour définir votre service");
        return;
      }

      const redirectPath = getServiceRoute(userService);
      if (redirectPath) {
        console.log(`Redirection vers ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      } else {
        console.log("Service non reconnu:", userService);
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
    <div className="min-h-screen flex justify-center items-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md" style={{ border: '1px solid #E5E7EB' }}>
        
        {/* Header avec logo Alliance Française */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center mb-6 text-sm transition-colors duration-200"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => e.target.style.color = '#374151'}
            onMouseLeave={(e) => e.target.style.color = '#6B7280'}
          >
            
          </button>
          
          <div className="text-center">
            {/* Logo stylisé Alliance Française */}
            <div className="mb-4">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
                style={{ backgroundColor: '#FEF2F2' }}
              >
                <span className="text-2xl font-bold" style={{ color: '#DC2626' }}>af</span>
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#1F2937' }}>
                Alliance<span style={{ color: '#6B7280' }}> Française</span>
              </h1>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#DC2626' }}>
              Authentification
            </h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Connexion vous à votre compte ou contacter le responsable
            </p>
          </div>
        </div>

        {/* Onglets améliorés */}
        <div className="flex rounded-xl p-1 mb-6" style={{ backgroundColor: '#F3F4F6' }}>
          <button 
            className={`flex-1 py-3 text-sm rounded-lg transition-all duration-200 ${
              isLoginMode 
                ? 'bg-white shadow-lg font-semibold' 
                : 'hover:bg-white hover:bg-opacity-50'
            }`}
            style={{ 
              color: isLoginMode ? '#1F2937' : '#6B7280'
            }}
            onClick={() => setIsLoginMode(true)}
          >
            Connexion
          </button>
        
        </div>

        {/* Formulaire de Connexion */}
        {isLoginMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                className="block text-sm font-semibold mb-2" 
                style={{ color: '#1F2937' }}
              >
                Email *
              </label>
              <input
                type="email"
                placeholder="votre.email@alliancefrancaise.org"
                className="w-full p-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4"
                style={{ 
                  borderColor: '#D1D5DB',
                  fontSize: '16px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#DC2626';
                  e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-semibold mb-2" 
                style={{ color: '#1F2937' }}
              >
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  className="w-full p-4 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4"
                  style={{ 
                    borderColor: '#D1D5DB',
                    fontSize: '16px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#DC2626';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                  value={motPasse}
                  onChange={(e) => setMotPasse(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 transition-colors duration-200"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={(e) => e.target.style.color = '#374151'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              
              <button 
                type="button" 
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: '#DC2626' }}
                onMouseEnter={(e) => e.target.style.color = '#B91C1C'}
                onMouseLeave={(e) => e.target.style.color = '#DC2626'}
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4"
              style={{ 
                backgroundColor: '#DC2626',
                boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#B91C1C';
                e.target.style.boxShadow = '0 6px 20px 0 rgba(185, 28, 28, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#DC2626';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(220, 38, 38, 0.3)';
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 4px 14px 0 rgba(220, 38, 38, 0.3)';
              }}
            >
              Se connecter
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F3F4F6' }}
            >
              <svg className="w-8 h-8" style={{ color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p style={{ color: '#6B7280' }}>L'inscription n'est pas encore disponible.</p>
            <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>
              Contactez votre administrateur pour obtenir un compte.
            </p>
          </div>
        )}

        {/* Message d'état */}
        {message && (
          <div 
            className={`mt-6 p-4 rounded-xl text-center text-sm font-medium border ${
              message.includes('✅') 
                ? 'text-green-700' 
                : 'text-red-700'
            }`}
            style={{
              backgroundColor: message.includes('✅') ? '#F0FDF4' : '#FEF2F2',
              borderColor: message.includes('✅') ? '#BBF7D0' : '#FECACA'
            }}
          >
            {message}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid #F3F4F6' }}>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            © 2024 Alliance Française. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}