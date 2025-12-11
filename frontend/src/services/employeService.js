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

export const getEmployes = () => api.get('/employes');
export const getRoles = () => api.get('/employes/roles');
export const createEmploye = (data) => api.post('/employes', data);
export const updateEmploye = (id, data) => api.put(`/employes/${id}`, data);
export const toggleStatus = (id, is_active) => api.patch(`/employes/${id}/status`, { is_active });
export const deleteEmploye = (id) => api.delete(`/employes/${id}`);