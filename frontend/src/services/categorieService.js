import api from './api';

const baseURL = '/categories';

const categorieService = {
    // Récupérer toutes les catégories
    getAll: async () => {
        try {
            const response = await api.get(baseURL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer une catégorie par ID
    getById: async (id) => {
        try {
            const response = await api.get(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer les catégories par type de cours
    getByTypeCours: async (typeCoursId) => {
        try {
            const response = await api.get(`${baseURL}/type-cours/${typeCoursId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Créer une nouvelle catégorie
    create: async (data) => {
        try {
            const response = await api.post(baseURL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mettre à jour une catégorie
    update: async (id, data) => {
        try {
            const response = await api.put(`${baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Supprimer une catégorie
    delete: async (id) => {
        try {
            const response = await api.delete(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default categorieService;