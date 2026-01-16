import api from './api';

// Service d'authentification pour l'application mobile
// Utilise les mêmes endpoints que le frontend web

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Stocker le token dans AsyncStorage (nécessite l'installation de @react-native-async-storage/async-storage)
    const storage = await import('@react-native-async-storage/async-storage');
    await storage.default.setItem('token', response.token);
    await storage.default.setItem('user', JSON.stringify(response.user));
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    // Supprimer le token et les données utilisateur
    const storage = await import('@react-native-async-storage/async-storage');
    await storage.default.removeItem('token');
    await storage.default.removeItem('user');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const storage = await import('@react-native-async-storage/async-storage');
    const userData = await storage.default.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const storage = await import('@react-native-async-storage/async-storage');
    const token = await storage.default.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};