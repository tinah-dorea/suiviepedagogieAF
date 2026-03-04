import api from './api';

const groupeService = {
  getAll: async () => {
    try {
      const response = await api.get('/groupes');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
      throw error;
    }
  },

  getByProfesseur: async () => {
    try {
      const response = await api.get('/groupes/professeur');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes du professeur:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/groupes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du groupe ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/groupes', data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/groupes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du groupe ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/groupes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du groupe ${id}:`, error);
      throw error;
    }
  }
};

export default groupeService;