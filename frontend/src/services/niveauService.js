import api from './api';

const baseURL = '/niveaux';

const niveauService = {
    // Récupérer tous les niveaux
    getAll: async () => {
        try {
            const response = await api.get(baseURL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer un niveau par ID
    getById: async (id) => {
        try {
            const response = await api.get(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Créer un nouveau niveau
    create: async (data) => {
        try {
            const response = await api.post(baseURL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mettre à jour un niveau
    update: async (id, data) => {
        try {
            const response = await api.put(`${baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Supprimer un niveau
    delete: async (id) => {
        try {
            const response = await api.delete(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default niveauService;