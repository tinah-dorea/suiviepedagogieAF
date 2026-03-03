import api from './api';

const baseURL = '/type-cours';

const typeCoursService = {
    // Récupérer tous les types de cours
    getAll: async () => {
        try {
            const response = await api.get(baseURL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer un type de cours par ID
    getById: async (id) => {
        try {
            const response = await api.get(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer les types de cours par service
    getByService: async (serviceId) => {
        try {
            const response = await api.get(`${baseURL}/service/${serviceId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Créer un nouveau type de cours
    create: async (data) => {
        try {
            const response = await api.post(baseURL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mettre à jour un type de cours
    update: async (id, data) => {
        try {
            const response = await api.put(`${baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Supprimer un type de cours
    delete: async (id) => {
        try {
            const response = await api.delete(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default typeCoursService;