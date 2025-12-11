import api from './api';

const examenService = {
  // Récupérer tous les examens
  getAll: async () => {
    try {
      const response = await api.get('/examens');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des examens:', error);
      throw error;
    }
  },

  // Récupérer un examen par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/examens/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'examen:', error);
      throw error;
    }
  },

  // Créer un nouvel examen
  create: async (data) => {
    try {
      const response = await api.post('/examens', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'examen:', error);
      throw error;
    }
  },

  // Mettre à jour un examen
  update: async (id, data) => {
    try {
      const response = await api.put(`/examens/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'examen:', error);
      throw error;
    }
  },

  // Supprimer un examen
  delete: async (id) => {
    try {
      const response = await api.delete(`/examens/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'examen:', error);
      throw error;
    }
  }
};

export default examenService;
