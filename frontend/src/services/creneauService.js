import api from './api';

const creneauService = {
  getAll: async () => {
    try {
      const response = await api.get('/creneaux');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/creneaux/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du créneau ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/creneaux', data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du créneau:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/creneaux/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du créneau ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/creneaux/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du créneau ${id}:`, error);
      throw error;
    }
  },

  // Get creneaux for the current professor
  getByProfesseur: async () => {
    try {
      const response = await api.get('/creneaux/professeur');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux par professeur:", error);
      throw error;
    }
  }
};

export default creneauService;