import api from './api';

const baseURL = '/horaires';

const horaireService = {
    // Récupérer tous les horaires
    getAll: async () => {
        try {
            const response = await api.get(baseURL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer un horaire par ID
    getById: async (id) => {
        try {
            const response = await api.get(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer les horaires par type de cours
    getByTypeCours: async (typeCoursId) => {
        try {
            const response = await api.get(`${baseURL}/type-cours/${typeCoursId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Créer un nouvel horaire
    create: async (data) => {
        try {
            const response = await api.post(baseURL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mettre à jour un horaire
    update: async (id, data) => {
        try {
            const response = await api.put(`${baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Supprimer un horaire
    delete: async (id) => {
        try {
            const response = await api.delete(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default horaireService;