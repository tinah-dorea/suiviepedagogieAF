import axios from 'axios';

// Création d'une instance Axios avec une configuration centralisée
// L'URL de base pointe vers votre serveur backend qui tourne sur le port 5000
// Remarque : Sur un appareil mobile, localhost ne fait pas référence à l'hôte, donc on utilise l'IP locale
const BACKEND_URL = __DEV__ 
  ? 'http://192.168.1.100:5000/api'  // Remplacez avec votre IP locale
  : 'http://your-production-url.com/api'; // URL de production

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête sortante
// Cela garantit que toutes les routes protégées du backend recevront le token
api.interceptors.request.use(
  async (config) => {
    // Dans React Native, AsyncStorage est utilisé à la place de localStorage
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Une erreur est survenue";
    return Promise.reject(new Error(message));
  }
);

// Fonction pour récupérer le token stocké dans l'application mobile
const getToken = async () => {
  // Nous utilisons AsyncStorage de @react-native-async-storage/async-storage
  // Cette bibliothèque doit être installée séparément
  try {
    const storage = await import('@react-native-async-storage/async-storage');
    return await storage.default.getItem('token');
  } catch (error) {
    console.warn('AsyncStorage non disponible', error);
    return null;
  }
};

export default api;