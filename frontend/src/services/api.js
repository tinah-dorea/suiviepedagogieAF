import axios from 'axios';

// Création d'une instance Axios avec une configuration centralisée.
// L'URL de base pointe vers votre serveur backend qui tourne sur le port 5000.
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL de base pour toutes les requêtes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête sortante.
// Cela garantit que toutes les routes protégées du backend recevront le token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Ajoute l'en-tête 'Authorization' si un token est trouvé dans le localStorage
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;