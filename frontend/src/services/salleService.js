import api from './api';

const salleService = {
  // Récupérer toutes les salles
  getAll: async () => {
    try {
      const response = await api.get('/salles');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des salles:', error);
      throw error;
    }
  },

  // Récupérer une salle par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/salles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la salle:', error);
      throw error;
    }
  },

  // Créer une nouvelle salle
  create: async (data) => {
    try {
      const response = await api.post('/salles', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la salle:', error);
      throw error;
    }
  },

  // Mettre à jour une salle
  update: async (id, data) => {
    try {
      const response = await api.put(`/salles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la salle:', error);
      throw error;
    }
  },

  // Supprimer une salle
  delete: async (id) => {
    try {
      const response = await api.delete(`/salles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la salle:', error);
      throw error;
    }
  }
};

export default salleService;
