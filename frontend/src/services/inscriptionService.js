import api from './api';

const inscriptionService = {
  // Récupérer toutes les inscriptions
  getAll: async () => {
    try {
      const response = await api.get('/inscriptions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      throw error;
    }
  },

  // Récupérer une inscription par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/inscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'inscription:', error);
      throw error;
    }
  },

  // Créer une nouvelle inscription
  create: async (data) => {
    try {
      const response = await api.post('/inscriptions', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'inscription:', error);
      throw error;
    }
  },

  // Mettre à jour une inscription
  update: async (id, data) => {
    try {
      const response = await api.put(`/inscriptions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'inscription:', error);
      throw error;
    }
  },

  // Supprimer une inscription
  delete: async (id) => {
    try {
      const response = await api.delete(`/inscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'inscription:', error);
      throw error;
    }
  }
};

export default inscriptionService;
