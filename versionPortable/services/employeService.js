import api from './api';

// Service pour gérer les employés dans l'application mobile
// Utilise les mêmes endpoints que le frontend web

export const getEmployes = () => api.get('/employes');

export const getRoles = () => api.get('/employes/roles');

export const createEmploye = (data) => api.post('/employes', data);

export const updateEmploye = (id, data) => api.put(`/employes/${id}`, data);

export const toggleStatus = (id, is_active) => api.patch(`/employes/${id}/status`, { is_active });

export const deleteEmploye = (id) => api.delete(`/employes/${id}`);

// Exporter un objet service pour une utilisation plus simple
const employeService = {
  getEmployes,
  getRoles,
  createEmploye,
  updateEmploye,
  toggleStatus,
  deleteEmploye
};

export default employeService;