import api from './api';

const baseURL = '/type-services';

const typeServiceService = {
    // Récupérer tous les types de service
    getAll: async () => {
        try {
            const response = await api.get(baseURL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer un type de service par ID
    getById: async (id) => {
        try {
            const response = await api.get(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Créer un nouveau type de service
    create: async (data) => {
        try {
            const response = await api.post(baseURL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mettre à jour un type de service
    update: async (id, data) => {
        try {
            const response = await api.put(`${baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Supprimer un type de service
    delete: async (id) => {
        try {
            const response = await api.delete(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default typeServiceService;