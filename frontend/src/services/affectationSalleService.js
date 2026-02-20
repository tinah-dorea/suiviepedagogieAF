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

export const getAffectations = () => api.get('/affectation-salle');
export const getAffectationById = (id) => api.get(`/affectation-salle/${id}`);
export const createAffectation = (data) => api.post('/affectation-salle', data);
export const updateAffectation = (id, data) => api.put(`/affectation-salle/${id}`, data);
export const deleteAffectation = (id) => api.delete(`/affectation-salle/${id}`);

// Méthodes avec les noms attendus
export const getAll = () => getAffectations();
export const get = (id) => getAffectationById(id);
export const create = (data) => createAffectation(data);
export const update = (id, data) => updateAffectation(id, data);
export const remove = (id) => deleteAffectation(id);

// Exporter comme objet par défaut
const affectationSalleService = {
  getAffectations,
  getAffectationById,
  createAffectation,
  updateAffectation,
  deleteAffectation,
  // Méthodes originales
  getAll,
  get,
  create,
  update,
  remove
};

export default affectationSalleService;