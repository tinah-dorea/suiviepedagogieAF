import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajouter token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Une erreur est survenue";
    return Promise.reject(new Error(message));
  }
);

export const getSessions = () => api.get('/sessions');
export const getSessionById = (id) => api.get(`/sessions/${id}`);
export const createSession = (data) => api.post('/sessions', data);
export const updateSession = (id, data) => api.put(`/sessions/${id}`, data);
export const deleteSession = (id) => api.delete(`/sessions/${id}`);
export const getActiveSessions = () => api.get('/sessions/actives');
export const getSessionsByProfesseur = () => api.get('/sessions/professeur'); // Add teacher-specific function

// Methods with the expected names
export const getAll = () => getSessions();
export const get = (id) => getSessionById(id);
export const create = (data) => createSession(data);
export const update = (id, data) => updateSession(id, data);
export const remove = (id) => deleteSession(id);

// Export as default object
const sessionService = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getActiveSessions,
  getSessionsByProfesseur, // Add to the exported object
  // Original methods
  getAll,
  get,
  create,
  update,
  remove
};

export default sessionService;