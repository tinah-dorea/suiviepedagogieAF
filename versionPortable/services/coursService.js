import api from './api';

// Service pour gérer les cours dans l'application mobile
// Utilise les mêmes endpoints que le frontend web

export const getTypeCours = () => api.get('/type-cours');

export const getCategories = () => api.get('/categories');

export const getNiveaux = () => api.get('/niveaux');

export const getSessions = () => api.get('/sessions');

export const getSessionCours = () => api.get('/session-cours');

export const getCreneaux = () => api.get('/horaires');

export const createTypeCours = (data) => api.post('/type-cours', data);

export const createCategorie = (data) => api.post('/categories', data);

export const createNiveau = (data) => api.post('/niveaux', data);

export const createSession = (data) => api.post('/sessions', data);

export const createSessionCours = (data) => api.post('/session-cours', data);

export const createCreneau = (data) => api.post('/horaires', data);

// Exporter un objet service pour une utilisation plus simple
const coursService = {
  getTypeCours,
  getCategories,
  getNiveaux,
  getSessions,
  getSessionCours,
  getCreneaux,
  createTypeCours,
  createCategorie,
  createNiveau,
  createSession,
  createSessionCours,
  createCreneau
};

export default coursService;