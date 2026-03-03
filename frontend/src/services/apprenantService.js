import api from './api';

const apprenantService = {
  // Récupérer tous les apprenants
  getAll: async () => {
    try {
      const response = await api.get('/apprenants');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des apprenants:', error);
      throw error;
    }
  },

  // Récupérer un apprenant par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/apprenants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'apprenant:', error);
      throw error;
    }
  },

  // Créer un apprenant
  create: async (data) => {
    try {
      const response = await api.post('/apprenants', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'apprenant:', error);
      throw error;
    }
  },

  // Mettre à jour un apprenant
  update: async (id, data) => {
    try {
      const response = await api.put(`/apprenants/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'apprenant:', error);
      throw error;
    }
  },

  // Supprimer un apprenant
  remove: async (id) => {
    try {
      const response = await api.delete(`/apprenants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'apprenant:', error);
      throw error;
    }
  },

  // Rechercher des apprenants par nom ou prénom
  search: async (query) => {
    try {
      const response = await api.get('/apprenants/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'apprenants:', error);
      throw error;
    }
  }
};

export default apprenantService;
