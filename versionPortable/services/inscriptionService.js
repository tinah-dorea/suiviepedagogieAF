import api from './api';

// Service pour gérer les inscriptions dans l'application mobile
// Utilise les mêmes endpoints que le frontend web

export const getInscriptions = () => api.get('/inscriptions');

export const getInscriptionById = (id) => api.get(`/inscriptions/${id}`);

export const createInscription = (data) => api.post('/inscriptions', data);

export const updateInscription = (id, data) => api.put(`/inscriptions/${id}`, data);

export const deleteInscription = (id) => api.delete(`/inscriptions/${id}`);

export const getInscriptionsBySession = (sessionId) => api.get(`/inscriptions/session/${sessionId}`);

export const getInscriptionsByTypeCours = (typeCoursId) => api.get(`/inscriptions/type-cours/${typeCoursId}`);

// Exporter un objet service pour une utilisation plus simple
const inscriptionService = {
  getInscriptions,
  getInscriptionById,
  createInscription,
  updateInscription,
  deleteInscription,
  getInscriptionsBySession,
  getInscriptionsByTypeCours
};

export default inscriptionService;