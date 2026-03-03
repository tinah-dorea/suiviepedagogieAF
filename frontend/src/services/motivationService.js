import api from './api';

const motivationService = {
  getAll: async () => {
    const response = await api.get('/motivations');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/motivations/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/motivations', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/motivations/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/motivations/${id}`);
    return response.data;
  }
};

export default motivationService;
