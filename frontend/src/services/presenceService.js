import api from './api';

const presenceService = {
  // Récupérer toutes les présences
  getAll: async () => {
    try {
      const response = await api.get('/presences');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
      throw error;
    }
  },

  // Récupérer une présence par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/presences/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la présence:', error);
      throw error;
    }
  },

  // Enregistrer la présence
  recordAttendance: async (data) => {
    try {
      const response = await api.post('/presences', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
      throw error;
    }
  },

  // Mettre à jour une présence
  update: async (id, data) => {
    try {
      const response = await api.put(`/presences/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      throw error;
    }
  },

  // Supprimer une présence
  delete: async (id) => {
    try {
      const response = await api.delete(`/presences/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la présence:', error);
      throw error;
    }
  },

  // Récupérer les présences d'un groupe
  getByGroupe: async (groupeId) => {
    try {
      const response = await api.get(`/presences/groupe/${groupeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences du groupe:', error);
      throw error;
    }
  },

  // Récupérer les présences d'un apprenant
  getByApprenant: async (apprenantId) => {
    try {
      const response = await api.get(`/presences/apprenant/${apprenantId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences de l\'apprenant:', error);
      throw error;
    }
  }
};

export default presenceService;
